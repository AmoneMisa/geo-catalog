import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('Geofabrik importer stays dependency-free and writes only to its requested offline output', async () => {
  const source = await readFile(new URL('../scripts/import-geofabrik-pbf.js', import.meta.url), 'utf8');
  assert.match(source, /inflateSync/);
  assert.match(source, /osmPoiCategory/);
  assert.match(source, /expected --input --country and --output/);
  assert.match(source, /--locate-city/);
  assert.match(source, /CityCenterCollection/);
  assert.match(source, /boundary-relation/);
  assert.match(source, /boundaryNames/);
  assert.match(source, /place !== 'city'/);
  assert.match(source, /'multipolygon'/);
  assert.match(source, /matchedBoundaryRelations/);
  assert.match(source, /usedBboxFallback/);
  assert.match(source, /bbox fallback/);
  assert.match(source, /map-data/);
  assert.match(source, /STREET_HIGHWAYS/);
  assert.match(source, /LOCAL_PLACE_TYPES/);
  assert.doesNotMatch(source, /could not find outer\/inner ways for requested city boundary/);
  assert.doesNotMatch(source, /from ['\"](?:osmium|gdal|@mapbox|protobufjs)/);
});
