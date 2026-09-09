#!/usr/bin/env node
/**
 * Converts a reviewed GeoJSON extraction from import-geofabrik-pbf.js into one
 * deterministic country/city data module. Raw PBF and intermediate GeoJSON
 * remain ignored build inputs; only the normalized entities are commit-ready.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import { GEO_ENTITIES } from '../src/catalog.js';
import { extractOsmPoiCandidates, mergeOsmPoiCandidates } from '../src/osm-poi-import.js';
import { isOsmPoiReview } from './geo-enrichment-review.js';

function fail(message) {
  throw new Error(`Geofabrik POI module: ${message}`);
}

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    if (key === '--replace-generated') {
      values.replaceGenerated = true;
      index -= 1;
      continue;
    }
    const value = argv[index + 1];
    if (!key?.startsWith('--') || !value) fail('expected --input --country --city --parent-id --export and --output');
    values[key.slice(2)] = value;
  }
  if (!values.input || !/^[A-Z]{2}$/i.test(values.country || '') || !values.city || !values['parent-id'] || !/^[A-Z][A-Z0-9_]*$/.test(values.export || '') || !values.output) {
    fail('invalid arguments');
  }
  return { ...values, country: values.country.toUpperCase() };
}

function quoted(value) {
  return JSON.stringify(value, null, 2).replace(/^\{/m, '{').replace(/\n}/m, '\n}');
}

const args = parseArgs(process.argv.slice(2));
const collection = JSON.parse(await readFile(args.input, 'utf8'));
if (collection?.type !== 'FeatureCollection' && !isOsmPoiReview(collection)) fail('input must be a GeoJSON FeatureCollection or GeoCatalogOsmPoiReview');
if (isOsmPoiReview(collection) && (collection.scope.country !== args.country || collection.scope.city !== args.city || collection.scope.parentId !== args['parent-id'])) {
  fail('review scope must match --country --city and --parent-id');
}
if (isOsmPoiReview(collection) && collection.approved !== true) {
  fail('review input must be explicitly approved before generation');
}

// City-local reviewed entities may belong directly to the city or to one of its
// districts. Both scopes protect their OSM identities from a broad PBF bbox.
const isWithinCityScope = (entity) => entity.country === args.country
  && (entity.parentId === args['parent-id'] || entity.parentId?.startsWith(`${args['parent-id']}:`));
// A refresh must compare candidates against reviewed records while replacing
// the prior output of this generator. Generated OSM candidates always retain
// sourceNames; curated OSM records intentionally do not, so they remain a
// protection against duplicate or lower-quality replacements.
const isPreviousGeneratedEntity = (entity) => args.replaceGenerated
  && entity.source === 'osm'
  && entity.sourceNames
  && entity.id.startsWith(`${args['parent-id']}:poi:`);
const existing = GEO_ENTITIES.filter((entity) => isWithinCityScope(entity) && !isPreviousGeneratedEntity(entity));
const candidates = isOsmPoiReview(collection)
  ? collection.entities
  : extractOsmPoiCandidates(collection.features, { country: args.country, city: args.city, parentId: args['parent-id'] });
const merged = mergeOsmPoiCandidates(candidates, existing);
const existingIds = new Set(existing.map((entity) => entity.id));
const existingOsm = new Set(existing.filter((entity) => entity.osm).map((entity) => `${entity.osm.type}:${entity.osm.id}`));
const additions = merged.filter((entity) => !existingIds.has(entity.id)
  && (!entity.osm || !existingOsm.has(`${entity.osm.type}:${entity.osm.id}`))).sort((a, b) => a.id.localeCompare(b.id));
const source = `// Generated deterministically from a reviewed Geofabrik OSM extraction.\n// Raw extract and intermediate GeoJSON stay outside Git; see scripts/import-geofabrik-pbf.js.\nexport const ${args.export} = Object.freeze(${quoted(additions)});\n`;
await mkdir(dirname(args.output), { recursive: true });
await writeFile(args.output, source);
console.log(`Wrote ${additions.length} new canonical POI entities to ${args.output} (${candidates.length} candidates, ${existing.length} existing city entities).`);
