import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('Geofabrik importer stays dependency-free and writes only to its requested offline output', async () => {
  const source = await readFile(new URL('../scripts/import-geofabrik-pbf.js', import.meta.url), 'utf8');
  assert.match(source, /inflateSync/);
  assert.match(source, /osmPoiCategory/);
  assert.match(source, /--input --country --city --parent-id --bbox and --output/);
  assert.match(source, /boundary-relation/);
  assert.match(source, /place !== 'city'/);
  assert.match(source, /'multipolygon'/);
  assert.match(source, /could not assemble an outer ring/);
  assert.doesNotMatch(source, /from ['\"](?:osmium|gdal|@mapbox|protobufjs)/);
});
