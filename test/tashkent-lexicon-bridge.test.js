import test from 'node:test';
import assert from 'node:assert/strict';

import {
  isGeoCoverageGap,
  resolveLexiconGeoEntity,
  resolveLexiconGeoEntityExact,
} from '../src/index.js';

test('legacy Takhtapul parser canonical resolves to the Taxtapul Almazar area', () => {
  const canonicalInput = { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Taxtapul' };
  const legacyInput = { ...canonicalInput, canonical: 'Takhtapul' };

  const canonical = resolveLexiconGeoEntityExact(canonicalInput);
  const legacy = resolveLexiconGeoEntityExact(legacyInput);

  assert.equal(canonical?.id, 'uz:tashkent:local-area:taxtapul');
  assert.equal(legacy?.id, canonical?.id);
  assert.equal(legacy?.parentId, 'uz:tashkent:almazar');
  assert.equal(resolveLexiconGeoEntity(legacyInput)?.id, canonical?.id);
  assert.equal(isGeoCoverageGap(canonicalInput), false);
  assert.equal(isGeoCoverageGap(legacyInput), false);
});
