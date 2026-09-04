import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const osmExpected = Object.freeze([
  ['ro:timisoara:poi:victory-square', 'poi.square', 'Piața Victoriei', 45.75282, 21.22528, 'way', 444125777, 'Q1402782'],
  ['ro:timisoara:poi:metropolitan-cathedral', 'poi.cathedral', 'Catedrala Mitropolitană din Timișoara', 45.7507, 21.22423, 'way', 194450516, 'Q1261597'],
]);

const wikidataExpected = Object.freeze([
  ['ro:timisoara:poi:union-square', 'poi.square', 'Piața Unirii', 45.75795, 21.22901388888889, 'Q422722'],
  ['ro:timisoara:poi:liberty-square', 'poi.square', 'Piața Libertății', 45.75556666666667, 21.2272, 'Q175320'],
]);

test('Timisoara exposes verified OSM-backed central landmarks', () => {
  for (const [id, type, canonicalName, lat, lng, osmType, osmId, wikidataId] of osmExpected) {
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

test('Timisoara exposes verified Wikidata-backed historic squares', () => {
  for (const [id, type, canonicalName, lat, lng, wikidataId] of wikidataExpected) {
    const entity = getGeoEntity(id);
    assert.ok(entity, `${id} should exist`);
    assert.equal(entity.type, type);
    assert.equal(entity.country, 'RO');
    assert.equal(entity.parentId, 'ro:timisoara');
    assert.equal(entity.canonicalName, canonicalName);
    assert.deepEqual(entity.center, { lat, lng });
    assert.equal(entity.source, 'wikidata');
    assert.equal(entity.wikidataId, wikidataId);
    assert.equal(entity.accuracy, 'poi');
    assert.ok(Number.isFinite(entity.accuracyM));
    assert.equal(entity.osm, undefined);
  }
});

test('Timisoara central landmarks keep unique external identities', () => {
  const osmEntities = osmExpected.map(([id]) => getGeoEntity(id));
  const wikidataEntities = [...osmExpected, ...wikidataExpected].map(([id]) => getGeoEntity(id));
  assert.equal(new Set(osmEntities.map((entity) => `${entity.osm.type}:${entity.osm.id}`)).size, osmEntities.length);
  assert.equal(new Set(wikidataEntities.map((entity) => entity.wikidataId)).size, wikidataEntities.length);
});
