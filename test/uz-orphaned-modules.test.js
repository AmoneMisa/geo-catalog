import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoEntity } from '../src/index.js';

test('previously orphaned Chirchiq spatial modules are present in runtime catalog', () => {
  assert.equal(getGeoEntity('uz:chirchiq:microdistrict:1')?.osm?.id, 6986095606);
  assert.equal(getGeoEntity('uz:chirchiq:microdistrict:4')?.osm?.id, 6986095609);
  assert.equal(getGeoEntity('uz:chirchiq:poi:pedagogical-university')?.type, 'poi.university');
  assert.equal(getGeoEntity('uz:chirchiq:poi:maxam-chirchiq')?.type, 'poi.factory');
});

test('verified neighborhood modules remain present in runtime catalog', () => {
  assert.equal(getGeoEntity('uz:almalyk:microdistrict:5-1')?.osm?.id, 13265597237);
  assert.equal(getGeoEntity('uz:angren:microdistrict:2')?.osm?.id, 12511090503);
  assert.equal(getGeoEntity('uz:navoiy:microdistrict:17')?.osm?.id, 10734160833);
  assert.equal(getGeoEntity('uz:gulistan:mahalla:sayqal')?.osm?.id, 1154906314);
});

test('previously orphaned railway station anchors are present in runtime catalog', () => {
  assert.equal(getGeoEntity('uz:yangiyol:poi:yangiyol-railway-station')?.osm?.id, 2209501413);
  assert.equal(getGeoEntity('uz:chust:poi:chust-railway-station')?.osm?.id, 1587386149);
});
