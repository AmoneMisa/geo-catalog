import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GEO_ENTITIES,
  containsPoint,
  distanceKm,
  findGeoEntities,
  getGeoChildren,
  getGeoEntity,
  geoIdForLexiconEntity,
  hasGeoEntity,
  nearestGeoEntity,
  resolveLexiconGeoEntity,
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

test('all canonical parser cities are represented for UA, UZ and KZ', () => {
  assert.equal(findGeoEntities({ country: 'UA', type: 'city' }).length, 30);
  assert.equal(findGeoEntities({ country: 'UZ', type: 'city' }).length, 15);
  assert.equal(findGeoEntities({ country: 'KZ', type: 'city' }).length, 18);
  assert.equal(getGeoEntity('ua:mukachevo')?.canonicalName, 'Mukachevo');
  assert.equal(getGeoEntity('uz:nukus')?.canonicalName, 'Nukus');
  assert.equal(getGeoEntity('kz:oskemen')?.canonicalName, 'Oskemen');
});

test('Tashkent administrative districts are children of the city', () => {
  const districts = getGeoChildren('uz:tashkent').filter((entity) => entity.type === 'district');
  assert.equal(districts.length, 12);
  assert.equal(getGeoEntity('uz:tashkent:chilanzar')?.canonicalName, 'Chilanzar');
});

test('parsing lexicon tuples resolve without duplicating aliases', () => {
  assert.equal(geoIdForLexiconEntity({ country: 'UZ', type: 'city', canonical: 'Tashkent' }), 'uz:tashkent');
  assert.equal(
    geoIdForLexiconEntity({ country: 'UZ', city: 'Tashkent', type: 'district', canonical: 'Chilanzar' }),
    'uz:tashkent:chilanzar',
  );
  assert.equal(resolveLexiconGeoEntity({ country: 'UA', type: 'city', canonical: 'Rivne' })?.id, 'ua:rivne');
  assert.equal(resolveLexiconGeoEntity({ country: 'UA', type: 'city', canonical: 'Unknown' }), null);
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
