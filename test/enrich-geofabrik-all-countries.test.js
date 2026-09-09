import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('all-country Geofabrik runner is review-only and covers supported country caches', async () => {
  const source = await readFile(new URL('../scripts/enrich-geofabrik-all-countries.js', import.meta.url), 'utf8');
  for (const country of ['UZ', 'UA', 'KG', 'RO', 'KZ']) assert.match(source, new RegExp(`${country}:`));
  assert.match(source, /--all-cities/);
  assert.match(source, /--report-only/);
  assert.match(source, /map-data/);
  assert.doesNotMatch(source, /apply-reviewed/);
});
