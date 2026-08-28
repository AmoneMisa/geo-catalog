import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/index.js';
import { validateGeoCatalog } from '../src/validate.js';

const entityWithBoundary = (boundary) => ({
  id: 'test:boundary',
  type: 'city',
  country: 'UZ',
  canonicalName: 'Boundary test',
  center: { lat: 41.3, lng: 69.2 },
  boundary,
});

const ring = [
  [69.1, 41.2],
  [69.3, 41.2],
  [69.3, 41.4],
  [69.1, 41.2],
];

test('catalog validation accepts Polygon and MultiPolygon boundaries', () => {
  const polygon = { type: 'Polygon', coordinates: [ring] };
  assert.deepEqual(validateGeoCatalog([entityWithBoundary(polygon)]), { valid: true, errors: [] });

  const multiPolygon = { type: 'MultiPolygon', coordinates: [[[...ring]]] };
  assert.deepEqual(validateGeoCatalog([entityWithBoundary(multiPolygon)]), { valid: true, errors: [] });
});

test('catalog validation rejects invalid GeoJSON boundary structure', () => {
  const unsupported = validateGeoCatalog([entityWithBoundary({ type: 'LineString', coordinates: ring })]);
  assert.equal(unsupported.valid, false);
  assert.ok(unsupported.errors.some((error) => error.includes('boundary.type must be Polygon or MultiPolygon')));

  const openRing = validateGeoCatalog([entityWithBoundary({
    type: 'Polygon',
    coordinates: [[
      [69.1, 41.2],
      [69.3, 41.2],
      [69.3, 41.4],
      [69.2, 41.4],
    ]],
  })]);
  assert.equal(openRing.valid, false);
  assert.ok(openRing.errors.some((error) => error.includes('linear ring must be closed')));

  const badPosition = validateGeoCatalog([entityWithBoundary({
    type: 'Polygon',
    coordinates: [[
      [181, 41.2],
      [69.3, 41.2, 0],
      [69.3, 41.4],
      [181, 41.2],
    ]],
  })]);
  assert.equal(badPosition.valid, false);
  assert.ok(badPosition.errors.some((error) => error.includes('longitude out of range')));
  assert.ok(badPosition.errors.some((error) => error.includes('position must be [lng, lat]')));
});

test('Tashkent district centers align with their OSM administrative relations', () => {
  const expected = [
    ['uz:tashkent:almazar', 41.340872, 69.216042, 2441651],
    ['uz:tashkent:bektemir', 41.245250, 69.349929, 2447560],
    ['uz:tashkent:mirobod', 41.277227, 69.292649, 2447634],
    ['uz:tashkent:mirzo-ulugbek', 41.328152, 69.319589, 5620904],
    ['uz:tashkent:sergeli', 41.246460, 69.276878, 2447546],
    ['uz:tashkent:uchtepa', 41.294002, 69.158969, 2434059],
    ['uz:tashkent:chilanzar', 41.276039, 69.203023, 2441810],
    ['uz:tashkent:shaykhantahur', 41.329460, 69.219731, 2439529],
    ['uz:tashkent:yunusabad', 41.334039, 69.290622, 2448072],
    ['uz:tashkent:yakkasaray', 41.287289, 69.248020, 2443769],
    ['uz:tashkent:yangihayot', 41.196482, 69.224760, 12030887],
    ['uz:tashkent:yashnobod', 41.291279, 69.327462, 1751444],
  ];

  for (const [id, lat, lng, relationId] of expected) {
    const entity = getGeoEntity(id);
    assert.equal(entity?.source, 'osm', id);
    assert.equal(entity?.accuracy, 'district', id);
    assert.deepEqual(entity?.center, { lat, lng }, id);
    assert.deepEqual(entity?.osm, { type: 'relation', id: relationId }, id);
    assert.ok(entity?.boundary, `${id} must keep its OSM boundary`);
    assert.equal(Object.isFrozen(entity.boundary), true, `${id} boundary must be immutable`);
    assert.equal(Object.isFrozen(entity.boundary.coordinates), true, `${id} coordinates must be immutable`);
  }
});

test('major Ukrainian city coordinates carry OSM administrative relation provenance', () => {
  const expected = [
    ['ua:kyiv', 50.4024, 30.5324, 421866],
    ['ua:kharkiv', 49.9914, 36.2810, 3154746],
    ['ua:odesa', 46.4713468, 30.7296333, 1413934],
    ['ua:dnipro', 48.485, 35.070, 1017311],
    ['ua:lviv', 49.8358, 24.0193, 2032280],
    ['ua:zaporizhzhia', 47.837778, 35.138333, 1418311],
  ];

  for (const [id, lat, lng, relationId] of expected) {
    const entity = getGeoEntity(id);
    assert.equal(entity?.source, 'osm', id);
    assert.equal(entity?.accuracy, 'city', id);
    assert.deepEqual(entity?.center, { lat, lng }, id);
    assert.deepEqual(entity?.osm, { type: 'relation', id: relationId }, id);
  }
});
