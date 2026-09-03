import test from 'node:test';
import assert from 'node:assert/strict';
import { KZ_ASTANA_ENTITIES } from '../src/data/kz/astana/index.js';

const expected = Object.freeze([
  ['kz:astana:poi:bayterek', 'poi.monument', 'Bayterek', 'way', 230401645],
  ['kz:astana:poi:national-museum', 'poi.museum', 'National Museum of the Republic of Kazakhstan', 'node', 4894937300],
  ['kz:astana:poi:khan-shatyr', 'poi.shopping_mall', 'Khan Shatyr', 'way', 460703779],
  ['kz:astana:poi:palace-of-peace-and-reconciliation', 'poi.cultural_venue', 'Palace of Peace and Reconciliation', 'node', 5130027840],
  ['kz:astana:poi:astana-nurly-zhol-station', 'poi.railway_station', 'Astana-Nurly Zhol Railway Station', 'way', 424980293],
  ['kz:astana:poi:astana-international-airport', 'poi.airport', 'Astana International Airport', 'way', 507841374],
]);

test('Astana exposes verified core POIs with stable OSM identity', () => {
  for (const [id, type, canonicalName, osmType, osmId] of expected) {
    const entity = KZ_ASTANA_ENTITIES.find((candidate) => candidate.id === id);
    assert.ok(entity, id);
    assert.equal(entity.type, type, id);
    assert.equal(entity.country, 'KZ', id);
    assert.equal(entity.parentId, 'kz:astana', id);
    assert.equal(entity.canonicalName, canonicalName, id);
    assert.equal(entity.source, 'osm', id);
    assert.deepEqual(entity.osm, { type: osmType, id: osmId }, id);
    assert.ok(Number.isFinite(entity.center?.lat), id);
    assert.ok(Number.isFinite(entity.center?.lng), id);
    assert.ok(Number.isFinite(entity.accuracyM) && entity.accuracyM > 0, id);
  }
});

test('Astana core POIs do not reuse a physical OSM object', () => {
  const osmKeys = expected.map(([, , , osmType, osmId]) => `${osmType}:${osmId}`);
  assert.equal(new Set(osmKeys).size, osmKeys.length);
});
