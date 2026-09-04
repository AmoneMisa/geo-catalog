import test from 'node:test';
import assert from 'node:assert/strict';

import { RO_CITY_ENTITIES } from '../src/data/ro/cities.js';

const EXPECTED = Object.freeze([
  ['ro:bucharest', 'Bucharest', 44.43225, 26.10626, '683506'],
  ['ro:cluj-napoca', 'Cluj-Napoca', 46.76667, 23.6, '681290'],
  ['ro:timisoara', 'Timișoara', 45.75372, 21.22571, '665087'],
  ['ro:iasi', 'Iași', 47.16667, 27.6, '675810'],
  ['ro:constanta', 'Constanța', 44.18073, 28.63432, '680963'],
  ['ro:brasov', 'Brașov', 45.64861, 25.60613, '683844'],
]);

test('RO major cities keep verified GeoNames identities and centers', () => {
  assert.equal(RO_CITY_ENTITIES.length, EXPECTED.length);

  for (const [id, canonicalName, lat, lng, geonamesId] of EXPECTED) {
    const entity = RO_CITY_ENTITIES.find((candidate) => candidate.id === id);
    assert.ok(entity, `missing ${id}`);
    assert.equal(entity.type, 'city');
    assert.equal(entity.country, 'RO');
    assert.equal(entity.canonicalName, canonicalName);
    assert.deepEqual(entity.center, { lat, lng });
    assert.equal(entity.source, 'geonames');
    assert.equal(entity.accuracy, 'city');
    assert.equal(entity.accuracyM, 12000);
    assert.ok(entity.sourceUrl.includes(`/${geonamesId}/`));
  }
});

test('RO city ids and source URLs are unique', () => {
  assert.equal(new Set(RO_CITY_ENTITIES.map(({ id }) => id)).size, RO_CITY_ENTITIES.length);
  assert.equal(new Set(RO_CITY_ENTITIES.map(({ sourceUrl }) => sourceUrl)).size, RO_CITY_ENTITIES.length);
});
