import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoEntity } from '../src/index.js';

test('previously orphaned Chirchiq spatial modules are present in runtime catalog', () => {
  assert.equal(getGeoEntity('uz:chirchiq:microdistrict:1')?.osm?.id, 6986095606);
  assert.equal(getGeoEntity('uz:chirchiq:microdistrict:4')?.osm?.id, 6986095609);
  assert.equal(getGeoEntity('uz:chirchiq:poi:pedagogical-university')?.type, 'poi.university');
  assert.equal(getGeoEntity('uz:chirchiq:poi:maxam-chirchiq')?.type, 'poi.factory');
});

test('previously orphaned railway station anchors are present in runtime catalog', () => {
  assert.equal(getGeoEntity('uz:yangiyol:poi:yangiyol-railway-station')?.osm?.id, 2209501413);
  assert.equal(getGeoEntity('uz:chust:poi:chust-railway-station')?.osm?.id, 1587386149);
});
