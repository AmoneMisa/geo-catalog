import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('map-data generation rejects candidates closer to another canonical city', async () => {
  const source = await readFile(new URL('../scripts/generate-map-data-module.js', import.meta.url), 'utf8');
  assert.match(source, /function cityDistanceKm\(/);
  assert.match(source, /nearest\.id === cityRoot\(entity\.parentId\)/);
  assert.match(source, /u02BB\\u02BC/);
  assert.match(source, /previous\.sourceNames\?\.canonical/);
  assert.match(source, /concordances: \{ osm \}/);
});
