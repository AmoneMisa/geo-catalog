import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TRANSPORT_ROUTES,
  TRANSPORT_ROUTE_VARIANTS,
  TRANSPORT_STOPS,
  TRANSPORT_TRANSFERS,
  findTransportRoutes,
  findTransportStops,
  getRouteVariants,
  getRoutesForStop,
  getStopsForRoute,
  getStopsForRouteVariant,
  getTransfersForStop,
  getTransportCoverage,
  getTransportRoute,
  getTransportRouteGeoJSON,
  getTransportRouteVariant,
  getTransportStop,
  getTransportStopsGeoJSON,
  validateTransportCatalog,
} from '../src/transport/catalog.js';

test('transport catalog passes invariants', () => {
  assert.deepEqual(validateTransportCatalog(), { valid: true, errors: [] });
});

test('Tashkent metro keeps all 50 canonical stations and ordered full topology', () => {
  const stops = findTransportStops({ country: 'UZ', cityId: 'uz:tashkent', mode: 'metro' });
  assert.equal(stops.length, 50);
  assert.equal(getTransportStop('uz:tashkent:stop:metro:chorsu')?.geoEntityId, 'uz:tashkent:metro:chorsu');

  const chilonzor = getTransportRoute('uz:tashkent:route:metro:chilonzor');
  assert.equal(chilonzor?.coverage, 'full');
  assert.equal(chilonzor?.stopIds.length, 17);
  assert.equal(getStopsForRoute(chilonzor.id)[0].canonicalName, 'Buyuk Ipak Yoli');
  assert.equal(getStopsForRoute(chilonzor.id).at(-1).canonicalName, 'Chinor');
  assert.equal(TRANSPORT_TRANSFERS.length, 4);
  assert.equal(getTransfersForStop('uz:tashkent:stop:metro:dostlik').length, 1);
});

test('Tashkent bus registry still contains all 170 route refs', () => {
  const buses = findTransportRoutes({ cityId: 'uz:tashkent', mode: 'bus' });
  assert.equal(buses.length, 170);
  assert.equal(TRANSPORT_ROUTES.length, 174);
  assert.ok(getTransportRoute('uz:tashkent:route:bus:1'));
  assert.ok(getTransportRoute('uz:tashkent:route:bus:8t'));
  assert.ok(getTransportRoute('uz:tashkent:route:bus:199'));
  assert.equal(getTransportRoute('uz:tashkent:route:bus:4'), null);
});

test('OSM snapshot promotes 60 bus refs to full directional topology', () => {
  assert.deepEqual(getTransportCoverage({ cityId: 'uz:tashkent', mode: 'bus' }), {
    total: 170,
    full: 60,
    terminalsOnly: 4,
    metadataOnly: 106,
  });
  assert.deepEqual(getTransportCoverage({ cityId: 'uz:tashkent' }), {
    total: 174,
    full: 64,
    terminalsOnly: 4,
    metadataOnly: 106,
  });
  assert.equal(TRANSPORT_ROUTE_VARIANTS.length, 117);
});

test('all 117 OSM bus variants include real road geometry and map bounds', () => {
  assert.equal(TRANSPORT_ROUTE_VARIANTS.length, 117);
  for (const variant of TRANSPORT_ROUTE_VARIANTS) {
    assert.equal(variant.geometry?.type, 'MultiLineString', variant.id);
    assert.ok(variant.geometry.coordinates.length > 0, variant.id);
    assert.ok(variant.geometry.coordinates.every((segment) => segment.length >= 2), variant.id);
    assert.equal(variant.geometrySource, 'osm', variant.id);
    assert.equal(variant.geometryUpdatedAt, '2026-08-30', variant.id);
    assert.ok(variant.bounds.west <= variant.bounds.east, variant.id);
    assert.ok(variant.bounds.south <= variant.bounds.north, variant.id);
  }
});

test('OSM snapshot adds 1227 unique bus platform/stop spatial objects', () => {
  assert.equal(TRANSPORT_STOPS.length, 1297);
  assert.equal(findTransportStops({ cityId: 'uz:tashkent', mode: 'bus' }).length, 1247);

  const stop = getTransportStop('uz:tashkent:stop:bus:osm:node:13308770769');
  assert.equal(stop?.canonicalName, 'Массив Хумаюн');
  assert.deepEqual(stop?.center, { lat: 41.341248, lng: 69.3857 });
  assert.deepEqual(stop?.osm, { type: 'node', id: 13308770769 });
  assert.equal(stop?.sourceUpdatedAt, '2026-08-30');
});

test('route 1 exposes two ordered OSM directional variants', () => {
  const route = getTransportRoute('uz:tashkent:route:bus:1');
  assert.equal(route?.coverage, 'full');
  assert.equal(route?.topologySource, 'osm');
  assert.equal(route?.topologyUpdatedAt, '2026-08-30');

  const variants = getRouteVariants(route.id);
  assert.equal(variants.length, 2);
  assert.deepEqual(variants.map((variant) => variant.osm?.id), [1866064, 11625088]);
  assert.deepEqual(variants.map((variant) => variant.stopIds.length), [32, 31]);
  assert.equal(variants[0].from, 'Mirzo Ulugbek sanoat zonasi');
  assert.equal(variants[0].to, 'Toshkent MUM');
  assert.equal(variants[0].geometry?.type, 'MultiLineString');
  assert.ok(variants[0].geometry.coordinates.length > 20);
  assert.ok(variants[0].bounds.west < variants[0].bounds.east);
  assert.ok(variants[0].bounds.south < variants[0].bounds.north);

  const firstVariantStops = getStopsForRouteVariant(route.id, 1866064);
  assert.equal(firstVariantStops.length, 32);
  assert.equal(firstVariantStops[0].canonicalName, 'Массив Хумаюн');
  assert.equal(firstVariantStops.at(-1).canonicalName, 'ЦУМ "Ташкент"');
  assert.equal(getTransportRouteVariant(variants[0].id)?.osm?.id, 1866064);
});

