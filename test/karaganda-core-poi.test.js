import test from 'node:test';
import assert from 'node:assert/strict';
import { KZ_KARAGANDA_ENTITIES } from '../src/data/kz/karaganda/index.js';

const expected = Object.freeze([
  ['kz:karaganda:poi:karaganda-railway-station', 'poi.railway_station', 'Qarağandı Railway Station', 'Q12574833', 49.789722, 73.098056],
  ['kz:karaganda:poi:miners-palace-of-culture', 'poi.cultural_venue', "Miners' Palace of Culture", 'Q1665441', 49.809603, 73.084497],
  ['kz:karaganda:poi:karagandy-central-park', 'poi.park', 'Karagandy Central Park', 'Q65154031', 49.798889, 73.075889],
  ['kz:karaganda:poi:sary-arka-airport', 'poi.airport', 'Sary-Arka Airport', 'Q117807', 49.671667, 73.335278],
]);

test('Karaganda exposes verified core POIs with stable Wikidata identity', () => {
  for (const [id, type, canonicalName, wikidataId, lat, lng] of expected) {
    const entity = KZ_KARAGANDA_ENTITIES.find((candidate) => candidate.id === id);
    assert.ok(entity, id);
    assert.equal(entity.type, type, id);
    assert.equal(entity.country, 'KZ', id);
    assert.equal(entity.parentId, 'kz:karaganda', id);
    assert.equal(entity.canonicalName, canonicalName, id);
    assert.equal(entity.source, 'wikidata', id);
    assert.equal(entity.wikidataId, wikidataId, id);
    assert.deepEqual(entity.center, { lat, lng }, id);
    assert.ok(Number.isFinite(entity.accuracyM) && entity.accuracyM > 0, id);
  }
});

test('Karaganda core POIs do not reuse Wikidata identities', () => {
  const wikidataIds = expected.map(([, , , wikidataId]) => wikidataId);
  assert.equal(new Set(wikidataIds).size, wikidataIds.length);
});
