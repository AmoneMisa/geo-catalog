import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/index.js';

const owners = Object.freeze([
  ['ua:lutsk:microdistrict:zavokzalnyi', 'node', 2539747519],
  ['ua:lutsk:microdistrict:vyshkiv', 'node', 2539717775],
  ['ua:lutsk:microdistrict:veresneve', 'node', 2539717761],
  ['ua:lutsk:microdistrict:hnidava', 'node', 2539724974],
  ['ua:lutsk:microdistrict:kichkarivka', 'node', 2539737169],
  ['ua:lutsk:microdistrict:lpz', 'node', 6575105898],
  ['ua:lutsk:residential-complex:caramel-residence', 'relation', 13458856],
  ['ua:lutsk:residential-complex:panorama', 'relation', 10205684],
  ['ua:lutsk:residential-complex:supernova', 'relation', 11197476],
  ['ua:lutsk:residential-complex:lutska-riviera', 'way', 136722374],
  ['ua:lutsk:poi:lesia-ukrainka-park', 'relation', 9755771],
]);

test('Lutsk report-derived owners keep stable OSM identity', () => {
  for (const [id, type, osmId] of owners) {
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.deepEqual(entity.osm, { type, id: osmId }, id);
  }
});

test('Lutsk ambiguous or semantically wrong candidates are not persisted', () => {
  assert.equal(getGeoEntity('ua:lutsk:microdistrict:tsentr'), null);
  assert.equal(getGeoEntity('ua:lutsk:microdistrict:33rd-district'), null);
  assert.equal(getGeoEntity('ua:lutsk:microdistrict:40th-district'), null);
  assert.equal(getGeoEntity('ua:lutsk:microdistrict:55th-district'), null);
  assert.equal(getGeoEntity('ua:lutsk:microdistrict:dubnivskyi'), null);
  assert.equal(getGeoEntity('ua:lutsk:microdistrict:teremnivskyi'), null);
  assert.equal(getGeoEntity('ua:lutsk:residential-complex:style-up'), null);
});
