import test from 'node:test';
import assert from 'node:assert/strict';
import { RO_TIMISOARA_ENTITIES } from '../src/data/ro/timisoara/index.js';

const expected = Object.freeze([
  { id: 'ro:timisoara:poi:traian-vuia-international-airport', type: 'poi.airport', canonicalName: 'Aeroportul Internațional Timișoara „Traian Vuia”', source: 'osm', wikidataId: 'Q1417736', lat: 45.81, lng: 21.338055555555556, osm: { type: 'way', id: 197252927 } },
  { id: 'ro:timisoara:poi:timisoara-nord-railway-station', type: 'poi.railway_station', canonicalName: 'Gara Timișoara Nord', source: 'wikidata', wikidataId: 'Q978167', lat: 45.75111111111111, lng: 21.2075 },
  { id: 'ro:timisoara:poi:central-park-anton-scudier', type: 'poi.park', canonicalName: 'Parcul Central „Anton Scudier”', source: 'wikidata', wikidataId: 'Q12737520', lat: 45.75138888888889, lng: 21.220278055555556 },
  { id: 'ro:timisoara:poi:roses-park', type: 'poi.park', canonicalName: 'Parcul Rozelor', source: 'wikidata', wikidataId: 'Q132449', lat: 45.75, lng: 21.23111111111111 },
]);

test('Timișoara exposes verified core POIs with stable identities', () => {
  for (const item of expected) {
    const entity = RO_TIMISOARA_ENTITIES.find((candidate) => candidate.id === item.id);
    assert.ok(entity, item.id);
    assert.equal(entity.type, item.type, item.id);
    assert.equal(entity.country, 'RO', item.id);
    assert.equal(entity.parentId, 'ro:timisoara', item.id);
    assert.equal(entity.canonicalName, item.canonicalName, item.id);
    assert.equal(entity.source, item.source, item.id);
    assert.equal(entity.wikidataId, item.wikidataId, item.id);
    assert.deepEqual(entity.center, { lat: item.lat, lng: item.lng }, item.id);
    assert.ok(Number.isFinite(entity.accuracyM) && entity.accuracyM > 0, item.id);
    if (item.osm) assert.deepEqual(entity.osm, item.osm, item.id);
    else assert.equal(entity.osm, undefined, item.id);
  }
});

test('Timișoara core POIs do not reuse external identities', () => {
  const wikidataIds = expected.map(({ wikidataId }) => wikidataId);
  assert.equal(new Set(wikidataIds).size, wikidataIds.length);

  const osmIdentities = expected.filter(({ osm }) => osm).map(({ osm }) => `${osm.type}:${osm.id}`);
  assert.equal(new Set(osmIdentities).size, osmIdentities.length);
});
