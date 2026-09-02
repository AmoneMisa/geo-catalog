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
  assert.equal(getGeoEntity('uz:angren:microdistrict:2-quarter')?.osm?.id, 12511090503);
  assert.equal(getGeoEntity('uz:navoiy:microdistrict:17')?.osm?.id, 10734160833);
  assert.equal(getGeoEntity('uz:gulistan:mahalla:sayqal')?.osm?.id, 1154906314);
});

test('previously orphaned railway station anchors are present in runtime catalog', () => {
  assert.equal(getGeoEntity('uz:yangiyol:poi:yangiyol-railway-station')?.osm?.id, 2209501413);
  assert.equal(getGeoEntity('uz:chust:poi:chust-railway-station')?.osm?.id, 1587386149);
});

test('verified industrial modules are present in runtime catalog', () => {
  assert.equal(getGeoEntity('uz:shirin:poi:syrdarya-tpp')?.osm?.id, 229824212);
  assert.equal(getGeoEntity('uz:shirin:poi:syrdarya-tpp')?.type, 'poi.power_plant');
  assert.equal(getGeoEntity('uz:angren:poi:angren-tpp')?.type, 'poi.power_plant');
  assert.equal(getGeoEntity('uz:almalyk:poi:almalyk-mmc')?.type, 'poi.factory');
});

test('remaining verified regional modules are present in runtime catalog', () => {
  assert.equal(getGeoEntity('uz:muynak:poi:ship-cemetery')?.osm?.id, 348697797);
  assert.equal(getGeoEntity('uz:muynak:poi:aral-sea-museum')?.osm?.id, 6911874385);
  assert.equal(getGeoEntity('uz:jizzakh:poi:jizzakh-pedagogical-university')?.type, 'poi.university');
  assert.equal(getGeoEntity('uz:asaka:poi:asaka-bank')?.source, 'official');
  assert.equal(getGeoEntity('uz:denov:poi:denov-railway-station')?.osm?.id, 245671270);
  assert.equal(getGeoEntity('uz:urgut:poi:urgut-railway-station')?.osm?.id, 13717491021);
  assert.equal(getGeoEntity('uz:kogon:poi:palace-of-the-emir-of-bukhara')?.osm?.id, 3348088626);
  assert.equal(getGeoEntity('uz:paxtazor')?.osm?.id, 514231681);
});
