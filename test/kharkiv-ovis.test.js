import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoEntity, resolveLexiconGeoEntity } from '../src/index.js';

test('Kharkiv Ovis canonical resolves to the built residential owner', () => {
  const entity = resolveLexiconGeoEntity({
    country: 'UA',
    city: 'Kharkiv',
    type: 'residential_complex',
    canonical: 'Ovis',
  });

  assert.equal(entity?.id, 'ua:kharkiv:residential:ovis');
  assert.equal(entity?.source, 'manual');
  assert.equal(entity?.accuracy, 'building');
  assert.ok(entity?.sourceUrl);
});

test('Kharkiv Ovis anchor points to the commissioned Klochkivska 108 k1 building', () => {
  const entity = getGeoEntity('ua:kharkiv:residential:ovis');
  assert.deepEqual(entity?.center, {
    lat: 50.00615692138672,
    lng: 36.21923065185547,
  });
  assert.equal(entity?.accuracyM, 220);
});
