import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getGeoEntity,
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

test('legacy Stroygorod local-area canonical resolves to the verified Uchtepa market POI', () => {
  const legacyInput = { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Stroygorod' };
  const marketInput = { country: 'UZ', city: 'Tashkent', type: 'poi', canonical: 'Stroygorod Market' };

  const legacy = resolveLexiconGeoEntity(legacyInput);
  const market = resolveLexiconGeoEntity(marketInput);

  assert.equal(legacy?.id, 'uz:tashkent:poi:stroygorod-market');
  assert.equal(market?.id, legacy?.id);
  assert.equal(legacy?.type, 'poi.market');
  assert.equal(legacy?.parentId, 'uz:tashkent:uchtepa');
  assert.deepEqual(legacy?.osm, { type: 'way', id: 136439078 });
  assert.deepEqual(getGeoEntity(legacy.id)?.center, { lat: 41.28792, lng: 69.15118 });
  assert.equal(isGeoCoverageGap(legacyInput), false);
});