test('map API exposes bus route shapes and stop points as GeoJSON', () => {
  const routeGeoJSON = getTransportRouteGeoJSON('uz:tashkent:route:bus:1');
  assert.equal(routeGeoJSON.type, 'FeatureCollection');
  assert.equal(routeGeoJSON.features.length, 2);
  assert.deepEqual(routeGeoJSON.features.map((feature) => feature.properties.osmRelationId), [1866064, 11625088]);
  assert.ok(routeGeoJSON.features.every((feature) => feature.geometry.type === 'MultiLineString'));

  const busStops = getTransportStopsGeoJSON({ country: 'UZ', cityId: 'uz:tashkent', mode: 'bus' });
  assert.equal(busStops.type, 'FeatureCollection');
  assert.equal(busStops.features.length, 1247);
  const humoyun = busStops.features.find((feature) => feature.id === 'uz:tashkent:stop:bus:osm:node:13308770769');
  assert.deepEqual(humoyun?.geometry, { type: 'Point', coordinates: [69.3857, 41.341248] });
  assert.equal(humoyun?.properties.mode, 'bus');
});

test('route 7 keeps only current Tashkent municipal variants', () => {
  const variants = getRouteVariants('uz:tashkent:route:bus:7');
  assert.equal(variants.length, 2);
  assert.deepEqual(variants.map((variant) => variant.osm?.id), [19901538, 19901537]);
  assert.ok(variants.every((variant) => variant.network === 'UZ:municipal'));
  assert.ok(variants.every((variant) => !variant.canonicalName.includes('Troitsk')));
});

test('route membership lookup includes OSM variant stops', () => {
  const stopId = 'uz:tashkent:stop:bus:osm:node:13308770769';
  assert.deepEqual(
    getRoutesForStop(stopId, { requireFullSequence: true }).map((route) => route.ref),
    ['1', '17'],
  );
});

test('incomplete OSM relations do not promote registry-only routes', () => {
  assert.equal(getTransportRoute('uz:tashkent:route:bus:77')?.coverage, 'metadata_only');
  assert.equal(getTransportRoute('uz:tashkent:route:bus:101')?.coverage, 'metadata_only');
  assert.equal(getTransportRoute('uz:tashkent:route:bus:79')?.coverage, 'terminals_only');
  assert.equal(getTransportRoute('uz:tashkent:route:bus:110')?.coverage, 'terminals_only');
});

test('single valid OSM direction can still provide full ordered topology', () => {
  const route84 = getTransportRoute('uz:tashkent:route:bus:84');
  assert.equal(route84?.coverage, 'full');
  assert.equal(getRouteVariants(route84.id).length, 1);
  assert.equal(getRouteVariants(route84.id)[0].stopIds.length, 4);
  assert.equal(getRouteVariants(route84.id)[0].geometry?.type, 'MultiLineString');

  const route16 = getTransportRoute('uz:tashkent:route:bus:16');
  assert.equal(route16?.coverage, 'full');
  assert.equal(getRouteVariants(route16.id).length, 1);
  assert.equal(getRouteVariants(route16.id)[0].stopIds.length, 40);
});

test('manual terminal anchors remain available after OSM topology promotion', () => {
  const route5 = getTransportRoute('uz:tashkent:route:bus:5');
  assert.equal(route5?.coverage, 'full');
  assert.deepEqual(route5?.stopIds, [
    'uz:tashkent:stop:bus:feruza',
    'uz:tashkent:stop:metro:chorsu',
  ]);
  assert.equal(getTransportStop('uz:tashkent:stop:bus:feruza')?.accuracy, 'neighborhood');

  const route67 = getTransportRoute('uz:tashkent:route:bus:67');
  assert.equal(route67?.coverage, 'terminals_only');
  assert.deepEqual(route67?.stopIds, [
    'uz:tashkent:stop:bus:yunusabad-19',
    'uz:tashkent:stop:bus:tashkent-international-airport',
  ]);
});

test('validator rejects out-of-range coordinates, invalid geometry and missing variant stops', () => {
  const invalidStop = {
    id: 'test:bad-stop', type: 'stop', mode: 'bus', country: 'UZ', cityId: 'uz:tashkent',
    canonicalName: 'Bad', center: { lat: 100, lng: 200 },
  };
  const invalidRoute = {
    id: 'test:bad-route', type: 'route', mode: 'bus', country: 'UZ', cityId: 'uz:tashkent',
    canonicalName: 'Bad route', ref: 'X', coverage: 'full', stopIds: [],
    variants: [{
      id: 'test:bad-variant', type: 'route_variant', mode: 'bus', country: 'UZ', cityId: 'uz:tashkent',
      canonicalName: 'Bad variant', ref: 'X',
      geometry: { type: 'MultiLineString', coordinates: [[[200, 100], [201, 101]]] },
      bounds: { west: 200, south: 100, east: 201, north: 101 },
      stopIds: ['test:bad-stop', 'test:missing'],
    }],
  };
  const result = validateTransportCatalog({ stops: [invalidStop], routes: [invalidRoute], transfers: [] });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes('invalid center')));
  assert.ok(result.errors.some((error) => error.includes('invalid line segment')));
  assert.ok(result.errors.some((error) => error.includes('invalid bounds')));
  assert.ok(result.errors.some((error) => error.includes('test:missing')));
});
