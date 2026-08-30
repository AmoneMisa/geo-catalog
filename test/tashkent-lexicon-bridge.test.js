import test from 'node:test';
import assert from 'node:assert/strict';

import {
  isGeoCoverageGap,
  resolveLexiconGeoEntity,
} from '../src/index.js';

test('legacy Takhtapul parser canonical resolves to the Taxtapul Almazar area', () => {
  const canonicalInput = { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Taxtapul' };
  const legacyInput = { ...canonicalInput, canonical: 'Takhtapul' };

  const canonical = resolveLexiconGeoEntity(canonicalInput);
  const legacy = resolveLexiconGeoEntity(legacyInput);

  assert.equal(canonical?.id, 'uz:tashkent:local-area:taxtapul');
  assert.equal(legacy?.id, canonical?.id);
  assert.equal(legacy?.parentId, 'uz:tashkent:almazar');
  assert.equal(isGeoCoverageGap(canonicalInput), false);
  assert.equal(isGeoCoverageGap(legacyInput), false);
});
