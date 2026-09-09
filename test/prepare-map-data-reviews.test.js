import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('cached map-data review script keeps all non-POI layers review-gated', async () => {
  const source = await readFile(new URL('../scripts/prepare-map-data-reviews.js', import.meta.url), 'utf8');
  assert.match(source, /GeoCatalogMapDataReview/);
  assert.match(source, /approved: false/);
  assert.match(source, /STREET_HIGHWAYS/);
  assert.match(source, /residential_complex/);
  assert.match(source, /mahalla/);
  assert.doesNotMatch(source, /data-source.*writeFile/);
});
