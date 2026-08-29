import test from 'node:test';
import assert from 'node:assert/strict';

import { nearestParkToMetro } from '../src/index.js';

test('nearestParkToMetro resolves the closest catalogued park to a metro station', () => {
  const result = nearestParkToMetro({ country: 'UZ', city: 'tashkent', canonical: 'Pushkin' });
  assert.ok(result);
  assert.equal(result.park.canonicalName, 'Central Park Mirzo Ulugbek');
  assert.equal(result.station.canonicalName, 'Pushkin');
  assert.ok(result.distanceKm > 1 && result.distanceKm < 2);
});

test('nearestParkToMetro returns null for an unknown station', () => {
  assert.equal(nearestParkToMetro({ country: 'UZ', city: 'tashkent', canonical: 'Not A Real Station' }), null);
});

test('nearestParkToMetro respects maxDistanceKm and returns null when nothing is close enough', () => {
  const result = nearestParkToMetro(
    { country: 'UZ', city: 'tashkent', canonical: 'Pushkin' },
    { maxDistanceKm: 0.5 },
  );
  assert.equal(result, null);
});
