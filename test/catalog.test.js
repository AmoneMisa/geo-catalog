import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
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

test('data modules use stable domain/geography names instead of *-extra.js', () => {
  const files = readdirSync(new URL('../src/data/', import.meta.url), { recursive: true });
  assert.deepEqual(files.filter((file) => /(?:^|[/\\])[^/\\]*-extra\.js$/.test(file)), []);
});

test('stable IDs resolve deterministic entities', () => {
  assert.equal(hasGeoEntity('uz:tashkent'), true);
  assert.equal(getGeoEntity('uz:tashkent')?.canonicalName, 'Tashkent');
  assert.equal(getGeoEntity('missing'), null);
  assert.equal(getGeoEntityByLookupKey('missing'), null);
});

test('typed POIs and GeoNames provenance are first-class catalog values', () => {
  const park = getGeoEntity('ua:kyiv:poi:taras-shevchenko-park');
  assert.equal(park?.type, 'poi.park');
  assert.ok(findGeoEntities({ country: 'UA', type: 'poi' }).includes(park));

  const nyvky = getGeoEntity('ua:kyiv:microdistrict:nyvky');
  assert.equal(nyvky?.source, 'geonames');

  const developmentArea = getGeoEntity('ua:odesa:development-area:sovinion');
  assert.equal(developmentArea?.type, 'development_area');
});

test('generic POI lexicon lookup resolves typed POIs', () => {
  assert.equal(
    resolveLexiconGeoEntity({ country: 'UA', city: 'Kyiv', type: 'poi', canonical: 'Парк Тараса Шевченка' })?.id,
    'ua:kyiv:poi:taras-shevchenko-park',
  );
});

test('learned geo lookup keys normalize punctuation without transliterating canonicals', () => {
  const a = buildGeoLookupKey({
    country: 'ua', type: 'address', city: 'Chernivtsi', district: 'A', street: 'Воробкевича', houseNumber: '12-А', building: '2',
  });
  const b = buildGeoLookupKey({
    country: 'UA', type: 'address', city: ' Chernivtsi ', district: 'B', street: 'Воробкевича', houseNumber: '12-А', building: ' 2 ',
  });
  assert.equal(a, b);
  assert.equal(a, 'v1|UA|address|chernivtsi|воробкевича|12-а|2');
});

test('street and entity keys do not fork when an inferred district changes', () => {
  assert.equal(
    buildGeoLookupKey({ country: 'UZ', type: 'street', city: 'Tashkent', district: 'A', canonical: 'Shota Rustaveli' }),
    buildGeoLookupKey({ country: 'UZ', type: 'street', city: 'Tashkent', district: 'B', canonical: 'Shota Rustaveli' }),
  );
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
  assert.ok(districts.every((entity) => entity.boundary?.type === 'Polygon' || entity.boundary?.type === 'MultiPolygon'));
  assert.ok(districts.every((entity) => entity.source === 'osm' && entity.accuracy === 'district'));
});

test('boundary validation rejects malformed geometry and mismatched centers', () => {
  const entity = (boundary, center = { lat: 0.5, lng: 0.5 }) => ({
    id: 'xx:test', type: 'district', country: 'XX', canonicalName: 'Test', center, boundary,
  });
  const validBoundary = { type: 'Polygon', coordinates: [[[0, 0], [1, 0], [1, 1], [0, 0]]] };

  assert.deepEqual(validateGeoCatalog([entity(validBoundary)]), { valid: true, errors: [] });
  for (const boundary of [
    null,
    { type: 'Polygon', coordinates: [] },
    { type: 'MultiPolygon', coordinates: [] },
    { type: 'Polygon', coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1]]] },
    { type: 'Polygon', coordinates: [[[0, 0], [181, 0], [1, 1], [0, 0]]] },
    { type: 'Polygon', coordinates: [[[0, 0], [1, 0], [2, 0], [0, 0]]] },
  ]) {
    assert.equal(validateGeoCatalog([entity(boundary)]).valid, false);
  }
  assert.ok(validateGeoCatalog([entity(validBoundary, { lat: 2, lng: 2 })]).errors.includes('xx:test: center must be inside boundary'));

  const parent = { ...entity(validBoundary), id: 'xx:parent' };
  const child = {
    id: 'xx:child', type: 'local_area', country: 'XX', canonicalName: 'Child',
    parentId: parent.id, center: { lat: 2, lng: 2 },
  };
  assert.ok(
    validateGeoCatalog([parent, child]).errors.includes('xx:child: center must be inside parent boundary xx:parent'),
  );
});

