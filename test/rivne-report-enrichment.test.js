import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/index.js';

const owners = Object.freeze([
  ['ua:rivne:microdistrict:pivnichnyi', 'node', 1482176555],
  ['ua:rivne:microdistrict:yuvileinyi', 'node', 6716199415],
  ['ua:rivne:microdistrict:chervoni-hory', 'node', 9155090890],
  ['ua:rivne:residential:panorama-de-luxe', 'relation', 17629963],
  ['ua:rivne:residential:pokrovskyi', 'way', 1227142424],
]);

test('Rivne uploaded report owners are persisted with stable OSM identity', () => {
  for (const [id, type, osmId] of owners) {
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.deepEqual(entity.osm, { type, id: osmId }, id);
  }
});

test('Rivne report false substitutions are not promoted to neighborhoods', () => {
  assert.equal(getGeoEntity('ua:rivne:microdistrict:avtovokzal'), null, 'bus stop is not the Avtovokzal neighborhood');
  assert.equal(getGeoEntity('ua:rivne:microdistrict:mototrek'), null, 'stadium/bus stop are not the Mototrek neighborhood');
  assert.equal(getGeoEntity('ua:rivne:microdistrict:radiozavod'), null, 'bus stop is not the Radiozavod neighborhood');
});
