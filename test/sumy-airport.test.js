import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoChildren } from '../src/index.js';

test('Sumy exposes verified airport anchor and aviation codes', () => {
  const children = getGeoChildren('ua:sumy');
  const airport = children.find((entity) => entity.id === 'ua:sumy:poi:sumy-airport');

  assert.ok(airport);
  assert.equal(airport.type, 'poi.airport');
  assert.equal(airport.canonicalName, 'Sumy Airport');
  assert.equal(airport.parentId, 'ua:sumy');
  assert.deepEqual(airport.center, { lat: 50.8583333, lng: 34.7625 });
  assert.equal(airport.iataCode, 'UMY');
  assert.equal(airport.icaoCode, 'UKHS');
  assert.equal(airport.sourceUrl, 'https://avia.gov.ua/placemarks/oblasne-komunalne-pidpriyemstvo-aeroport-sumi/');
});
