import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const expected = Object.freeze([
  ['ro:timisoara:poi:victory-square', 'poi.square', 'Piața Victoriei', 45.75282, 21.22528, 'way', 444125777, 'Q1402782'],
  ['ro:timisoara:poi:metropolitan-cathedral', 'poi.cathedral', 'Catedrala Mitropolitană din Timișoara', 45.7507, 21.22423, 'way', 194450516, 'Q1261597'],
]);

test('Timisoara exposes verified central landmarks', () => {
  for (const [id, type, canonicalName, lat, lng, osmType, osmId, wikidataId] of expected) {
    const entity = getGeoEntity(id);
    assert.ok(entity, `${id} should exist`);
    assert.equal(entity.type, type);
    assert.equal(entity.country, 'RO');
    assert.equal(entity.parentId, 'ro:timisoara');
    assert.equal(entity.canonicalName, canonicalName);
    assert.deepEqual(entity.center, { lat, lng });
    assert.equal(entity.source, 'osm');
    assert.deepEqual(entity.osm, { type: osmType, id: osmId });
    assert.equal(entity.wikidataId, wikidataId);
    assert.equal(entity.accuracy, 'poi');
    assert.ok(Number.isFinite(entity.accuracyM));
  }
});

test('Timisoara central landmarks keep unique external identities', () => {
  const entities = expected.map(([id]) => getGeoEntity(id));
  assert.equal(new Set(entities.map((entity) => `${entity.osm.type}:${entity.osm.id}`)).size, entities.length);
  assert.equal(new Set(entities.map((entity) => entity.wikidataId)).size, entities.length);
});
