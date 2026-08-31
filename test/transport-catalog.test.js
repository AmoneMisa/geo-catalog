import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TRANSPORT_ROUTES,
  TRANSPORT_ROUTE_VARIANTS,
  TRANSPORT_STOPS,
  TRANSPORT_TRANSFERS,
  findTransportRouteVariants,
  findTransportRoutes,
  findTransportStops,
  getRouteVariants,
  getRoutesForStop,
  getStopsForRoute,
  getStopsForRouteVariant,
  getTransfersForStop,
  getTransportCoverage,
  getTransportMapCoverage,
  getTransportRoute,
  getTransportRouteGeoJSON,
  getTransportRoutesGeoJSON,
  getTransportRouteVariant,
  getTransportStop,
  getTransportStopsGeoJSON,
  validateTransportCatalog,
} from '../src/transport/catalog.js';

const OSM_BUS_SNAPSHOT_DATE = TRANSPORT_ROUTE_VARIANTS[0]?.sourceUpdatedAt;

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

test('Tashkent bus registry contains all 171 route refs including Express', () => {
  const buses = findTransportRoutes({ cityId: 'uz:tashkent', mode: 'bus' });
  assert.equal(buses.length, 171);
  assert.equal(TRANSPORT_ROUTES.length, 237);
  assert.ok(getTransportRoute('uz:tashkent:route:bus:1'));
  assert.ok(getTransportRoute('uz:tashkent:route:bus:8t'));
  assert.ok(getTransportRoute('uz:tashkent:route:bus:199'));
  assert.ok(getTransportRoute('uz:tashkent:route:bus:express'));
  assert.equal(getTransportRoute('uz:tashkent:route:bus:4'), null);
});

test('topology coverage and map geometry coverage are independent', () => {
  const topology = getTransportCoverage({ cityId: 'uz:tashkent', mode: 'bus' });
  const map = getTransportMapCoverage({ cityId: 'uz:tashkent', mode: 'bus' });

  assert.equal(topology.total, 171);
  assert.ok(topology.full >= 60);
  assert.equal(topology.full + topology.terminalsOnly + topology.metadataOnly, topology.total);

  assert.equal(map.total, 171);
  assert.ok(map.withGeometry >= 60);
  assert.ok(map.withGeometry >= topology.full);
  assert.equal(map.withGeometry + map.withoutGeometry, map.total);
  assert.equal(
    map.variantsWithGeometry,
    TRANSPORT_ROUTE_VARIANTS.filter((variant) => variant.mode === 'bus').length,
  );
  assert.ok(TRANSPORT_ROUTE_VARIANTS.length >= 117);
});

