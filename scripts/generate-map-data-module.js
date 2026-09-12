#!/usr/bin/env node
/** Generates one country map-data module from explicitly approved review JSON. */
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { foldMixedScriptConfusables } from '../src/osm-poi-import.js';

function fail(message) { throw new Error(`Map-data module generation: ${message}`); }
// Unicode modifier letters such as U+02BB/U+02BC are letter-class characters,
// unlike ASCII apostrophes. Treat apostrophe-like marks uniformly so a single
// street never gains competing canonical entities solely from OSM typography.
// Visually identical Latin/Cyrillic letters inside one word are folded first,
// so a single street cannot gain a second canonical entity from an OSM typo.
function slug(value) { return foldMixedScriptConfusables(String(value)).normalize('NFKD').replace(/[\u0027\u02BB\u02BC\u2018\u2019\u201B\u2032]/gu, "'").replace(/\p{M}/gu, '').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, ''); }
function normalize(value) { return slug(value).replace(/-/g, ' '); }
function exportName(country) { return `${country}_MAP_DATA_ENTITIES`; }
function cityRoot(parentId) { return String(parentId || '').split(':').slice(0, 2).join(':'); }
function cityDistanceKm(left, right) {
  const radians = Math.PI / 180;
  const latitudeDelta = (right.lat - left.lat) * radians;
  const longitudeDelta = (right.lng - left.lng) * radians;
  const a = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(left.lat * radians) * Math.cos(right.lat * radians) * Math.sin(longitudeDelta / 2) ** 2;
  return 6371.0088 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function parseArgs(argv) {
  const options = { reviewDir: join('.cache', 'geo-review') };
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (key === '--approve') { options.approve = true; continue; }
    const value = argv[++index];
    if (!key?.startsWith('--') || !value) fail('expected --country UZ --approve and optional --review-dir');
    if (key === '--country') options.country = value.toUpperCase();
    else if (key === '--review-dir') options.reviewDir = value;
    else fail(`unknown argument ${key}`);
  }
  if (!/^[A-Z]{2}$/.test(options.country || '') || !options.approve) fail('requires --country <ISO-2> and explicit --approve');
  return options;
}

