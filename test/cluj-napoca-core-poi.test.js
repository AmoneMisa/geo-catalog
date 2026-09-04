import test from 'node:test';
import assert from 'node:assert/strict';
import { RO_CLUJ_NAPOCA_ENTITIES } from '../src/data/ro/cluj-napoca/index.js';

const expected = Object.freeze([
  { id: 'ro:cluj-napoca:poi:avram-iancu-international-airport', type: 'poi.airport', canonicalName: 'Aeroportul Internațional „Avram Iancu” Cluj', wikidataId: 'Q1068685', lat: 46.785091666666666, lng: 23.686119444444444, osm: { type: 'way', id: 84575461 } },
  { id: 'ro:cluj-napoca:poi:cluj-napoca-railway-station', type: 'poi.railway_station', canonicalName: 'Cluj-Napoca Railway Station', wikidataId: 'Q59615300', lat: 46.78463, lng: 23.58617, osm: { type: 'node', id: 258987961 } },
  { id: 'ro:cluj-napoca:poi:central-park-simion-barnutiu', type: 'poi.park', canonicalName: 'Parcul Central Simion Bărnuțiu', wikidataId: 'Q715958', lat: 46.76989, lng: 23.57909, osm: { type: 'way', id: 23893331 } },
]);

test('Cluj-Napoca exposes verified core POIs with stable identities', () => {
  for (const item of expected) {
    const entity = RO_CLUJ_NAPOCA_ENTITIES.find((candidate) => candidate.id === item.id);
    assert.ok(entity, item.id);
    assert.equal(entity.type, item.type, item.id);
    assert.equal(entity.country, 'RO', item.id);
    assert.equal(entity.parentId, 'ro:cluj-napoca', item.id);
    assert.equal(entity.canonicalName, item.canonicalName, item.id);
    assert.equal(entity.source, 'osm', item.id);
    assert.equal(entity.wikidataId, item.wikidataId, item.id);
    assert.deepEqual(entity.center, { lat: item.lat, lng: item.lng }, item.id);
    assert.deepEqual(entity.osm, item.osm, item.id);
    assert.ok(Number.isFinite(entity.accuracyM) && entity.accuracyM > 0, item.id);
  }
});

test('Cluj-Napoca core POIs do not reuse Wikidata or OSM identities', () => {
  const wikidataIds = expected.map(({ wikidataId }) => wikidataId);
  assert.equal(new Set(wikidataIds).size, wikidataIds.length);

  const osmIdentities = expected.map(({ osm }) => `${osm.type}:${osm.id}`);
  assert.equal(new Set(osmIdentities).size, osmIdentities.length);
});
