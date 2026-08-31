import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity, resolveLexiconGeoEntity } from '../src/index.js';

test('Kharkiv Levada residential canonical resolves separately from listing area and metro', () => {
  const residential = resolveLexiconGeoEntity({
    country: 'UA', city: 'Kharkiv', type: 'residential_complex', canonical: 'Levada',
  });
  assert.equal(residential?.id, 'ua:kharkiv:residential:levada');
  assert.deepEqual(residential?.center, {
    lat: 49.97831195202007,
    lng: 36.24245827257936,
  });
  assert.equal(residential?.accuracyM, 850);

  assert.equal(resolveLexiconGeoEntity({
    country: 'UA', city: 'Kharkiv', type: 'microdistrict', canonical: 'Levada',
  })?.id, 'ua:kharkiv:microdistrict:levada');
});

test('legacy Rohatynskyi Kvartal parser canonical reuses Rohatynskyi physical owner', () => {
  const owner = resolveLexiconGeoEntity({
    country: 'UA', city: 'Kharkiv', type: 'residential_complex', canonical: 'Rohatynskyi Kvartal',
  });
  assert.equal(owner?.id, 'ua:kharkiv:residential:rohatynskyi');
  assert.equal(getGeoEntity('ua:kharkiv:residential:rohatynskyi')?.accuracyM, 700);
});
