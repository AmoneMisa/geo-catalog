import test from 'node:test';
import assert from 'node:assert/strict';
import { KZ_TARAZ_ENTITIES } from '../src/data/kz/taraz/index.js';

const expected = Object.freeze([
  { id: 'kz:taraz:poi:taraz-airport', type: 'poi.airport', canonicalName: 'Taraz Airport', wikidataId: 'Q1433007', lat: 42.853611, lng: 71.303611 },
  { id: 'kz:taraz:poi:taraz-railway-station', type: 'poi.railway_station', canonicalName: 'Taraz Railway Station', wikidataId: 'Q97547455', lat: 42.87, lng: 71.378889 },
  { id: 'kz:taraz:poi:karakhan-mausoleum', type: 'poi.landmark', canonicalName: 'Karakhan Mausoleum', wikidataId: 'Q4273770', lat: 42.900617, lng: 71.38734 },
]);

test('Taraz exposes verified core POIs with stable Wikidata identities', () => {
  for (const item of expected) {
    const entity = KZ_TARAZ_ENTITIES.find((candidate) => candidate.id === item.id);
    assert.ok(entity, item.id);
    assert.equal(entity.type, item.type, item.id);
    assert.equal(entity.country, 'KZ', item.id);
    assert.equal(entity.parentId, 'kz:taraz', item.id);
    assert.equal(entity.canonicalName, item.canonicalName, item.id);
    assert.equal(entity.source, 'wikidata', item.id);
    assert.equal(entity.wikidataId, item.wikidataId, item.id);
    assert.deepEqual(entity.center, { lat: item.lat, lng: item.lng }, item.id);
    assert.ok(Number.isFinite(entity.accuracyM) && entity.accuracyM > 0, item.id);
  }
});

test('Taraz core POIs do not reuse Wikidata identities', () => {
  const wikidataIds = expected.map(({ wikidataId }) => wikidataId);
  assert.equal(new Set(wikidataIds).size, wikidataIds.length);
});
