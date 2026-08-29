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

test('additional Ukrainian regional centers retain explicit point-source center provenance', () => {
  const expected = new Map([
    ['ua:vinnytsia', [{ lat: 49.232, lng: 28.468 }, 361818, 249748477]],
    ['ua:chernivtsi', [{ lat: 48.2865, lng: 25.9377 }, 1742393, 428339505]],
    ['ua:khmelnytskyi', [{ lat: 49.4196, lng: 26.9794 }, 1792913, 251223522]],
    ['ua:cherkasy', [{ lat: 49.4447, lng: 32.0588 }, 2825507, 265056942]],
    ['ua:chernihiv', [{ lat: 51.4941, lng: 31.2943 }, 1952636, 26150436]],
  ]);

  for (const [id, [center, relationId, pointNodeId]] of expected) {
    const city = getGeoEntity(id);
    assert.equal(city?.source, 'osm', id);
    assert.equal(city?.accuracy, 'city', id);
    assert.deepEqual(city?.center, center, id);
    assert.deepEqual(city?.osm, { type: 'relation', id: relationId }, id);
    assert.equal(city?.sourceUrl, `https://www.openstreetmap.org/node/${pointNodeId}`, id);
  }
});

test('verified OSM named-place nodes own representative city centers', () => {
  const expected = new Map([
    ['ua:ivano-frankivsk', [{ lat: 48.9225, lng: 24.7103 }, 268459612]],
    ['ua:mukachevo', [{ lat: 48.4421, lng: 22.7185 }, 337598436]],
    ['ua:irpin', [{ lat: 50.5207, lng: 30.2449 }, 36505064]],
    ['ua:bucha', [{ lat: 50.55031, lng: 30.21069 }, 312987923]],
    ['ua:brovary', [{ lat: 50.5111, lng: 30.79 }, 3673183717]],
  ]);

  for (const [id, [center, nodeId]] of expected) {
    const city = getGeoEntity(id);
    assert.equal(city?.source, 'osm', id);
    assert.equal(city?.accuracy, 'city', id);
    assert.deepEqual(city?.center, center, id);
    assert.deepEqual(city?.osm, { type: 'node', id: nodeId }, id);
  }
});

test('verified OSM city relations retain explicit point-source center provenance', () => {
  const expected = new Map([
    ['ua:uzhhorod', [{ lat: 48.6224, lng: 22.3023 }, 2692232, 111353560]],
    ['ua:lutsk', [{ lat: 50.7451, lng: 25.3201 }, 1951964, 146570870]],
    ['ua:rivne', [{ lat: 50.6196, lng: 26.2513 }, 448930, 146541158]],
    ['ua:ternopil', [{ lat: 49.5558, lng: 25.5924 }, 3058686, 1643945522]],
    ['ua:zhytomyr', [{ lat: 50.2601, lng: 28.6696 }, 2692156, 252098339]],
    ['ua:poltava', [{ lat: 49.5897, lng: 34.5508 }, 1641691, 27121360]],
    ['ua:sumy', [{ lat: 50.912, lng: 34.8028 }, 3678531, 265057614]],
    ['ua:mykolaiv', [{ lat: 46.9759, lng: 31.994 }, 11622860, 60410873]],
    ['ua:kherson', [{ lat: 46.6401, lng: 32.6144 }, 2175078, 255466573]],
    ['ua:kropyvnytskyi', [{ lat: 48.5106, lng: 32.2656 }, 2825228, 4126283179]],
    ['ua:bila-tserkva', [{ lat: 49.797, lng: 30.1158 }, 2069683, 255259998]],
    ['ua:kremenchuk', [{ lat: 49.063, lng: 33.4035 }, 2320579, 265058149]],
    ['ua:uman', [{ lat: 48.7498, lng: 30.2203 }, 3058556, 248777764]],
  ]);

  for (const [id, [center, relationId, pointNodeId]] of expected) {
    const city = getGeoEntity(id);
    assert.equal(city?.source, 'osm', id);
    assert.equal(city?.accuracy, 'city', id);
    assert.deepEqual(city?.center, center, id);
    assert.deepEqual(city?.osm, { type: 'relation', id: relationId }, id);
    assert.equal(city?.sourceUrl, `https://www.openstreetmap.org/node/${pointNodeId}`, id);
  }
});

test('Odesa administrative districts expose validated OSM boundaries', () => {
  const districts = findGeoEntities({ country: 'UA', parentId: 'ua:odesa', type: 'district' });
  assert.equal(districts.length, 4);
  assert.ok(districts.every((district) => district.source === 'osm' && district.accuracy === 'district' && district.boundary));
  assert.equal(getGeoEntity('ua:odesa:microdistrict:serednii-fontan')?.parentId, 'ua:odesa:district:kyivskyi');
});

test('Stroy Gorod hardware store belongs to Paxtazor rather than Tashkent Stroygorod', () => {
  const settlement = getGeoEntity('uz:paxtazor');
  assert.equal(settlement?.type, 'settlement');
  assert.deepEqual(settlement?.osm, { type: 'way', id: 514231681 });
  assert.equal(containsPoint({ lat: 40.698506, lng: 68.0290325 }, settlement?.bbox), true);

  const store = getGeoEntity('uz:paxtazor:poi:stroy-gorod');
  assert.equal(store?.parentId, settlement?.id);
  assert.equal(store?.type, 'poi');
  assert.deepEqual(store?.center, { lat: 40.698506, lng: 68.0290325 });
  assert.equal(store?.accuracy, 'poi');
});