const options = parseArgs(process.argv.slice(2));
const countryModule = await import(new URL(`../data-source/${options.country.toLowerCase()}/index.js`, import.meta.url));
const countryEntities = countryModule[`${options.country}_ENTITIES`] || [];
let previousGenerated = [];
try {
  const generatedModule = await import(new URL(`../data-source/${options.country.toLowerCase()}/map-data.js`, import.meta.url));
  previousGenerated = generatedModule[exportName(options.country)] || [];
} catch (error) {
  if (error?.code !== 'ERR_MODULE_NOT_FOUND') throw error;
}
const previousGeneratedIds = new Set(previousGenerated.map((entity) => entity.id));
const existing = countryEntities.filter((entity) => !previousGeneratedIds.has(entity.id));
const cities = countryEntities.filter((entity) => entity.type === 'city' && entity.country === options.country && entity.center);
const existingOsm = new Set(existing.flatMap((entity) => entity.concordances?.osm || (entity.osm ? [entity.osm] : [])).map((osm) => `${osm.type}:${osm.id}`));
const foreignOsm = new Set();
for (const directory of await readdir('data-source', { withFileTypes: true })) {
  if (!directory.isDirectory() || directory.name === options.country.toLowerCase()) continue;
  try {
    const module = await import(new URL(`../data-source/${directory.name}/map-data.js`, import.meta.url));
    const foreign = module[exportName(directory.name.toUpperCase())] || [];
    for (const entity of foreign) for (const osm of entity.concordances?.osm || (entity.osm ? [entity.osm] : [])) foreignOsm.add(`${osm.type}:${osm.id}`);
  } catch (error) {
    if (error?.code !== 'ERR_MODULE_NOT_FOUND') throw error;
  }
}
const existingSemantic = new Set(existing.map((entity) => `${entity.country}|${entity.parentId}|${entity.type}|${normalize(entity.canonicalName)}`));
const existingCityNames = new Set(existing.map((entity) => `${entity.country}|${cityRoot(entity.parentId)}|${normalize(entity.canonicalName)}`));
const countryDir = join(options.reviewDir, options.country.toLowerCase());
const dirs = (await readdir(countryDir, { withFileTypes: true })).filter((entry) => entry.isDirectory()).sort((a, b) => a.name.localeCompare(b.name));
const entities = [];
for (const dir of dirs) {
  const path = join(countryDir, dir.name, 'map-data.json');
  let review;
  try { review = JSON.parse(await readFile(path, 'utf8')); } catch { continue; }
  if (review?.type !== 'GeoCatalogMapDataReview' || review.scope?.country !== options.country) continue;
  for (const entity of review.entities || []) {
    const type = entity.type;
    const accuracy = type === 'street' ? 'street' : type === 'residential_complex' ? 'building' : 'neighborhood';
    const accuracyM = type === 'street' ? 250 : type === 'residential_complex' ? 200 : 650;
    entities.push({
      id: `${entity.parentId}:${type.replace(/_/g, '-')}:${slug(entity.canonicalName)}-${entity.osm.type[0]}${entity.osm.id}`,
      type, country: options.country, canonicalName: entity.canonicalName, parentId: entity.parentId,
      center: entity.center, source: 'osm', accuracy, accuracyM, osm: entity.osm,
      ...(entity.concordances ? { concordances: entity.concordances } : {}),
      ...(entity.sourceNames?.length ? { sourceNames: { canonical: entity.sourceNames } } : {}),
    });
  }
}
entities.sort((a, b) => a.id.localeCompare(b.id));
const semanticDeduped = [...entities.reduce((groups, entity) => {
  const key = `${entity.country}|${entity.parentId}|${entity.type}|${slug(entity.canonicalName)}`;
  const previous = groups.get(key);
  if (!previous) {
    groups.set(key, entity);
    return groups;
  }
  const osm = [...new Map([
    ...(previous.concordances?.osm || [previous.osm]),
    ...(entity.concordances?.osm || [entity.osm]),
  ].map((item) => [`${item.type}:${item.id}`, item])).values()];
  // Keep the deterministic canonical selected by the sorted input while
  // preserving typographic/name variants as lexical aliases and every OSM
  // identity as provenance for the one physical entity.
  groups.set(key, {
    ...entity,
    concordances: { osm },
    sourceNames: { canonical: [...new Set([
      ...(previous.sourceNames?.canonical || [previous.canonicalName]),
      ...(entity.sourceNames?.canonical || [entity.canonicalName]),
    ])].sort((left, right) => left.localeCompare(right)) },
  });
  return groups;
}, new Map()).values()]
  .filter((entity) => !existingSemantic.has(`${entity.country}|${entity.parentId}|${entity.type}|${normalize(entity.canonicalName)}`)
    // Curated city entities already own the lexical/canonical identity even
    // when their parent is a district; raw broad-bbox candidates must not
    // create a competing city-root owner under another semantic type.
    && !existingCityNames.has(`${entity.country}|${cityRoot(entity.parentId)}|${normalize(entity.canonicalName)}`)
    && !(entity.concordances?.osm || [entity.osm]).some((osm) => existingOsm.has(`${osm.type}:${osm.id}`) || foreignOsm.has(`${osm.type}:${osm.id}`)))
  // Bbox fallback is deliberately conservative, but adjacent city extents can
  // still overlap. A candidate closer to another canonical city is not safe
  // to attach to this city without a dedicated boundary review.
  .filter((entity) => {
    const nearest = cities
      .map((city) => ({ id: city.id, distance: cityDistanceKm(entity.center, city.center) }))
      .sort((left, right) => left.distance - right.distance)[0];
    return !nearest || nearest.id === cityRoot(entity.parentId);
  });
const claimedOsm = new Set(existingOsm);
const deduped = [];
for (const entity of semanticDeduped.sort((left, right) => left.id.localeCompare(right.id))) {
  const identities = entity.concordances?.osm || [entity.osm];
  if (identities.some((osm) => claimedOsm.has(`${osm.type}:${osm.id}`))) continue;
  identities.forEach((osm) => claimedOsm.add(`${osm.type}:${osm.id}`));
  deduped.push(entity);
}
const dataPath = join('data-source', options.country.toLowerCase(), 'map-data.js');
await mkdir(join('data-source', options.country.toLowerCase()), { recursive: true });
await writeFile(dataPath, `// Generated from explicitly approved cached map-data reviews.\nexport const ${exportName(options.country)}=Object.freeze(${JSON.stringify(deduped)});\n`);
const indexPath = join('data-source', options.country.toLowerCase(), 'index.js');
let index = await readFile(indexPath, 'utf8');
const name = exportName(options.country);
const importLine = `import { ${name} } from './map-data.js';`;
if (!index.includes(importLine)) index = `${importLine}\n${index}`;
if (!index.includes(`...${name},`)) index = index.replace(/\n\]\);\s*$/u, `\n  ...${name},\n]);\n`);
await writeFile(indexPath, index);
console.log(`Wrote ${deduped.length} approved ${options.country} map-data entities to ${dataPath} (${entities.length - deduped.length} existing canonical owners retained).`);
