import test from 'node:test';
import assert from 'node:assert/strict';

import { RO_CITY_ENTITIES } from '../data-source/ro/cities.js';

const EXPECTED = Object.freeze([
  ['ro:bucharest', 'Bucharest', 44.43225, 26.10626, 'geonames', '683506'],
  ['ro:cluj-napoca', 'Cluj-Napoca', 46.76667, 23.6, 'geonames', '681290'],
  ['ro:timisoara', 'Timișoara', 45.75372, 21.22571, 'geonames', '665087'],
  ['ro:iasi', 'Iași', 47.16667, 27.6, 'geonames', '675810'],
  ['ro:constanta', 'Constanța', 44.18073, 28.63432, 'geonames', '680963'],
  ['ro:brasov', 'Brașov', 45.64861, 25.60613, 'geonames', '683844'],
  ['ro:otopeni', 'Otopeni', 44.55, 26.07, 'wikidata', 'Q727421'],
]);

test('RO city coverage keeps verified identities and centers', () => {
  assert.equal(RO_CITY_ENTITIES.length, EXPECTED.length);

  for (const [id, canonicalName, lat, lng, source, externalId] of EXPECTED) {
    const entity = RO_CITY_ENTITIES.find((candidate) => candidate.id === id);
    assert.ok(entity, `missing ${id}`);
    assert.equal(entity.type, 'city');
    assert.equal(entity.country, 'RO');
    assert.equal(entity.canonicalName, canonicalName);
    assert.deepEqual(entity.center, { lat, lng });
    assert.equal(entity.source, source);
    assert.equal(entity.accuracy, 'city');
    if (source === 'geonames') {
      assert.equal(entity.accuracyM, 12000);
      assert.ok(entity.sourceUrl.includes(`/${externalId}/`));
    } else {
      assert.equal(entity.accuracyM, 5000);
      assert.equal(entity.wikidataId, externalId);
    }
  }
});

test('RO city ids and source URLs are unique', () => {
  assert.equal(new Set(RO_CITY_ENTITIES.map(({ id }) => id)).size, RO_CITY_ENTITIES.length);
  assert.equal(new Set(RO_CITY_ENTITIES.map(({ sourceUrl }) => sourceUrl)).size, RO_CITY_ENTITIES.length);
});
