import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity, resolveLexiconGeoEntity } from '../src/index.js';

test('Kharkiv 614 microdistrict uses the verified OSM quarter node', () => {
  const entity = getGeoEntity('ua:kharkiv:microdistrict:614-microdistrict');
  assert.equal(entity?.canonicalName, '614 microdistrict');
  assert.deepEqual(entity?.center, { lat: 49.9950676, lng: 36.3376701 });
  assert.deepEqual(entity?.osm, { type: 'node', id: 12273087446 });
});

test('Kyiv numbered microdistricts resolve to their explicit OSM neighbourhood owners', () => {
  const pozniaky = resolveLexiconGeoEntity({
    country: 'UA', city: 'Kyiv', type: 'microdistrict', canonical: 'Pozniaky 10B microdistrict',
  });
  assert.equal(pozniaky?.id, 'ua:kyiv:microdistrict:pozniaky-10b');
  assert.deepEqual(pozniaky?.osm, { type: 'node', id: 6884596654 });

  const troieshchyna = resolveLexiconGeoEntity({
    country: 'UA', city: 'Kyiv', type: 'microdistrict', canonical: 'Troieshchyna 24 microdistrict',
  });
  assert.equal(troieshchyna?.id, 'ua:kyiv:microdistrict:troieshchyna-24');
  assert.deepEqual(troieshchyna?.osm, { type: 'node', id: 12386151185 });
});

test('Tashkent Qiyot canonical resolves to the existing Yunusabad physical owner', () => {
  const entity = resolveLexiconGeoEntity({
    country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Qiyot',
  });
  assert.equal(entity?.id, 'uz:tashkent:local-area:kiyot');
  assert.deepEqual(entity?.center, { lat: 41.32538, lng: 69.27791 });
});
