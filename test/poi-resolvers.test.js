import test from 'node:test';
import assert from 'node:assert/strict';

import {
  nearestGeoEntityToMetro,
  nearestMetroToGeoEntity,
  nearestMetroToPoint,
  nearestParkToMetro,
  nearestMetroToPark,
  nearestPoiToMetro,
  nearestMetroToPoi,
  nearestMahallaToMetro,
  nearestMetroToMahalla,
  nearestMicrodistrictToMetro,
  nearestMetroToMicrodistrict,
  nearestLocalAreaToMetro,
  nearestMetroToLocalArea,
  nearestAddressToMetro,
  nearestMetroToAddress,
} from '../src/index.js';

const PUSHKIN = { country: 'UZ', city: 'tashkent', canonical: 'Pushkin' };
const CENTRAL_PARK = { country: 'UZ', city: 'tashkent', canonical: 'Central Park Mirzo Ulugbek' };

test('nearestParkToMetro resolves the closest catalogued park to a metro station', () => {
  const result = nearestParkToMetro(PUSHKIN);
  assert.ok(result);
  assert.equal(result.park.canonicalName, 'Central Park Mirzo Ulugbek');
  assert.equal(result.station.canonicalName, 'Pushkin');
  assert.ok(result.distanceKm > 1 && result.distanceKm < 2);
});

test('nearestMetroToPark resolves the closest metro station to a named park (reverse direction)', () => {
  const result = nearestMetroToPark(CENTRAL_PARK);
  assert.ok(result);
  assert.equal(result.park.canonicalName, 'Central Park Mirzo Ulugbek');
  assert.ok(['Pushkin', 'Hamid Olimjon'].includes(result.station.canonicalName));
});

test('nearestGeoEntityToMetro returns null for an unknown station', () => {
  assert.equal(nearestGeoEntityToMetro({ country: 'UZ', city: 'tashkent', canonical: 'Not A Real Station' }), null);
});

test('nearestMetroToGeoEntity returns null for an unknown entity', () => {
  assert.equal(nearestMetroToGeoEntity({ country: 'UZ', city: 'tashkent', canonical: 'Not A Real Park', type: 'poi.park' }), null);
});

test('nearestGeoEntityToMetro respects maxDistanceKm and returns null when nothing is close enough', () => {
  assert.equal(nearestParkToMetro(PUSHKIN, { maxDistanceKm: 0.5 }), null);
});

test('nearestPoiToMetro / nearestMetroToPoi resolve in both directions', () => {
  const toPoi = nearestPoiToMetro(PUSHKIN, { maxDistanceKm: 5 });
  assert.ok(toPoi);
  assert.equal(toPoi.entity.canonicalName, 'Central Park Mirzo Ulugbek');

  const toMetro = nearestMetroToPoi(CENTRAL_PARK, { maxDistanceKm: 5 });
  assert.ok(toMetro);
  assert.equal(toMetro.entity.canonicalName, 'Central Park Mirzo Ulugbek');
});

// Note: the reverse lookup is not guaranteed to land back on the same metro
// station — a third station can legitimately be closer to the resolved
// entity than the one we started from. Each direction is verified against
// its own nearest-neighbor invariant instead of assuming symmetry.

test('nearestMahallaToMetro / nearestMetroToMahalla resolve in both directions', () => {
  const result = nearestMahallaToMetro(PUSHKIN, { maxDistanceKm: 5 });
  assert.ok(result);
  assert.equal(result.entity.type, 'mahalla');

  const reverse = nearestMetroToMahalla({ country: 'UZ', city: 'tashkent', canonical: result.entity.canonicalName }, { maxDistanceKm: 5 });
  assert.ok(reverse);
  assert.equal(reverse.station.type, 'metro');
  assert.equal(reverse.entity.canonicalName, result.entity.canonicalName);
});

test('nearestMicrodistrictToMetro / nearestMetroToMicrodistrict resolve in both directions', () => {
  const result = nearestMicrodistrictToMetro(PUSHKIN, { maxDistanceKm: 5 });
  assert.ok(result);
  assert.equal(result.entity.type, 'microdistrict');

  const reverse = nearestMetroToMicrodistrict({ country: 'UZ', city: 'tashkent', canonical: result.entity.canonicalName }, { maxDistanceKm: 5 });
  assert.ok(reverse);
  assert.equal(reverse.station.type, 'metro');
  assert.equal(reverse.entity.canonicalName, result.entity.canonicalName);
});

test('nearestLocalAreaToMetro / nearestMetroToLocalArea resolve in both directions', () => {
  const result = nearestLocalAreaToMetro(PUSHKIN, { maxDistanceKm: 5 });
  assert.ok(result);
  assert.equal(result.entity.type, 'local_area');

  const reverse = nearestMetroToLocalArea({ country: 'UZ', city: 'tashkent', canonical: result.entity.canonicalName }, { maxDistanceKm: 5 });
  assert.ok(reverse);
  assert.equal(reverse.station.type, 'metro');
  assert.equal(reverse.entity.canonicalName, result.entity.canonicalName);
});

test('nearestMetroToPoint resolves the nearest station to a bare coordinate', () => {
  const result = nearestMetroToPoint({ lat: 41.3124, lng: 69.29853 }, { country: 'UZ', maxDistanceKm: 5 });
  assert.ok(result);
  assert.equal(result.station.canonicalName, 'Hamid Olimjon');
});

test('nearestMetroToAddress resolves a Postgres-style geocoded address row to its nearest metro station', () => {
  // Simulates a row already fetched and geocoded from Postgres — only lat/lng is needed.
  const addressRow = { lat: 41.3124, lng: 69.29853 };
  const result = nearestMetroToAddress(addressRow, { country: 'UZ', maxDistanceKm: 5 });
  assert.ok(result);
  assert.equal(result.station.canonicalName, 'Hamid Olimjon');
});

test('nearestAddressToMetro searches a caller-supplied address list instead of the static catalog', () => {
  const addresses = [
    { id: 'addr:1', type: 'address', country: 'UZ', center: { lat: 41.3124, lng: 69.29853 } },
    { id: 'addr:2', type: 'address', country: 'UZ', center: { lat: 41.0, lng: 69.0 } },
  ];
  const result = nearestAddressToMetro(PUSHKIN, addresses, { maxDistanceKm: 5 });
  assert.ok(result);
  assert.equal(result.entity.id, 'addr:1');
});

test('nearestAddressToMetro returns null when no supplied address is close enough', () => {
  const addresses = [{ id: 'addr:far', type: 'address', country: 'UZ', center: { lat: 41.0, lng: 69.0 } }];
  assert.equal(nearestAddressToMetro(PUSHKIN, addresses, { maxDistanceKm: 5 }), null);
});