test('verified Tashkent metro catalog contains all 50 stations', () => {
  const metro = findGeoEntities({ country: 'UZ', type: 'metro' });
  assert.equal(metro.length, 50);

  const station = getGeoEntity('uz:tashkent:metro:buyuk-ipak-yoli');
  assert.equal(station?.canonicalName, 'Buyuk Ipak Yoli');
  assert.equal(station?.wikidataId, 'Q4100729');
  assert.equal(station?.osm?.id, 1777037919);
  assert.equal(station?.accuracy, 'entrance');

  const minor = getGeoEntity('uz:tashkent:metro:minor');
  assert.equal(minor?.canonicalName, 'Minor');
  assert.equal(minor?.wikidataId, 'Q719456');
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

  const district = getGeoEntity('uz:tashkent:chilanzar');
  assert.equal(Object.isFrozen(district?.boundary), true);
  assert.equal(Object.isFrozen(district?.boundary?.coordinates), true);
  assert.equal(Object.isFrozen(district?.boundary?.coordinates?.[0]), true);
  assert.equal(Object.isFrozen(district?.boundary?.coordinates?.[0]?.[0]), true);
});

test('Tashkent and major Ukrainian cities use verified OSM administrative coordinates', () => {
  const expectedRelations = new Map([
    ['uz:tashkent', 2216724],
    ['ua:kyiv', 421866],
    ['ua:kharkiv', 3154746],
    ['ua:odesa', 1413934],
    ['ua:dnipro', 1017311],
    ['ua:lviv', 2032280],
    ['ua:zaporizhzhia', 1418311],
    ['ua:kryvyi-rih', 1821193],
  ]);

  for (const [id, relationId] of expectedRelations) {
    const city = getGeoEntity(id);
    assert.equal(city?.source, 'osm');
    assert.deepEqual(city?.osm, { type: 'relation', id: relationId });
    assert.ok(city?.bbox);
    assert.equal(containsPoint(city.center, city.bbox), true);
  }
});

test('additional Ukrainian regional centers use verified OSM city relations', () => {
  const expected = new Map([
    ['ua:vinnytsia', [{ lat: 49.2317, lng: 28.4678 }, 361818]],
    ['ua:chernivtsi', [{ lat: 48.28, lng: 25.93 }, 1742393]],
    ['ua:khmelnytskyi', [{ lat: 49.42, lng: 26.98 }, 1792913]],
    ['ua:cherkasy', [{ lat: 49.444444, lng: 32.059722 }, 2825507]],
    ['ua:chernihiv', [{ lat: 51.491111, lng: 31.298611 }, 1952636]],
  ]);

  for (const [id, [center, relationId]] of expected) {
    const city = getGeoEntity(id);
    assert.equal(city?.source, 'osm', id);
    assert.equal(city?.accuracy, 'city', id);
    assert.deepEqual(city?.center, center, id);
    assert.deepEqual(city?.osm, { type: 'relation', id: relationId }, id);
  }
});

test('verified OSM city provenance does not overwrite manual authoritative centers', () => {
  const expectedRelations = new Map([
    ['ua:uzhhorod', 2692232],
    ['ua:lutsk', 1951964],
    ['ua:rivne', 448930],
    ['ua:ternopil', 3058686],
    ['ua:zhytomyr', 2692156],
    ['ua:poltava', 1641691],
    ['ua:sumy', 3678531],
    ['ua:mykolaiv', 11622860],
    ['ua:kherson', 2175078],
    ['ua:kropyvnytskyi', 2825228],
    ['ua:bila-tserkva', 2069683],
    ['ua:kremenchuk', 2320579],
    ['ua:uman', 3058556],
  ]);

  for (const [id, relationId] of expectedRelations) {
    const city = getGeoEntity(id);
    assert.equal(city?.source, 'manual', id);
    assert.equal(city?.accuracy, 'city', id);
    assert.deepEqual(city?.osm, { type: 'relation', id: relationId }, id);
  }
});

test('Odesa administrative districts expose validated OSM boundaries', () => {
  const districts = findGeoEntities({ country: 'UA', parentId: 'ua:odesa', type: 'district' });
  assert.equal(districts.length, 4);
  assert.ok(districts.every((district) => district.source === 'osm' && district.accuracy === 'district' && district.boundary));
  assert.equal(getGeoEntity('ua:odesa:microdistrict:serednii-fontan')?.parentId, 'ua:odesa:district:kyivskyi');
});
