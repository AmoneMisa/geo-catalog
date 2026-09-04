import test from 'node:test';
import assert from 'node:assert/strict';
import { UZ_SAMARKAND_ENTITIES } from '../src/data/uz/samarkand/index.js';

const expectedHeritagePoi = Object.freeze([
  { id: 'uz:samarkand:poi:ulugh-beg-madrasa', type: 'poi.madrasa', canonicalName: 'Ulugh Beg Madrasa', wikidataId: 'Q492144', lat: 39.654722, lng: 66.974672, source: 'wikidata' },
  { id: 'uz:samarkand:poi:sherdar-madrasa', type: 'poi.madrasa', canonicalName: 'Sherdar Madrasa', wikidataId: 'Q2278212', lat: 39.654883, lng: 66.976336, source: 'wikidata' },
  { id: 'uz:samarkand:poi:tilakari-madrasa', type: 'poi.madrasa', canonicalName: 'Tilakari Madrasa', wikidataId: 'Q1713936', lat: 39.655758, lng: 66.975086, source: 'wikidata', osm: { type: 'relation', id: 2437664 } },
  { id: 'uz:samarkand:poi:hazrat-hyzr-mosque', type: 'poi.mosque', canonicalName: 'Hazrat-Hyzr Mosque', wikidataId: 'Q4292369', lat: 39.663453, lng: 66.983256, source: 'wikidata' },
  { id: 'uz:samarkand:poi:rukhabad-mausoleum', type: 'poi.mausoleum', canonicalName: 'Rukhabad Mausoleum', wikidataId: 'Q4273779', lat: 39.650861, lng: 66.968208, source: 'wikidata' },
  { id: 'uz:samarkand:poi:aksaray-mausoleum', type: 'poi.mausoleum', canonicalName: 'Aksaray Mausoleum', wikidataId: 'Q4273747', lat: 39.647969, lng: 66.969997, source: 'wikidata' },
  { id: 'uz:samarkand:poi:afrasiab-museum', type: 'poi.museum', canonicalName: 'Afrasiab Museum of Samarkand', wikidataId: 'Q4306302', lat: 39.669339, lng: 66.993350, source: 'wikidata', osm: { type: 'relation', id: 2554586 } },
]);

test('Samarkand exposes verified heritage POIs with stable identities', () => {
  for (const item of expectedHeritagePoi) {
    const entity = UZ_SAMARKAND_ENTITIES.find((candidate) => candidate.id === item.id);
    assert.ok(entity, item.id);
    assert.equal(entity.type, item.type, item.id);
    assert.equal(entity.country, 'UZ', item.id);
    assert.equal(entity.parentId, 'uz:samarkand', item.id);
    assert.equal(entity.canonicalName, item.canonicalName, item.id);
    assert.equal(entity.source, item.source, item.id);
    assert.equal(entity.wikidataId, item.wikidataId, item.id);
    assert.deepEqual(entity.center, { lat: item.lat, lng: item.lng }, item.id);
    if (item.osm) assert.deepEqual(entity.osm, item.osm, item.id);
    assert.ok(Number.isFinite(entity.accuracyM) && entity.accuracyM > 0, item.id);
  }
});

test('Samarkand does not reuse catalog or external identities', () => {
  const ids = UZ_SAMARKAND_ENTITIES.map(({ id }) => id);
  assert.equal(new Set(ids).size, ids.length);

  const wikidataIds = UZ_SAMARKAND_ENTITIES
    .filter(({ wikidataId }) => wikidataId)
    .map(({ wikidataId }) => wikidataId);
  assert.equal(new Set(wikidataIds).size, wikidataIds.length);

  const osmIdentities = UZ_SAMARKAND_ENTITIES
    .filter(({ osm }) => osm)
    .map(({ osm }) => `${osm.type}:${osm.id}`);
  assert.equal(new Set(osmIdentities).size, osmIdentities.length);
});

test('Samarkand city coverage does not fabricate administrative districts', () => {
  // Current city administration profile enumerates 215 mahallas and three urban-type
  // settlements, but no city-level districts: https://gov.uz/oz/samshahar/sections/view/71776
  const districts = UZ_SAMARKAND_ENTITIES.filter(({ type }) => type === 'district');
  assert.deepEqual(districts, []);
});
