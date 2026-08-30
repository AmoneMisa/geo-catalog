import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getTransportStop,
  nearestTransportStops,
  transportDistanceM,
} from '../src/transport/catalog.js';

test('nearestTransportStops returns all nearby metro stations ordered by distance', () => {
  const chorsu = getTransportStop('uz:tashkent:stop:metro:chorsu');
  assert.ok(chorsu);

  const nearby = nearestTransportStops(chorsu.center, {
    country: 'UZ',
    cityId: 'uz:tashkent',
    mode: 'metro',
    maxDistanceM: 2500,
  });

  assert.ok(nearby.length >= 2);
  assert.equal(nearby[0].stop.id, chorsu.id);
  assert.equal(nearby[0].distanceM, 0);
  assert.ok(nearby.every((item, index) => index === 0 || item.distanceM >= nearby[index - 1].distanceM));
  assert.ok(nearby.every((item) => item.stop.mode === 'metro'));
});

test('nearestTransportStops exposes route refs for nearby bus endpoints', () => {
  const ttz = getTransportStop('uz:tashkent:stop:bus:ttz-bus-station');
  assert.ok(ttz);

  const nearby = nearestTransportStops(ttz.center, {
    country: 'UZ',
    cityId: 'uz:tashkent',
    mode: 'bus',
    maxDistanceM: 100,
  });

  assert.ok(nearby.length >= 1);
  assert.equal(nearby[0].stop.id, ttz.id);
  assert.equal(nearby[0].distanceM, 0);
  assert.ok(nearby[0].routeRefs.includes('14'));
  assert.ok(nearby[0].routeRefs.includes('16'));
});

test('nearestTransportStops supports consumer limits without changing distance ordering', () => {
  const chorsu = getTransportStop('uz:tashkent:stop:metro:chorsu');
  const allNearby = nearestTransportStops(chorsu.center, { mode: 'metro', maxDistanceM: 5000 });
  const limited = nearestTransportStops(chorsu.center, { mode: 'metro', maxDistanceM: 5000, limit: 3 });

  assert.equal(limited.length, 3);
  assert.deepEqual(limited, allNearby.slice(0, 3));
});

test('transportDistanceM rejects invalid WGS84 coordinates', () => {
  assert.equal(transportDistanceM({ lat: 91, lng: 0 }, { lat: 41, lng: 69 }), Number.POSITIVE_INFINITY);
});
