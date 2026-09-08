#!/usr/bin/env node
/**
 * Converts an ignored raw Geofabrik FeatureCollection into a deterministic,
 * human-reviewable JSON file. The result is intentionally external to the
 * runtime catalog and can later be passed to generate-osm-poi-module.js.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import { GEO_ENTITIES } from '../src/catalog.js';
import { createOsmPoiReview } from './geo-enrichment-review.js';

function fail(message) {
  throw new Error(`Geofabrik review preparation: ${message}`);
}

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (key === '--replace-generated') {
      values.replaceGenerated = true;
      continue;
    }
    const value = argv[++index];
    if (!key?.startsWith('--') || !value) fail('expected --input --country --city --parent-id and --output');
    values[key.slice(2)] = value;
  }
  if (!values.input || !/^[A-Z]{2}$/i.test(values.country || '') || !values.city || !values['parent-id'] || !values.output) fail('invalid arguments');
  return { ...values, country: values.country.toUpperCase() };
}

const args = parseArgs(process.argv.slice(2));
const collection = JSON.parse(await readFile(args.input, 'utf8'));
const inScope = (entity) => entity.country === args.country
  && (entity.parentId === args['parent-id'] || entity.parentId?.startsWith(`${args['parent-id']}:`));
const isPreviousGenerated = (entity) => args.replaceGenerated
  && entity.source === 'osm' && entity.sourceNames && entity.id.startsWith(`${args['parent-id']}:poi:`);
const review = createOsmPoiReview({
  collection,
  country: args.country,
  city: args.city,
  parentId: args['parent-id'],
  reviewed: GEO_ENTITIES.filter((entity) => inScope(entity) && !isPreviousGenerated(entity)),
});
await mkdir(dirname(args.output), { recursive: true });
await writeFile(args.output, `${JSON.stringify(review, null, 2)}\n`);
console.log(`Wrote ${review.summary.additions} sorted review candidates to ${args.output}`);
