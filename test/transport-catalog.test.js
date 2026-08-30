import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TRANSPORT_ROUTES,
  TRANSPORT_STOPS,
  TRANSPORT_TRANSFERS,
  findTransportRoutes,
  findTransportStops,
  getRoutesForStop,
  getStopsForRoute,
  getTransfersForStop,
  getTransportCoverage,
  getTransportRoute,
  getTransportStop,
  validateTransportCatalog,
} from '../src/transport/catalog.js';

test('transport catalog passes invariants', () => {
  assert.deepEqual(validateTransportCatalog(), { valid: true, errors: [] });
});

test('Tashkent metro exposes all 50 stations as transport stops', () => {
  const stops = findTransportStops({ country: 'UZ', cityId: 'uz:tashkent', mode: 'metro' });
  assert.equal(stops.length, 50);
  assert.equal(getTransportStop('uz:tashkent:stop:metro:chorsu')?.geoEntityId, 'uz:tashkent:metro:chorsu');
});

test('Tashkent metro routes preserve ordered station sequences', () => {
  const routes = findTransportRoutes({ cityId: 'uz:tashkent', mode: 'metro' });
  assert.equal(routes.length, 4);

  const chilonzor = getTransportRoute('uz:tashkent:route:metro:chilonzor');
  assert.equal(chilonzor?.coverage, 'full');
  assert.equal(chilonzor?.stopIds.length, 17);
  assert.equal(chilonzor?.stopIds[0], 'uz:tashkent:stop:metro:buyuk-ipak-yoli');
  assert.equal(chilonzor?.stopIds.at(-1), 'uz:tashkent:stop:metro:chinor');

  const stops = getStopsForRoute(chilonzor.id);
  assert.equal(stops[0].canonicalName, 'Buyuk Ipak Yoli');
  assert.equal(stops.at(-1).canonicalName, 'Chinor');
});

test('route and interchange indexes support transfer-aware consumers', () => {
  const dostlik = 'uz:tashkent:stop:metro:dostlik';
  assert.deepEqual(getRoutesForStop(dostlik).map((route) => route.ref), ["O'zbekiston"]);

  const transfers = getTransfersForStop(dostlik);
  assert.equal(transfers.length, 1);
  assert.deepEqual(transfers[0].stopIds, [
    'uz:tashkent:stop:metro:dostlik',
    'uz:tashkent:stop:metro:texnopark',
  ]);
  assert.equal(TRANSPORT_TRANSFERS.length, 4);
});

test('Tashkent bus snapshot contains all 170 route refs known after route 79 launch', () => {
  const buses = findTransportRoutes({ cityId: 'uz:tashkent', mode: 'bus' });
  assert.equal(buses.length, 170);
  assert.equal(TRANSPORT_ROUTES.length, 174);

  assert.ok(getTransportRoute('uz:tashkent:route:bus:1'));
  assert.ok(getTransportRoute('uz:tashkent:route:bus:8t'));
  assert.ok(getTransportRoute('uz:tashkent:route:bus:199'));
  assert.equal(getTransportRoute('uz:tashkent:route:bus:4'), null);
});

test('bus coverage report separates registry metadata from terminal and full topology', () => {
  assert.deepEqual(getTransportCoverage({ cityId: 'uz:tashkent', mode: 'bus' }), {
    total: 170,
    full: 0,
    terminalsOnly: 4,
    metadataOnly: 166,
  });
  assert.deepEqual(getTransportCoverage({ cityId: 'uz:tashkent' }), {
    total: 174,
    full: 4,
    terminalsOnly: 4,
    metadataOnly: 166,
  });
});

test('route 6 reuses verified Yunusabad geo entities as terminal points', () => {
  const route6 = getTransportRoute('uz:tashkent:route:bus:6');
  assert.equal(route6?.coverage, 'terminals_only');
  assert.equal(route6?.sourceUpdatedAt, '2026-08-08');
  assert.deepEqual(route6?.terminalNames, ['Yunusabad-17', 'Yunusabad-6']);

  const stops = getStopsForRoute(route6.id);
  assert.deepEqual(stops.map((stop) => stop.geoEntityId), [
    'uz:tashkent:microdistrict:yunusabad-17',
    'uz:tashkent:microdistrict:yunusabad-6',
  ]);
  assert.deepEqual(stops.map((stop) => stop.osm?.id), [1866983401, 1867002805]);
});

test('routes 14 and 16 share verified railway and TTZ terminal points', () => {
  const railway = getTransportStop('uz:tashkent:stop:bus:tashkent-railway-station');
  assert.equal(railway?.geoEntityId, 'uz:tashkent:poi:tashkent-north-railway-station');
  assert.equal(railway?.wikidataId, 'Q12823615');

  for (const ref of ['14', '16']) {
    const route = getTransportRoute(`uz:tashkent:route:bus:${ref}`);
    assert.equal(route?.coverage, 'terminals_only');
    assert.deepEqual(route?.stopIds, [
      'uz:tashkent:stop:bus:tashkent-railway-station',
      'uz:tashkent:stop:bus:ttz-bus-station',
    ]);
  }
});

test('route 79 distinguishes terminal-only coverage from navigable topology', () => {
  assert.equal(TRANSPORT_STOPS.length, 54);

  const busStops = findTransportStops({ cityId: 'uz:tashkent', mode: 'bus' });
  assert.equal(busStops.length, 4);
  assert.equal(getTransportStop('uz:tashkent:stop:bus:ttz-bus-station')?.canonicalName, 'TTZ Bus Station');
  assert.deepEqual(getTransportStop('uz:tashkent:stop:bus:ttz-bus-station')?.osm, { type: 'way', id: 98599092 });

  const route79 = getTransportRoute('uz:tashkent:route:bus:79');
  assert.equal(route79?.coverage, 'terminals_only');
  assert.equal(route79?.sourceUpdatedAt, '2026-08-18');
  assert.deepEqual(route79?.stopIds, [
    'uz:tashkent:stop:metro:beruniy',
    'uz:tashkent:stop:bus:ttz-bus-station',
  ]);

  assert.deepEqual(getRoutesForStop('uz:tashkent:stop:metro:beruniy', { requireFullSequence: true }).map((route) => route.ref), ["O'zbekiston"]);
});
