import test from 'node:test';
import assert from 'node:assert/strict';

import { TASHKENT_POI_ENTITIES } from '../data-source/uz/tashkent/poi.js';
import { RO_CITY_ENTITIES } from '../data-source/ro/cities.js';
import { RO_OTOPENI_ENTITIES } from '../data-source/ro/otopeni/index.js';

test('Tashkent keeps its primary airport separate from Tashkent-Vostochny', () => {
  const airport = TASHKENT_POI_ENTITIES.find((entity) => entity.id === 'uz:tashkent:poi:islam-karimov-tashkent-international-airport');
  assert.ok(airport);
  assert.equal(airport.type, 'poi.airport');
  assert.equal(airport.parentId, 'uz:tashkent');
  assert.deepEqual(airport.osm, { type: 'relation', id: 12345328 });
  assert.equal(airport.wikidataId, 'Q860952');
});

test('Henri Coandă airport belongs to its physical Otopeni owner', () => {
  assert.ok(RO_CITY_ENTITIES.some((entity) => entity.id === 'ro:otopeni'));
  const airport = RO_OTOPENI_ENTITIES.find((entity) => entity.id === 'ro:otopeni:poi:henri-coanda-international-airport');
  assert.ok(airport);
  assert.equal(airport.type, 'poi.airport');
  assert.equal(airport.parentId, 'ro:otopeni');
  assert.deepEqual(airport.osm, { type: 'way', id: 84575372 });
  assert.equal(airport.wikidataId, 'Q257631');
});
