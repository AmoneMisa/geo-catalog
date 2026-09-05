import test from 'node:test';
import assert from 'node:assert/strict';
import { RO_CLUJ_NAPOCA_ENTITIES } from '../data-source/ro/cluj-napoca/index.js';

const expected = Object.freeze([
  { id: 'ro:cluj-napoca:local-area:manastur', canonicalName: 'Mănăștur', wikidataId: 'Q368523', lat: 46.7558861, lng: 23.5521778 },
  { id: 'ro:cluj-napoca:local-area:marasti', canonicalName: 'Mărăști', wikidataId: 'Q281611', lat: 46.78131963055556, lng: 23.61266485 },
  { id: 'ro:cluj-napoca:local-area:gheorgheni', canonicalName: 'Gheorgheni', wikidataId: 'Q590050', lat: 46.765, lng: 23.61861111111111 },
  { id: 'ro:cluj-napoca:local-area:grigorescu', canonicalName: 'Grigorescu', wikidataId: 'Q715962', lat: 46.77017, lng: 23.5624 },
  { id: 'ro:cluj-napoca:local-area:zorilor', canonicalName: 'Zorilor', wikidataId: 'Q1032736', lat: 46.75361111111111, lng: 23.586666666666666 },
  { id: 'ro:cluj-napoca:local-area:gruia', canonicalName: 'Gruia', wikidataId: 'Q3118185', lat: 46.77780555555556, lng: 23.57611111111111 },
  { id: 'ro:cluj-napoca:local-area:andrei-muresanu', canonicalName: 'Andrei Mureșanu', wikidataId: 'Q2846500', lat: 46.76164194444444, lng: 23.601346944444443 },
]);

test('Cluj-Napoca exposes verified local areas with stable Wikidata identities', () => {
  for (const item of expected) {
    const entity = RO_CLUJ_NAPOCA_ENTITIES.find((candidate) => candidate.id === item.id);
    assert.ok(entity, item.id);
    assert.equal(entity.type, 'local_area', item.id);
    assert.equal(entity.country, 'RO', item.id);
    assert.equal(entity.parentId, 'ro:cluj-napoca', item.id);
    assert.equal(entity.canonicalName, item.canonicalName, item.id);
    assert.equal(entity.source, 'wikidata', item.id);
    assert.equal(entity.accuracy, 'neighborhood', item.id);
    assert.equal(entity.wikidataId, item.wikidataId, item.id);
    assert.equal(entity.sourceUrl, `https://www.wikidata.org/wiki/${item.wikidataId}`, item.id);
    assert.deepEqual(entity.center, { lat: item.lat, lng: item.lng }, item.id);
    assert.ok(Number.isFinite(entity.accuracyM) && entity.accuracyM > 0, item.id);
  }
});

test('Cluj-Napoca local areas do not reuse Wikidata identities', () => {
  const wikidataIds = expected.map(({ wikidataId }) => wikidataId);
  assert.equal(new Set(wikidataIds).size, wikidataIds.length);
});
