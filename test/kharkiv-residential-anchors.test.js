import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity, resolveLexiconGeoEntity } from '../src/index.js';

test('new Kharkiv residential canonicals resolve to verified anchors', () => {
  const expected = new Map([
    ['Sokolnyky', 'ua:kharkiv:residential:sokolnyky'],
    ['Rohatynskyi', 'ua:kharkiv:residential:rohatynskyi'],
    ['Saltivskyi', 'ua:kharkiv:residential:saltivskyi'],
  ]);

  for (const [canonical, id] of expected) {
    assert.equal(resolveLexiconGeoEntity({
      country: 'UA', city: 'Kharkiv', type: 'residential_complex', canonical,
    })?.id, id);
  }
});

test('multi-building Kharkiv residential anchors preserve conservative accuracy', () => {
  assert.deepEqual(getGeoEntity('ua:kharkiv:residential:sokolnyky')?.center, {
    lat: 50.03251645,
    lng: 36.25477836271,
  });
  assert.equal(getGeoEntity('ua:kharkiv:residential:sokolnyky')?.accuracyM, 650);

  assert.deepEqual(getGeoEntity('ua:kharkiv:residential:rohatynskyi')?.center, {
    lat: 49.998555593836,
    lng: 36.21748869009,
  });
  assert.equal(getGeoEntity('ua:kharkiv:residential:rohatynskyi')?.accuracyM, 700);

  assert.deepEqual(getGeoEntity('ua:kharkiv:residential:saltivskyi')?.center, {
    lat: 49.989758,
    lng: 36.361977,
  });
  assert.equal(getGeoEntity('ua:kharkiv:residential:saltivskyi')?.accuracyM, 500);
});
