import test from 'node:test';
import assert from 'node:assert/strict';
import { RO_TIMISOARA_ENTITIES } from '../data-source/ro/timisoara/index.js';

const expected = Object.freeze([
  { id: 'ro:timisoara:local-area:cetate', canonicalName: 'Cetate', wikidataId: 'Q18538871', lat: 45.75611111111111, lng: 21.229444444444443 },
  { id: 'ro:timisoara:local-area:fabric', canonicalName: 'Fabric', wikidataId: 'Q726997', lat: 45.75375, lng: 21.227988888888888 },
  { id: 'ro:timisoara:local-area:iosefin', canonicalName: 'Iosefin', wikidataId: 'Q54099162', lat: 45.74444444444445, lng: 21.20888888888889 },
  { id: 'ro:timisoara:local-area:elisabetin', canonicalName: 'Elisabetin', wikidataId: 'Q1330589', lat: 45.74236388888889, lng: 21.22625833333333 },
]);

test('Timișoara exposes verified local areas with stable Wikidata identities', () => {
  for (const item of expected) {
    const entity = RO_TIMISOARA_ENTITIES.find((candidate) => candidate.id === item.id);
    assert.ok(entity, item.id);
    assert.equal(entity.type, 'local_area', item.id);
    assert.equal(entity.country, 'RO', item.id);
    assert.equal(entity.parentId, 'ro:timisoara', item.id);
    assert.equal(entity.canonicalName, item.canonicalName, item.id);
    assert.equal(entity.source, 'wikidata', item.id);
    assert.equal(entity.accuracy, 'neighborhood', item.id);
    assert.equal(entity.wikidataId, item.wikidataId, item.id);
    assert.equal(entity.sourceUrl, `https://www.wikidata.org/wiki/${item.wikidataId}`, item.id);
    assert.deepEqual(entity.center, { lat: item.lat, lng: item.lng }, item.id);
    assert.ok(Number.isFinite(entity.accuracyM) && entity.accuracyM > 0, item.id);
  }
});

test('Timișoara local areas do not reuse Wikidata identities', () => {
  const wikidataIds = expected.map(({ wikidataId }) => wikidataId);
  assert.equal(new Set(wikidataIds).size, wikidataIds.length);
});
