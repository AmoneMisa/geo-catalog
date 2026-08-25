import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GEO_ENTITIES,
  containsPoint,
  distanceKm,
  findGeoEntities,
  getGeoEntity,
  hasGeoEntity,
  nearestGeoEntity,
  validateGeoCatalog,
} from '../src/index.js';

test('catalog passes invariants', () => {
  assert.deepEqual(validateGeoCatalog(GEO_ENTITIES), { valid: true, errors: [] });
});

test('stable IDs resolve deterministic entities', () => {
  assert.equal(hasGeoEntity('uz:tashkent'), true);
  assert.equal(getGeoEntity('uz:tashkent')?.canonicalName, 'Tashkent');
  assert.equal(getGeoEntity('missing'), null);
});

test('catalog can be filtered without text matching', () => {
  const cities = findGeoEntities({ country: 'UA', type: 'city' });
  assert.deepEqual(cities.map((entity) => entity.id), ['ua:kyiv', 'ua:odesa', 'ua:kharkiv']);
});

test('bbox containment accepts Tashkent center', () => {
  const tashkent = getGeoEntity('uz:tashkent');
  assert.ok(tashkent?.bbox);
  assert.equal(containsPoint(tashkent.center, tashkent.bbox), true);
});

test('distance and nearest lookup use geographic coordinates', () => {
  const point = { lat: 43.24, lng: 76.89 };
  const nearest = nearestGeoEntity(point, GEO_ENTITIES, { country: 'KZ', type: 'city' });
  assert.equal(nearest?.entity.id, 'kz:almaty');
  assert.ok(nearest.distanceKm < 1);
  assert.ok(distanceKm(point, getGeoEntity('kz:astana').center) > 900);
});

test('catalog data is immutable at runtime', () => {
  assert.equal(Object.isFrozen(GEO_ENTITIES), true);
  assert.equal(Object.isFrozen(getGeoEntity('uz:tashkent')), true);
  assert.equal(Object.isFrozen(getGeoEntity('uz:tashkent').center), true);
});
