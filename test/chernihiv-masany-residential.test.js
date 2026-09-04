import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

test('Chernihiv Masany residential complex has a verified OSM representative', () => {
  const entity = getGeoEntity('ua:chernihiv:residential:masany');

  assert.ok(entity);
  assert.equal(entity.type, 'residential_complex');
  assert.equal(entity.country, 'UA');
  assert.equal(entity.canonicalName, 'Masany');
  assert.equal(entity.parentId, 'ua:chernihiv');
  assert.equal(entity.source, 'osm');
  assert.equal(entity.osm?.type, 'way');
  assert.equal(entity.osm?.id, 1230300678);
  assert.equal(entity.center.lat, 51.5189427);
  assert.equal(entity.center.lng, 31.2423529);
  assert.notEqual(entity.center.lat, 0);
  assert.notEqual(entity.center.lng, 0);
});

test('Masany neighborhood and Masany residential complex remain separate physical entities', () => {
  const neighborhood = getGeoEntity('ua:chernihiv:microdistrict:masany');
  const residential = getGeoEntity('ua:chernihiv:residential:masany');

  assert.ok(neighborhood);
  assert.ok(residential);
  assert.notEqual(neighborhood.id, residential.id);
  assert.equal(neighborhood.type, 'microdistrict');
  assert.equal(residential.type, 'residential_complex');
});
