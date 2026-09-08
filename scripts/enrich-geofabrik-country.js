#!/usr/bin/env node
/**
 * Safely orchestrates the existing offline Geofabrik PBF pipeline for every
 * canonical city in a country. The default workflow is report-only: it never
 * changes a city module or index. Applying a reviewed result requires an
 * explicit --city selection, existing city data owner, and --apply-reviewed.
 *
 * Examples:
 *   node scripts/enrich-geofabrik-country.js --country UA --input .cache/geofabrik/ukraine-latest.osm.pbf --all-cities --report-only
 *   node scripts/enrich-geofabrik-country.js --country UA --input .cache/geofabrik/ukraine-latest.osm.pbf --city ua:odesa --apply-reviewed
 */
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const DEFAULT_RADIUS_KM = 30;
let GEO_ENTITIES;
let extractOsmPoiCandidates;
let mergeOsmPoiCandidates;
let CITIES_BY_COUNTRY;

function fail(message) {
  throw new Error(`Geofabrik country enrichment: ${message}`);
}

async function loadLocalCatalogKey() {
  if (process.env.GEO_CATALOG_DECRYPTION_KEY) return;
  try {
    const env = await readFile(join(SCRIPT_DIRECTORY, '..', '.env'), 'utf8');
    const line = env.split(/\r?\n/u).find((item) => item.startsWith('GEO_CATALOG_DECRYPTION_KEY='));
    const value = line?.slice('GEO_CATALOG_DECRYPTION_KEY='.length).trim();
    if (value) process.env.GEO_CATALOG_DECRYPTION_KEY = value;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

function parseArgs(argv) {
  const options = { cities: [], allCities: false, reportOnly: false, applyReviewed: false, radiusKm: DEFAULT_RADIUS_KM };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--all-cities') options.allCities = true;
    else if (arg === '--report-only') options.reportOnly = true;
    else if (arg === '--apply-reviewed') options.applyReviewed = true;
    else if (arg === '--country' || arg === '--input' || arg === '--output' || arg === '--city' || arg === '--radius-km') {
      const value = argv[++index];
      if (!value) fail(`${arg} requires a value`);
      if (arg === '--city') options.cities.push(value);
      else if (arg === '--radius-km') options.radiusKm = Number(value);
      else options[arg.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = value;
    } else fail(`unknown argument ${arg}`);
  }
  options.country = String(options.country || '').toUpperCase();
  if (!/^[A-Z]{2}$/.test(options.country) || !options.input) fail('expected --country <ISO-2> and --input <country.osm.pbf>');
  if (options.allCities === (options.cities.length > 0)) fail('use exactly one of --all-cities or one or more --city values');
  if (!Number.isFinite(options.radiusKm) || options.radiusKm < 5 || options.radiusKm > 100) fail('--radius-km must be between 5 and 100');
  if (options.reportOnly && options.applyReviewed) fail('use either --report-only or --apply-reviewed');
  if (!options.reportOnly && !options.applyReviewed) options.reportOnly = true;
  if (options.applyReviewed && !options.cities.length) fail('--apply-reviewed requires explicit --city values; it never applies every city at once');
  options.output ||= join('.cache', 'geo-enrichment', `${options.country.toLowerCase()}-city-report.json`);
  return options;
}

function citySlug(city) {
  return city.id.split(':').at(-1);
}

function exportName(city) {
  return `${city.country}_${citySlug(city).replace(/[^a-zA-Z0-9]+/g, '_').toUpperCase()}_OSM_POI_ENTITIES`;
}

function bboxAround(center, radiusKm) {
  const latitudeDelta = radiusKm / 111.32;
  const longitudeDelta = radiusKm / (111.32 * Math.max(Math.cos(center.lat * Math.PI / 180), 0.1));
  return [
    center.lat - latitudeDelta,
    center.lng - longitudeDelta,
    center.lat + latitudeDelta,
    center.lng + longitudeDelta,
  ].map((value) => Number(value.toFixed(6))).join(',');
}

function normalizedCityName(value) {
  return String(value ?? '').normalize('NFKD').replace(/\p{M}/gu, '').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

function cityIdFor(country, canonicalName) {
  const slug = normalizedCityName(canonicalName).replace(/\s+/gu, '-');
  return `${country.toLocaleLowerCase()}:${slug}`;
}

function boundaryNamesFor(city) {
  const lexical = (CITIES_BY_COUNTRY[city.country] || []).find((entry) => normalizedCityName(entry.canonical) === normalizedCityName(city.canonicalName));
  const aliases = lexical ? Object.values(lexical.aliases || {}).flat() : [];
  return [...new Set([city.canonicalName, ...aliases].map((name) => String(name).trim()).filter(Boolean))];
}

function cityNames(city) {
  return boundaryNamesFor(city).map(normalizedCityName);
}

async function fillMissingCityCenters(cities, options) {
  const missing = cities.filter((city) => !city.center);
  if (!missing.length) return cities;
  const output = join('.cache', 'geo-enrichment', `${options.country.toLowerCase()}-city-centers.json`);
  await runNode('import-geofabrik-pbf.js', [
    '--input', options.input, '--country', options.country,
    ...missing.flatMap((city) => cityNames(city).map((name) => ['--locate-city', name])).flat(),
    '--output', output,
  ]);
  const collection = JSON.parse(await readFile(output, 'utf8'));
  const candidates = Array.isArray(collection.candidates) ? collection.candidates : [];
  return cities.map((city) => {
    if (city.center) return city;
    const names = new Set(cityNames(city));
    const matches = candidates.filter((candidate) => Object.values(candidate.names || {})
      .flatMap((value) => String(value).split(';'))
      .some((name) => names.has(normalizedCityName(name))));
    // A single named OSM city/town node is defensible offline source evidence.
    // Ambiguous matches are deliberately left for review rather than guessing.
    if (matches.length !== 1) return { ...city, centerCandidates: matches };
    return { ...city, center: matches[0].center, osm: matches[0].osm, source: 'osm' };
  });
}

async function selectedCities(options) {
  const anchored = GEO_ENTITIES.filter((entity) => entity.country === options.country && entity.type === 'city' && entity.center);
  const anchoredByName = new Map(anchored.map((city) => [normalizedCityName(city.canonicalName), city]));
  const all = (CITIES_BY_COUNTRY[options.country] || []).map((city) => anchoredByName.get(normalizedCityName(city.canonical)) || ({
    id: cityIdFor(options.country, city.canonical),
    country: options.country,
    type: 'city',
    canonicalName: city.canonical,
    center: null,
  })).sort((left, right) => left.id.localeCompare(right.id));
  const resolved = await fillMissingCityCenters(all, options);
  if (options.allCities) return resolved;
  const requested = new Set(options.cities.map((value) => value.toLocaleLowerCase()));
  const result = resolved.filter((city) => requested.has(city.id.toLocaleLowerCase()) || requested.has(city.canonicalName.toLocaleLowerCase()));
  if (result.length !== requested.size) {
    const resolved = new Set(result.flatMap((city) => [city.id.toLocaleLowerCase(), city.canonicalName.toLocaleLowerCase()]));
    fail(`unknown city selection: ${[...requested].filter((value) => !resolved.has(value)).join(', ')}`);
  }
  return result;
}

function runNode(script, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [join(SCRIPT_DIRECTORY, script), ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', (code) => code === 0 ? resolve(stdout.trim()) : reject(new Error(`${script} exited ${code}: ${(stderr || stdout).trim()}`)));
  });
}

function currentCityEntities(city, { replacingGenerated = false } = {}) {
  return GEO_ENTITIES.filter((entity) => entity.country === city.country
    && (entity.parentId === city.id || entity.parentId?.startsWith(`${city.id}:`))
    && !(replacingGenerated && entity.source === 'osm' && entity.sourceNames && entity.id.startsWith(`${city.id}:poi:`)));
}

function summarizeCandidates(collection, city, replacingGenerated) {
  const existing = currentCityEntities(city, { replacingGenerated });
  const candidates = extractOsmPoiCandidates(collection.features, { country: city.country, city: city.canonicalName, parentId: city.id });
  const merged = mergeOsmPoiCandidates(candidates, existing);
  const existingIds = new Set(existing.map((entity) => entity.id));
  const existingOsm = new Set(existing.filter((entity) => entity.osm).map((entity) => `${entity.osm.type}:${entity.osm.id}`));
  const additions = merged.filter((entity) => !existingIds.has(entity.id)
    && (!entity.osm || !existingOsm.has(`${entity.osm.type}:${entity.osm.id}`)));
  const types = Object.fromEntries([...new Set(additions.map((entity) => entity.type))].sort().map((type) => [type, additions.filter((entity) => entity.type === type).length]));
  return { sourceFeatures: collection.features.length, candidates: candidates.length, additions: additions.length, types };
}

async function exists(path) {
  try { await stat(path); return true; } catch { return false; }
}

async function registerGeneratedModule(indexPath, name) {
  let source = await readFile(indexPath, 'utf8');
  const importLine = `import { ${name} } from './osm-poi.js';`;
  if (!source.includes(importLine)) {
    const exportOffset = source.indexOf('\nexport const ');
    if (exportOffset < 0) fail(`cannot find canonical entity export in ${indexPath}`);
    source = `${source.slice(0, exportOffset)}\n${importLine}${source.slice(exportOffset)}`;
  }
  if (!source.includes(`...${name},`)) {
    const closingOffset = source.lastIndexOf(']);');
    if (closingOffset < 0) fail(`cannot find entity-array closing in ${indexPath}`);
    source = `${source.slice(0, closingOffset)}  ...${name},\n${source.slice(closingOffset)}`;
  }
  await writeFile(indexPath, source);
}

async function processCity(city, options) {
  const slug = citySlug(city);
  const cityDirectory = join('data-source', city.country.toLowerCase(), slug);
  const indexPath = join(cityDirectory, 'index.js');
  const featurePath = join('.cache', 'geo-enrichment', `${city.country.toLowerCase()}-${slug}-poi.json`);
  const outputPath = join(cityDirectory, 'osm-poi.js');
  const base = {
    cityId: city.id,
    canonical: city.canonicalName,
    boundaryNames: boundaryNamesFor(city),
    bbox: city.center ? bboxAround(city.center, options.radiusKm) : null,
    cityOwner: await exists(indexPath),
  };

  if (!city.center) return { ...base, status: 'needs-city-center', centerCandidates: city.centerCandidates?.length || 0 };

  try {
    const importOutput = await runNode('import-geofabrik-pbf.js', [
      '--input', options.input, '--country', city.country, '--city', city.canonicalName,
      '--parent-id', city.id, '--bbox', base.bbox,
      ...base.boundaryNames.flatMap((name) => ['--boundary-name', name]),
      '--output', featurePath,
    ]);
    const collection = JSON.parse(await readFile(featurePath, 'utf8'));
    const summary = summarizeCandidates(collection, city, await exists(outputPath));
    if (!options.applyReviewed) return { ...base, status: base.cityOwner ? 'report-ready' : 'needs-city-owner', importOutput, ...summary };
    if (!base.cityOwner) return { ...base, status: 'not-applied-no-city-owner', importOutput, ...summary };

    const generatorOutput = await runNode('generate-osm-poi-module.js', [
      '--replace-generated', '--input', featurePath, '--country', city.country, '--city', city.canonicalName,
      '--parent-id', city.id, '--export', exportName(city), '--output', outputPath,
    ]);
    await registerGeneratedModule(indexPath, exportName(city));
    return { ...base, status: 'applied', importOutput, generatorOutput, ...summary };
  } catch (error) {
    return { ...base, status: 'failed', error: error.message };
  }
}

await loadLocalCatalogKey();
({ GEO_ENTITIES } = await import('../src/catalog.js'));
({ extractOsmPoiCandidates, mergeOsmPoiCandidates } = await import('../src/osm-poi-import.js'));
({ CITIES_BY_COUNTRY } = await import('@whiteslove/parsing-lexicon/geography'));

const options = parseArgs(process.argv.slice(2));
const cities = await selectedCities(options);
const results = [];
for (const [index, city] of cities.entries()) {
  console.log(`[${index + 1}/${cities.length}] ${city.id}`);
  results.push(await processCity(city, options));
}
const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  country: options.country,
  mode: options.applyReviewed ? 'apply-reviewed' : 'report-only',
  radiusKm: options.radiusKm,
  results,
};
await mkdir(dirname(options.output), { recursive: true });
await writeFile(options.output, `${JSON.stringify(report, null, 2)}\n`);
const counts = Object.fromEntries([...new Set(results.map((result) => result.status))].sort().map((status) => [status, results.filter((result) => result.status === status).length]));
console.log(`Wrote ${options.output}: ${JSON.stringify(counts)}`);
