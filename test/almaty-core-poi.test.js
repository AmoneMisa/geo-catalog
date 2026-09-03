import test from 'node:test';
import assert from 'node:assert/strict';
import { KZ_ALMATY_ENTITIES } from '../src/data/kz/almaty/index.js';

const expected = Object.freeze([
  ['kz:almaty:poi:medeu-ice-rink', 'poi.stadium', 'Medeu Ice Rink', 'way', 171504550],
  ['kz:almaty:poi:kok-tobe', 'poi.landmark', 'Kok Tobe', 'node', 1826331904],
  ['kz:almaty:poi:panfilov-park', 'poi.park', 'Park of the 28 Panfilov Guardsmen', 'way', 208493040],
  ['kz:almaty:poi:sayran-bus-terminal', 'poi.bus_station', 'Sayran Bus Terminal', 'way', 159955644],
  ['kz:almaty:poi:almaty-2-railway-station', 'poi.railway_station', 'Almaty-2 Railway Station', 'way', 142743485],
  ['kz:almaty:poi:almaty-international-airport', 'poi.airport', 'Almaty International Airport', 'relation', 3061093],
  ['kz:almaty:poi:central-state-museum', 'poi.museum', 'Central State Museum of Kazakhstan', 'way', 444574821],
  ['kz:almaty:poi:central-park', 'poi.park', 'Central Park', 'way', 232715414],
  ['kz:almaty:poi:ascension-cathedral', 'poi.cathedral', 'Ascension Cathedral', 'way', 50648292],
  ['kz:almaty:poi:almaty-zoo', 'poi.zoo', 'Almaty Zoo', 'way', 222624434],
  ['kz:almaty:poi:green-bazaar', 'poi.market', 'Green Bazaar', 'relation', 20040804],
  ['kz:almaty:poi:palace-of-the-republic', 'poi.cultural_venue', 'Palace of the Republic', 'way', 53280121],
  ['kz:almaty:poi:central-mosque', 'poi.mosque', 'Central Mosque', 'way', 1458254422],
  ['kz:almaty:poi:botanical-garden', 'poi.botanical_garden', 'Almaty Botanical Garden', 'way', 307056816],
  ['kz:almaty:poi:mega-alma-ata', 'poi.shopping_mall', 'MEGA Alma-Ata', 'way', 207798752],
]);

test('Almaty exposes verified core POIs with stable OSM identity', () => {
  for (const [id, type, canonicalName, osmType, osmId] of expected) {
    const entity = KZ_ALMATY_ENTITIES.find((candidate) => candidate.id === id);
    assert.ok(entity, id);
    assert.equal(entity.type, type, id);
    assert.equal(entity.country, 'KZ', id);
    assert.equal(entity.parentId, 'kz:almaty', id);
    assert.equal(entity.canonicalName, canonicalName, id);
    assert.equal(entity.source, 'osm', id);
    assert.deepEqual(entity.osm, { type: osmType, id: osmId }, id);
    assert.ok(Number.isFinite(entity.center?.lat), id);
    assert.ok(Number.isFinite(entity.center?.lng), id);
    assert.ok(Number.isFinite(entity.accuracyM) && entity.accuracyM > 0, id);
  }
});

test('Almaty core POIs do not reuse a physical OSM object', () => {
  const osmKeys = expected.map(([, , , osmType, osmId]) => `${osmType}:${osmId}`);
  assert.equal(new Set(osmKeys).size, osmKeys.length);
});
