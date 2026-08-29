import test from 'node:test';
import assert from 'node:assert/strict';

import {
  nearestGeoEntityToMetro,
  nearestParkToMetro,
  nearestPoiToMetro,
  nearestMahallaToMetro,
  nearestMicrodistrictToMetro,
  nearestLocalAreaToMetro,
} from '../src/index.js';

const PUSHKIN = { country: 'UZ', city: 'tashkent', canonical: 'Pushkin' };

test('nearestParkToMetro resolves the closest catalogued park to a metro station', () => {
  const result = nearestParkToMetro(PUSHKIN);
  assert.ok(result);
  assert.equal(result.park.canonicalName, 'Central Park Mirzo Ulugbek');
  assert.equal(result.station.canonicalName, 'Pushkin');
  assert.ok(result.distanceKm > 1 && result.distanceKm < 2);
});

test('nearestGeoEntityToMetro returns null for an unknown station', () => {
  assert.equal(nearestGeoEntityToMetro({ country: 'UZ', city: 'tashkent', canonical: 'Not A Real Station' }), null);
});

test('nearestGeoEntityToMetro respects maxDistanceKm and returns null when nothing is close enough', () => {
  assert.equal(nearestParkToMetro(PUSHKIN, { maxDistanceKm: 0.5 }), null);
});

test('nearestPoiToMetro resolves the closest catalogued POI of any category', () => {
  const result = nearestPoiToMetro(PUSHKIN, { maxDistanceKm: 5 });
  assert.ok(result);
  assert.equal(result.entity.canonicalName, 'Central Park Mirzo Ulugbek');
  assert.ok(result.entity.type.startsWith('poi'));
});

test('nearestMahallaToMetro resolves the closest catalogued mahalla', () => {
  const result = nearestMahallaToMetro(PUSHKIN, { maxDistanceKm: 5 });
  assert.ok(result);
  assert.equal(result.entity.type, 'mahalla');
});

test('nearestMicrodistrictToMetro resolves the closest catalogued microdistrict', () => {
  const result = nearestMicrodistrictToMetro(PUSHKIN, { maxDistanceKm: 5 });
  assert.ok(result);
  assert.equal(result.entity.type, 'microdistrict');
});

test('nearestLocalAreaToMetro resolves the closest catalogued local area', () => {
  const result = nearestLocalAreaToMetro(PUSHKIN, { maxDistanceKm: 5 });
  assert.ok(result);
  assert.equal(result.entity.type, 'local_area');
});
