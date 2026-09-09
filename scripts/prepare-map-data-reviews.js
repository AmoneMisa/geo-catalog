#!/usr/bin/env node
/**
 * Converts cached `map-data` extracts into deterministic, human-reviewable
 * non-POI candidates. It never writes runtime catalog modules.
 */
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const STREET_HIGHWAYS = new Set(['motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'unclassified', 'residential', 'living_street', 'pedestrian']);
const LOCAL_PLACES = new Set(['neighbourhood', 'suburb', 'quarter', 'locality']);
const COMPLEX_PATTERN = /(?:\bzhk\b|жк|residence|tjm|residential\s+complex|tur[a-z]*\s+joy\s+majmuasi)/iu;

function fail(message) { throw new Error(`Map-data review preparation: ${message}`); }
function normalize(value) { return String(value ?? '').normalize('NFKD').replace(/\p{M}/gu, '').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim(); }
function nameFor(tags) { return String(tags.name || tags['name:en'] || tags.official_name || '').trim(); }

function classify(tags, osmType) {
  const name = nameFor(tags);
  if (!name) return null;
  if (osmType === 'way' && STREET_HIGHWAYS.has(tags.highway)) return 'street';
  if (tags.boundary === 'administrative' && tags.admin_level === '8' && /(?:mahalla|mfy)/iu.test(name)) return 'mahalla';
  if (LOCAL_PLACES.has(tags.place)) return 'local_area';
  if (COMPLEX_PATTERN.test(name) || (['apartments', 'residential'].includes(tags.building) && (tags.residential || tags['building:use'] === 'residential'))) return 'residential_complex';
  if (tags.landuse === 'residential') return 'local_area';
  return null;
}

function sourceNames(tags, canonicalName) {
  const names = new Set([canonicalName]);
  for (const [key, value] of Object.entries(tags)) if (key === 'name' || key.startsWith('name:') || ['alt_name', 'old_name', 'official_name', 'short_name'].includes(key)) {
    for (const item of String(value).split(';')) if (item.trim()) names.add(item.trim());
  }
  return [...names];
}

function prepare(features, scope) {
  const groups = new Map();
  for (const feature of features) {
    const properties = feature?.properties || {};
    const tags = properties.tags || {};
    const type = classify(tags, properties.osm_type);
    const [lng, lat] = feature?.geometry?.coordinates || [];
    const osmId = Number(properties.osm_id);
    const canonicalName = nameFor(tags);
    if (!type || !Number.isFinite(lat) || !Number.isFinite(lng) || !Number.isInteger(osmId) || !['node', 'way', 'relation'].includes(properties.osm_type)) continue;
    const key = `${type}|${normalize(canonicalName)}`;
    const group = groups.get(key) || { type, canonicalName, centers: [], osm: [], aliases: new Set() };
    group.centers.push({ lat, lng });
    group.osm.push({ type: properties.osm_type, id: osmId });
    sourceNames(tags, canonicalName).forEach((alias) => group.aliases.add(alias));
    groups.set(key, group);
  }
  const entities = [...groups.values()].map((group) => {
    const preferred = [...group.osm].sort((a, b) => a.type.localeCompare(b.type) || a.id - b.id)[0];
    const center = group.centers.reduce((sum, point) => ({ lat: sum.lat + point.lat, lng: sum.lng + point.lng }), { lat: 0, lng: 0 });
    center.lat /= group.centers.length;
    center.lng /= group.centers.length;
    return {
      type: group.type,
      canonicalName: group.canonicalName,
      parentId: scope.parentId,
      country: scope.country,
      center,
      osm: preferred,
      concordances: { osm: [...new Map(group.osm.map((item) => [`${item.type}:${item.id}`, item])).values()] },
      sourceNames: [...group.aliases].sort((a, b) => a.localeCompare(b)),
    };
  }).sort((a, b) => a.type.localeCompare(b.type) || normalize(a.canonicalName).localeCompare(normalize(b.canonicalName)));
  const byType = Object.fromEntries([...new Set(entities.map((entity) => entity.type))].sort().map((type) => [type, entities.filter((entity) => entity.type === type).length]));
  return { schemaVersion: 1, type: 'GeoCatalogMapDataReview', approved: false, source: 'OpenStreetMap', scope, summary: { sourceFeatures: features.length, candidates: entities.length, byType }, entities };
}

function parseArgs(argv) {
  const options = { country: 'UZ', inputDir: join('.cache', 'geo-enrichment'), outputDir: join('.cache', 'geo-review') };
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index]; const value = argv[++index];
    if (!key?.startsWith('--') || !value) fail('expected optional --country, --input-dir and --output-dir');
    if (key === '--country') options.country = value.toUpperCase();
    else if (key === '--input-dir') options.inputDir = value;
    else if (key === '--output-dir') options.outputDir = value;
    else fail(`unknown argument ${key}`);
  }
  return options;
}

const options = parseArgs(process.argv.slice(2));
const files = (await readdir(options.inputDir)).filter((name) => name.startsWith(`${options.country.toLowerCase()}-`) && name.endsWith('-map-data.json') && !name.includes('city-report')).sort();
const report = JSON.parse(await readFile(join(options.inputDir, `${options.country.toLowerCase()}-city-report-map-data.json`), 'utf8'));
const cities = new Map((report.results || []).map((item) => [item.cityId.split(':').at(-1), item]));
for (const file of files) {
  const slug = file.slice(`${options.country.toLowerCase()}-`.length, -'-map-data.json'.length);
  const city = cities.get(slug);
  if (!city) continue;
  const collection = JSON.parse(await readFile(join(options.inputDir, file), 'utf8'));
  const review = prepare(collection.features || [], { country: options.country, city: city.canonical, parentId: city.cityId, profile: 'map-data' });
  const output = join(options.outputDir, options.country.toLowerCase(), slug, 'map-data.json');
  await mkdir(join(options.outputDir, options.country.toLowerCase(), slug), { recursive: true });
  await writeFile(output, `${JSON.stringify(review, null, 2)}\n`);
  console.log(`${slug}: ${review.summary.candidates} candidates`);
}
