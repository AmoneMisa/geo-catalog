import test from 'node:test';
import assert from 'node:assert/strict';
import { KZ_AKTOBE_ENTITIES } from '../data-source/kz/aktobe/index.js';

const expected = Object.freeze([
  { id: 'kz:aktobe:poi:aktobe-international-airport', type: 'poi.airport', canonicalName: 'Aktobe International Airport', source: 'osm', wikidataId: 'Q1430836', lat: 50.245, lng: 57.203331, osm: { type: 'way', id: 235315612 } },
  { id: 'kz:aktobe:poi:aktobe-railway-station', type: 'poi.railway_station', canonicalName: 'Aktobé Railway Station', source: 'wikidata', wikidataId: 'Q18920162', lat: 50.283889, lng: 57.214444 },
  { id: 'kz:aktobe:poi:koblandy-batyr-central-stadium', type: 'poi.stadium', canonicalName: 'Koblandy Batyr Central Stadium', source: 'osm', wikidataId: 'Q190784', lat: 50.291389, lng: 57.160306, osm: { type: 'way', id: 307134879 } },
  { id: 'kz:aktobe:poi:nur-ghasyr-mosque', type: 'poi.mosque', canonicalName: 'Nur Ghasyr Mosque', source: 'wikidata', wikidataId: 'Q13668724', lat: 50.281667, lng: 57.188889 },
]);

test('Aktobe exposes verified core POIs with stable identities', () => {
  for (const item of expected) {
    const entity = KZ_AKTOBE_ENTITIES.find((candidate) => candidate.id === item.id);
    assert.ok(entity, item.id);
    assert.equal(entity.type, item.type, item.id);
    assert.equal(entity.country, 'KZ', item.id);
    assert.equal(entity.parentId, 'kz:aktobe', item.id);
    assert.equal(entity.canonicalName, item.canonicalName, item.id);
    assert.equal(entity.source, item.source, item.id);
    assert.equal(entity.wikidataId, item.wikidataId, item.id);
    assert.deepEqual(entity.center, { lat: item.lat, lng: item.lng }, item.id);
    assert.ok(Number.isFinite(entity.accuracyM) && entity.accuracyM > 0, item.id);
    if (item.osm) assert.deepEqual(entity.osm, item.osm, item.id);
  }
});

test('Aktobe core POIs do not reuse Wikidata or OSM identities', () => {
  const wikidataIds = expected.map(({ wikidataId }) => wikidataId);
  assert.equal(new Set(wikidataIds).size, wikidataIds.length);

  const osmIdentities = expected
    .filter(({ osm }) => osm)
    .map(({ osm }) => `${osm.type}:${osm.id}`);
  assert.equal(new Set(osmIdentities).size, osmIdentities.length);
});
