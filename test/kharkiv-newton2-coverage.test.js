import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoEntity, resolveLexiconGeoEntity } from '../src/index.js';

test('Kharkiv Newton 2 canonical resolves to its Lev Landau 2B/1 representative anchor', () => {
  const entity = resolveLexiconGeoEntity({ country: 'UA', city: 'Kharkiv', type: 'residential_complex', canonical: 'Newton 2' });
  assert.equal(entity?.id, 'ua:kharkiv:residential:newton-2');
  assert.deepEqual(entity?.center, { lat: 49.936511, lng: 36.287822 });
  assert.equal(entity?.accuracyM, 350);
});

test('Newton 2 keeps address-point provenance explicit', () => {
  const entity = getGeoEntity('ua:kharkiv:residential:newton-2');
  assert.equal(entity?.source, 'manual');
  assert.match(entity?.sourceUrl ?? '', /urbanplaces\.su/);
});
