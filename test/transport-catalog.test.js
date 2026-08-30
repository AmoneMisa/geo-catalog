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

test('current bus seed distinguishes terminal-only coverage from navigable topology', () => {
  assert.equal(TRANSPORT_STOPS.length, 51);
  assert.equal(TRANSPORT_ROUTES.length, 5);

  const busStops = findTransportStops({ cityId: 'uz:tashkent', mode: 'bus' });
  assert.equal(busStops.length, 1);
  assert.equal(busStops[0].canonicalName, 'TTZ Bus Station');
  assert.deepEqual(busStops[0].osm, { type: 'way', id: 98599092 });

  const route79 = getTransportRoute('uz:tashkent:route:bus:79');
  assert.equal(route79?.coverage, 'terminals_only');
  assert.equal(route79?.sourceUpdatedAt, '2026-08-18');
  assert.deepEqual(route79?.stopIds, [
    'uz:tashkent:stop:metro:beruniy',
    'uz:tashkent:stop:bus:ttz-bus-station',
  ]);

  assert.deepEqual(getRoutesForStop('uz:tashkent:stop:metro:beruniy', { requireFullSequence: true }).map((route) => route.ref), ["O'zbekiston"]);
});
