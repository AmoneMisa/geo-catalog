import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/index.js';

const owners = Object.freeze([
  ['ua:kyiv:metro:khreshchatyk', 'node', 9151108492],
  ['ua:kyiv:metro:vokzalna', 'node', 3806369598],
  ['ua:kyiv:metro:maidan-nezalezhnosti', 'node', 9151090552],
  ['ua:kyiv:metro:zoloti-vorota', 'node', 7160992960],
  ['ua:kyiv:metro:universytet', 'node', 3806362030],
  ['ua:kyiv:metro:palats-ukraina', 'node', 7247486081],
  ['ua:kyiv:metro:olimpiiska', 'node', 10726000867],
  ['ua:kyiv:metro:osokorky', 'node', 5267935780],
  ['ua:kyiv:metro:lukianivska', 'node', 10726245822],
  ['ua:kyiv:street:khreshchatyk', 'way', 1131981872],
  ['ua:kyiv:street:saksahanskoho', 'way', 813679928],
  ['ua:kyiv:street:antonovycha', 'way', 130669991],
  ['ua:kyiv:street:lesi-ukrainky-boulevard', 'way', 1122570213],
  ['ua:kyiv:street:hlybochytska', 'way', 495491067],
  ['ua:kyiv:street:mykoly-bazhana-avenue', 'way', 1064063839],
  ['ua:kyiv:residential:tetris-hall', 'way', 1152235223],
]);

test('Kyiv report-derived transport, street and residential owners are stable', () => {
  for (const [id, type, osmId] of owners) {
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.deepEqual(entity.osm, { type, id: osmId }, id);
  }
});

test('Vokzalna metro owns the station, not the same-name street', () => {
  const station = getGeoEntity('ua:kyiv:metro:vokzalna');
  assert.deepEqual(station?.center, { lat: 50.4416401, lng: 30.4882512 });
  assert.equal(station?.osm?.id, 3806369598);
});
