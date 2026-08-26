import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GEO_ENTITIES,
  buildGeoLookupKey,
  containsPoint,
  distanceKm,
  findGeoEntities,
  getGeoChildren,
  getGeoEntity,
  getGeoEntityByLookupKey,
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
  assert.equal(getGeoEntityByLookupKey('missing'), null);
});

test('learned geo lookup keys normalize punctuation without transliterating canonicals', () => {
  const a = buildGeoLookupKey({
    country: 'ua', type: 'address', city: 'Chernivtsi', street: 'Воробкевича', houseNumber: '12-А', building: '2',
  });
  const b = buildGeoLookupKey({
    country: 'UA', type: 'address', city: ' Chernivtsi ', street: 'Воробкевича', houseNumber: '12-А', building: ' 2 ',
  });
  assert.equal(a, b);
  assert.equal(a, 'v1|UA|address|chernivtsi||воробкевича|12-а|2');
});

test('expanded city catalogs are represented for UA, UZ and KZ', () => {
  assert.ok(findGeoEntities({ country: 'UA', type: 'city' }).length >= 88);
  assert.ok(findGeoEntities({ country: 'UZ', type: 'city' }).length >= 41);
  assert.equal(findGeoEntities({ country: 'KZ', type: 'city' }).length, 18);

  assert.equal(getGeoEntity('ua:chuhuiv')?.canonicalName, 'Chuhuiv');
  assert.equal(getGeoEntity('ua:vynohradiv')?.canonicalName, 'Vynohradiv');
  assert.equal(getGeoEntity('uz:qarshi')?.canonicalName, 'Qarshi');
  assert.equal(getGeoEntity('uz:muynak')?.canonicalName, 'Muynak');
});

test('Tashkent administrative districts are children of the city', () => {
  const districts = getGeoChildren('uz:tashkent').filter((entity) => entity.type === 'district');
  assert.equal(districts.length, 12);
});

test('verified Tashkent metro stations expose point provenance', () => {
  const metro = findGeoEntities({ country: 'UZ', type: 'metro' });
  assert.equal(metro.length, 29);
  const station = getGeoEntity('uz:tashkent:metro:buyuk-ipak-yoli');
  assert.equal(station?.canonicalName, 'Buyuk Ipak Yoli');
  assert.equal(station?.wikidataId, 'Q4100729');
  assert.equal(station?.osm?.id, 1777037919);
  assert.equal(station?.accuracy, 'entrance');
});

test('parsing lexicon tuples resolve without duplicating aliases', () => {
  assert.equal(geoIdForLexiconEntity({ country: 'UZ', type: 'city', canonical: 'Tashkent' }), 'uz:tashkent');
  assert.equal(geoIdForLexiconEntity({ country: 'UZ', city: 'Tashkent', type: 'district', canonical: 'Chilanzar' }), 'uz:tashkent:chilanzar');
  assert.equal(geoIdForLexiconEntity({ country: 'UZ', city: 'Tashkent', type: 'metro', canonical: 'Chorsu' }), 'uz:tashkent:metro:chorsu');
  assert.equal(resolveLexiconGeoEntity({ country: 'UA', type: 'city', canonical: 'Rivne' })?.id, 'ua:rivne');
  assert.equal(resolveLexiconGeoEntity({ country: 'UA', type: 'city', canonical: 'Chuhuiv' })?.id, 'ua:chuhuiv');
  assert.equal(resolveLexiconGeoEntity({ country: 'UA', city: 'Odesa', type: 'suburb', canonical: 'Крижанівка' })?.id, 'ua:odesa:suburb:kryzhanivka');
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
