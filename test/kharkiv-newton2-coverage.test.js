import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoEntity, resolveLexiconGeoEntity } from '../src/index.js';

test('Kharkiv Newton 2 canonical resolves to its Lev Landau 2B/1 building anchor', () => {
  const entity = resolveLexiconGeoEntity({ country: 'UA', city: 'Kharkiv', type: 'residential_complex', canonical: 'Newton 2' });
  assert.equal(entity?.id, 'ua:kharkiv:residential:newton-2');
  assert.deepEqual(entity?.center, { lat: 49.93916124914873, lng: 36.29575531838618 });
  assert.equal(entity?.accuracyM, 220);
});

test('Newton 2 keeps direct address-point provenance explicit', () => {
  const entity = getGeoEntity('ua:kharkiv:residential:newton-2');
  assert.equal(entity?.source, 'manual');
  assert.equal(entity?.sourceUrl, 'https://maps.visicom.ua/i/ADR3KEVMFV49HNWKVM');
});
