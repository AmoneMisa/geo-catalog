import test from 'node:test';
import assert from 'node:assert/strict';
import { KZ_SHYMKENT_ENTITIES } from '../src/data/kz/shymkent/index.js';

const expected = Object.freeze([
  ['kz:shymkent:poi:shymkent-zoo', 'poi.zoo', 'Shymkent Zoo', 'way', 164667870],
  ['kz:shymkent:poi:shymkent-international-airport', 'poi.airport', 'Shymkent International Airport', 'way', 112117550],
  ['kz:shymkent:poi:shymkent-railway-station', 'poi.railway_station', 'Shymkent Railway Station', 'node', 2753413127],
]);

test('Shymkent exposes verified core POIs with stable OSM identity', () => {
  for (const [id, type, canonicalName, osmType, osmId] of expected) {
    const entity = KZ_SHYMKENT_ENTITIES.find((candidate) => candidate.id === id);
    assert.ok(entity, id);
    assert.equal(entity.type, type, id);
    assert.equal(entity.country, 'KZ', id);
    assert.equal(entity.parentId, 'kz:shymkent', id);
    assert.equal(entity.canonicalName, canonicalName, id);
    assert.equal(entity.source, 'osm', id);
    assert.deepEqual(entity.osm, { type: osmType, id: osmId }, id);
    assert.ok(Number.isFinite(entity.center?.lat), id);
    assert.ok(Number.isFinite(entity.center?.lng), id);
    assert.ok(Number.isFinite(entity.accuracyM) && entity.accuracyM > 0, id);
  }
});

test('Shymkent core POIs do not reuse a physical OSM object', () => {
  const osmKeys = expected.map(([, , , osmType, osmId]) => `${osmType}:${osmId}`);
  assert.equal(new Set(osmKeys).size, osmKeys.length);
});
