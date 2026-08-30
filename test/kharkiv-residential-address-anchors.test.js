import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoEntity, resolveLexiconGeoEntity } from '../src/index.js';

const expected = new Map([
  ['Flagman', ['ua:kharkiv:residential:flagman', { lat: 50.00621997034277, lng: 36.217436598655496 }]],
  ['Kvant', ['ua:kharkiv:residential:kvant', { lat: 50.01392121865629, lng: 36.23172340493414 }]],
  ['Crystal', ['ua:kharkiv:residential:crystal', { lat: 49.97724379805322, lng: 36.248909074634625 }]],
]);

test('Kharkiv address-verified residential canonicals resolve to dedicated owners', () => {
  for (const [canonical, [id]] of expected) {
    assert.equal(resolveLexiconGeoEntity({
      country: 'UA',
      city: 'Kharkiv',
      type: 'residential_complex',
      canonical,
    })?.id, id);
  }
});

test('Kharkiv address-verified residential anchors keep inspected coordinates', () => {
  for (const [, [id, center]] of expected) {
    const entity = getGeoEntity(id);
    assert.deepEqual(entity?.center, center);
    assert.equal(entity?.source, 'manual');
    assert.ok(entity?.sourceUrl);
  }
});
