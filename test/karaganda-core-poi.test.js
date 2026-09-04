import test from 'node:test';
import assert from 'node:assert/strict';
import { KZ_KARAGANDA_ENTITIES } from '../src/data/kz/karaganda/index.js';

const expected = Object.freeze([
  { id: 'kz:karaganda:poi:karaganda-railway-station', type: 'poi.railway_station', canonicalName: 'Qarağandı Railway Station', source: 'wikidata', wikidataId: 'Q12574833', lat: 49.789722, lng: 73.098056 },
  { id: 'kz:karaganda:poi:miners-palace-of-culture', type: 'poi.cultural_venue', canonicalName: "Miners' Palace of Culture", source: 'wikidata', wikidataId: 'Q1665441', lat: 49.809603, lng: 73.084497 },
  { id: 'kz:karaganda:poi:karagandy-central-park', type: 'poi.park', canonicalName: 'Karagandy Central Park', source: 'wikidata', wikidataId: 'Q65154031', lat: 49.798889, lng: 73.075889 },
  { id: 'kz:karaganda:poi:sary-arka-airport', type: 'poi.airport', canonicalName: 'Sary-Arka Airport', source: 'wikidata', wikidataId: 'Q117807', lat: 49.671667, lng: 73.335278 },
  { id: 'kz:karaganda:poi:karaganda-ecological-museum', type: 'poi.museum', canonicalName: 'Karaganda Ecological Museum', source: 'wikidata', wikidataId: 'Q4213693', lat: 49.806250, lng: 73.084395 },
  { id: 'kz:karaganda:poi:karaganda-circus', type: 'poi.cultural_venue', canonicalName: 'Karaganda Circus', source: 'osm', wikidataId: 'Q205955', lat: 49.800047, lng: 73.084703, osm: { type: 'way', id: 68354306 } },
  { id: 'kz:karaganda:poi:karagandy-arena', type: 'poi.stadium', canonicalName: 'Karagandy Arena', source: 'osm', wikidataId: 'Q4213697', lat: 49.79, lng: 73.14, osm: { type: 'way', id: 215516722 } },
]);

test('Karaganda exposes verified core POIs with stable identities', () => {
  for (const item of expected) {
    const entity = KZ_KARAGANDA_ENTITIES.find((candidate) => candidate.id === item.id);
    assert.ok(entity, item.id);
    assert.equal(entity.type, item.type, item.id);
    assert.equal(entity.country, 'KZ', item.id);
    assert.equal(entity.parentId, 'kz:karaganda', item.id);
    assert.equal(entity.canonicalName, item.canonicalName, item.id);
    assert.equal(entity.source, item.source, item.id);
    assert.equal(entity.wikidataId, item.wikidataId, item.id);
    assert.deepEqual(entity.center, { lat: item.lat, lng: item.lng }, item.id);
    assert.ok(Number.isFinite(entity.accuracyM) && entity.accuracyM > 0, item.id);
    if (item.osm) assert.deepEqual(entity.osm, item.osm, item.id);
  }
});

test('Karaganda core POIs do not reuse Wikidata or OSM identities', () => {
  const wikidataIds = expected.map(({ wikidataId }) => wikidataId);
  assert.equal(new Set(wikidataIds).size, wikidataIds.length);

  const osmIdentities = expected
    .filter(({ osm }) => osm)
    .map(({ osm }) => `${osm.type}:${osm.id}`);
  assert.equal(new Set(osmIdentities).size, osmIdentities.length);
});
