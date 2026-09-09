import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('Geofabrik module generator uses the canonical catalog and existing OSM candidate merger', async () => {
  const source = await readFile(new URL('../scripts/generate-osm-poi-module.js', import.meta.url), 'utf8');
  assert.match(source, /GEO_ENTITIES/);
  assert.match(source, /extractOsmPoiCandidates/);
  assert.match(source, /mergeOsmPoiCandidates/);
  assert.match(source, /startsWith\(`\$\{args\['parent-id'\]\}:/);
  assert.match(source, /--replace-generated/);
  assert.match(source, /GeoCatalogOsmPoiReview/);
  assert.match(source, /review scope must match/);
  assert.match(source, /review input must be explicitly approved/);
  assert.match(source, /sourceNames/);
  assert.doesNotMatch(source, /from ['\"](?:osmium|gdal|@mapbox|protobufjs)/);
});