test('every road-transport variant includes real road geometry and map bounds', () => {
  assert.match(OSM_BUS_SNAPSHOT_DATE ?? '', /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(TRANSPORT_ROUTE_VARIANTS.length >= 117);
  for (const variant of TRANSPORT_ROUTE_VARIANTS) {
    assert.equal(variant.geometry?.type, 'MultiLineString', variant.id);
    assert.ok(variant.geometry.coordinates.length > 0, variant.id);
    assert.ok(variant.geometry.coordinates.every((segment) => segment.length >= 2), variant.id);
    assert.ok(['osm', 'official', 'easyway'].includes(variant.geometrySource), variant.id);
    assert.equal(variant.sourceUpdatedAt, OSM_BUS_SNAPSHOT_DATE, variant.id);
    assert.equal(variant.geometryUpdatedAt, OSM_BUS_SNAPSHOT_DATE, variant.id);
    assert.ok(variant.bounds.west <= variant.bounds.east, variant.id);
    assert.ok(variant.bounds.south <= variant.bounds.north, variant.id);
    assert.notEqual(variant.stopIds.length, 1, variant.id);
  }
});

test('OSM snapshot keeps at least the established bus passenger-stop baseline', () => {
  const busStops = findTransportStops({ cityId: 'uz:tashkent', mode: 'bus' });
  assert.ok(TRANSPORT_STOPS.length >= 1297);
  assert.ok(busStops.length >= 1247);

  const stop = getTransportStop('uz:tashkent:stop:bus:osm:node:13308770769');
  assert.equal(stop?.canonicalName, 'Массив Хумаюн');
  assert.deepEqual(stop?.center, { lat: 41.341248, lng: 69.3857 });
  assert.deepEqual(stop?.osm, { type: 'node', id: 13308770769 });
  assert.equal(stop?.sourceUpdatedAt, OSM_BUS_SNAPSHOT_DATE);
});

test('route 1 keeps its verified OSM directions and geometry', () => {
  const route = getTransportRoute('uz:tashkent:route:bus:1');
  assert.equal(route?.coverage, 'full');
  assert.equal(route?.topologySource, 'osm');
  assert.equal(route?.topologyUpdatedAt, OSM_BUS_SNAPSHOT_DATE);
  assert.equal(route?.mapGeometrySource, 'osm');
  assert.equal(route?.mapGeometryUpdatedAt, OSM_BUS_SNAPSHOT_DATE);

  const variants = getRouteVariants(route.id);
  const relationIds = variants.map((variant) => variant.osm?.id).sort((a, b) => a - b);
  assert.deepEqual(relationIds, [1866064, 11625088]);

  const outbound = variants.find((variant) => variant.osm?.id === 1866064);
  assert.equal(outbound?.from, 'Mirzo Ulugbek sanoat zonasi');
  assert.equal(outbound?.to, 'Toshkent MUM');
  assert.ok(outbound?.stopIds.length >= 2);
  assert.equal(outbound?.geometry?.type, 'MultiLineString');
  assert.ok(outbound?.geometry.coordinates.length > 20);
  assert.ok(outbound?.bounds.west < outbound?.bounds.east);
  assert.ok(outbound?.bounds.south < outbound?.bounds.north);

  const outboundStops = getStopsForRouteVariant(route.id, 1866064);
  assert.ok(outboundStops.length >= 2);
  assert.equal(getTransportRouteVariant(outbound.id)?.osm?.id, 1866064);
});

test('map API exposes bus route shapes and stop points as GeoJSON', () => {
  const routeGeoJSON = getTransportRouteGeoJSON('uz:tashkent:route:bus:1');
  assert.equal(routeGeoJSON.type, 'FeatureCollection');
  assert.equal(routeGeoJSON.features.length, 2);
  assert.deepEqual(
    routeGeoJSON.features.map((feature) => feature.properties.osmRelationId).sort((a, b) => a - b),
    [1866064, 11625088],
  );
  assert.ok(routeGeoJSON.features.every((feature) => feature.geometry.type === 'MultiLineString'));

  const busStops = getTransportStopsGeoJSON({ country: 'UZ', cityId: 'uz:tashkent', mode: 'bus' });
  assert.equal(busStops.type, 'FeatureCollection');
  assert.equal(busStops.features.length, findTransportStops({ country: 'UZ', cityId: 'uz:tashkent', mode: 'bus' }).length);
  const humoyun = busStops.features.find((feature) => feature.id === 'uz:tashkent:stop:bus:osm:node:13308770769');
  assert.deepEqual(humoyun?.geometry, { type: 'Point', coordinates: [69.3857, 41.341248] });
  assert.equal(humoyun?.properties.mode, 'bus');
});

test('viewport map queries return only visible stops and intersecting route shapes', () => {
  const bounds = { west: 69.36, south: 41.32, east: 69.41, north: 41.37 };
  const allBusStops = findTransportStops({ cityId: 'uz:tashkent', mode: 'bus' });
  const visibleStops = findTransportStops({ cityId: 'uz:tashkent', mode: 'bus', bounds });
  assert.ok(visibleStops.length > 0);
  assert.ok(visibleStops.length < allBusStops.length);
  assert.ok(visibleStops.every((stop) =>
    stop.center.lng >= bounds.west && stop.center.lng <= bounds.east &&
    stop.center.lat >= bounds.south && stop.center.lat <= bounds.north
  ));

  const visibleVariants = findTransportRouteVariants({ cityId: 'uz:tashkent', mode: 'bus', bounds, hasGeometry: true });
  assert.ok(visibleVariants.length > 0);
  assert.ok(visibleVariants.every((variant) => variant.geometry?.type === 'MultiLineString'));

  const routesGeoJSON = getTransportRoutesGeoJSON({ cityId: 'uz:tashkent', mode: 'bus', bounds });
  assert.equal(routesGeoJSON.type, 'FeatureCollection');
  assert.ok(routesGeoJSON.features.length > 0);
  assert.ok(routesGeoJSON.features.every((feature) => feature.geometry.type === 'MultiLineString'));

  const stopsGeoJSON = getTransportStopsGeoJSON({ cityId: 'uz:tashkent', mode: 'bus', bounds });
  assert.equal(stopsGeoJSON.features.length, visibleStops.length);
  assert.deepEqual(getTransportRoutesGeoJSON({ bounds: { west: 1, south: 2, east: -1, north: 3 } }).features, []);
});

test('route 7 excludes the unrelated Troitsk route relation', () => {
  const variants = getRouteVariants('uz:tashkent:route:bus:7');
  assert.ok(variants.length >= 2);
  const relationIds = variants.map((variant) => variant.osm?.id);
  assert.ok(relationIds.includes(19901537));
  assert.ok(relationIds.includes(19901538));
  assert.ok(variants.every((variant) => !variant.canonicalName.includes('Troitsk')));
});

test('route membership lookup includes OSM variant stops', () => {
  const stopId = 'uz:tashkent:stop:bus:osm:node:13308770769';
  const refs = getRoutesForStop(stopId, { requireFullSequence: true }).map((route) => route.ref);
  assert.ok(refs.includes('1'));
  assert.ok(refs.includes('17'));
});

test('known topology routes may also gain shape-only variants without losing full coverage', () => {
  for (const routeId of ['uz:tashkent:route:bus:84', 'uz:tashkent:route:bus:16']) {
    const route = getTransportRoute(routeId);
    assert.equal(route?.coverage, 'full');
    assert.ok(getRouteVariants(route.id).length >= 1);
    assert.ok(getRouteVariants(route.id).some((variant) => variant.stopIds.length >= 2));
    assert.ok(getRouteVariants(route.id).every((variant) => variant.geometry?.type === 'MultiLineString'));
  }
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
  assert.ok(['terminals_only', 'full'].includes(route67?.coverage));
  assert.deepEqual(route67?.stopIds, [
    'uz:tashkent:stop:bus:yunusabad-19',
    'uz:tashkent:stop:bus:tashkent-international-airport',
  ]);
});

test('official route payloads promote former terminal and metadata gaps to full topology', () => {
  const expected = new Map([
    ['8T', 2], ['61', 2], ['62', 2], ['63', 2], ['64', 2], ['65', 2], ['66', 2],
    ['67', 2], ['68', 2], ['69', 2], ['70', 2], ['77', 2], ['110', 2], ['121', 2],
    ['71', 2], ['72', 2], ['73', 2], ['74', 2], ['75', 2], ['76', 2], ['78', 2],
    ['80', 2], ['81', 2], ['82', 2], ['83', 2], ['85', 2], ['86', 2], ['87', 2],
    ['88', 2], ['89', 2], ['91', 2], ['94', 2], ['95', 2], ['96', 2], ['97', 2],
    ['98', 2], ['99', 2], ['100', 2], ['101', 2], ['103', 2], ['104', 2], ['105', 2],
    ['106', 2], ['109', 2], ['112', 2], ['113', 2], ['114', 2], ['115', 2],
    ['116', 2], ['117', 2], ['118', 2], ['119', 2], ['120', 2], ['122', 2],
    ['123', 2], ['124', 2], ['125', 2], ['126', 2], ['129', 2], ['130', 2],
    ['131', 2], ['134', 2], ['135', 2], ['136', 2], ['138', 2], ['139', 2],
    ['141', 2], ['142', 2], ['145', 2], ['146', 2], ['147', 2], ['148', 2],
    ['149', 2], ['150', 2], ['151', 2], ['152', 2], ['153', 2], ['169', 2],
    ['181', 2], ['183', 2], ['184', 2], ['185', 2], ['188', 2], ['190', 2],
    ['196', 2], ['198', 2], ['199', 2], ['133', 2], ['140', 2],
    ['Express', 2],
  ]);

  for (const [ref, directionCount] of expected) {
    const route = getTransportRoute(`uz:tashkent:route:bus:${ref.toLowerCase()}`);
    const official = route?.variants?.filter((variant) => variant.source === 'official') ?? [];
    assert.equal(route?.coverage, 'full', ref);
    assert.equal(official.length, directionCount, ref);
    assert.ok(official.every((variant) => variant.stopIds.length >= 2), ref);
    assert.ok(official.every((variant) => variant.geometry?.type === 'MultiLineString'), ref);
    assert.ok(official.every((variant) => variant.bounds.west < variant.bounds.east), ref);
  }

  const route101 = getTransportRoute('uz:tashkent:route:bus:101');
  const route101Official = route101.variants.filter((variant) => variant.source === 'official');
  assert.deepEqual(route101Official.map(({ from, to }) => [from, to]), [
    ['ст. м. Буюк Ипак Йули', 'Махалля Дархан'],
    ['Махалля Дархан', 'ст. м. Буюк Ипак Йули'],
  ]);
  assert.deepEqual(route101Official.map((variant) => variant.stopIds.length), [42, 46]);

  const express = getTransportRoute('uz:tashkent:route:bus:express');
  const expressOfficial = express.variants.filter((variant) => variant.source === 'official');
  assert.deepEqual(expressOfficial.map(({ from, to }) => [from, to]), [
    ['Чиланзар вещевой рынок', 'Рынок "Уч Кахрамон"'],
    ['Рынок "Уч Кахрамон"', 'Чиланзар вещевой рынок'],
  ]);
  assert.deepEqual(expressOfficial.map((variant) => variant.stopIds.length), [10, 10]);
});

test('Tashkent marshrutka catalog exposes all EasyWay routes as full minibus topology', () => {
  const routes = findTransportRoutes({ cityId: 'uz:tashkent', mode: 'minibus' });
  const variants = findTransportRouteVariants({ cityId: 'uz:tashkent', mode: 'minibus' });
  assert.equal(routes.length, 62);
  assert.equal(variants.length, 124);
  assert.ok(routes.every((route) => route.coverage === 'full' && route.variants.length === 2));
  assert.ok(variants.every((variant) =>
    variant.source === 'easyway' &&
    variant.stopIds.length >= 2 &&
    variant.geometry?.type === 'MultiLineString'
  ));

  const route1m = getTransportRoute('uz:tashkent:route:minibus:1m');
  assert.equal(route1m?.canonicalName, 'Marshrutka 1m');
  assert.deepEqual(route1m?.variants.map(({ from, to }) => [from, to]), [
    ['Массив Корасув, Квартал 6', 'Прокуратура Мирзо-Улугбекского района'],
    ['Прокуратура Мирзо-Улугбекского района', 'Массив Корасув, Квартал 6'],
  ]);
});

test('validator accepts map-only route variants without pretending they have stop topology', () => {
  const mapOnlyRoute = {
    id: 'test:map-route', type: 'route', mode: 'bus', country: 'UZ', cityId: 'uz:tashkent',
    canonicalName: 'Map route', ref: 'M', coverage: 'metadata_only', stopIds: [],
    variants: [{
      id: 'test:map-variant', type: 'route_variant', mode: 'bus', country: 'UZ', cityId: 'uz:tashkent',
      canonicalName: 'Map variant', ref: 'M',
      geometry: { type: 'MultiLineString', coordinates: [[[69.2, 41.2], [69.3, 41.3]]] },
      bounds: { west: 69.2, south: 41.2, east: 69.3, north: 41.3 },
      stopIds: [],
    }],
  };
  assert.deepEqual(validateTransportCatalog({ stops: [], routes: [mapOnlyRoute], transfers: [] }), { valid: true, errors: [] });
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
