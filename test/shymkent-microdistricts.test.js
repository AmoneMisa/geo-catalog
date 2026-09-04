import test from 'node:test';
import assert from 'node:assert/strict';
import { KZ_SHYMKENT_ENTITIES } from '../src/data/kz/shymkent/index.js';

const expected = Object.freeze([
  ['kz:shymkent:microdistrict:qaytpas-1', 'Қайтпас-1', 42.37547, 69.6422],
  ['kz:shymkent:microdistrict:samal-3', 'Самал-3', 42.373844, 69.552762],
  ['kz:shymkent:microdistrict:asar', 'Асар', 42.406733, 69.59898],
]);

test('Shymkent exposes verified microdistricts with representative centers', () => {
  for (const [id, canonicalName, lat, lng] of expected) {
    const entity = KZ_SHYMKENT_ENTITIES.find((candidate) => candidate.id === id);
    assert.ok(entity, id);
    assert.equal(entity.type, 'microdistrict', id);
    assert.equal(entity.country, 'KZ', id);
    assert.equal(entity.parentId, 'kz:shymkent', id);
    assert.equal(entity.canonicalName, canonicalName, id);
    assert.equal(entity.source, 'manual', id);
    assert.equal(entity.accuracy, 'neighborhood', id);
    assert.equal(entity.center.lat, lat, id);
    assert.equal(entity.center.lng, lng, id);
    assert.ok(entity.sourceUrl, id);
    assert.ok(Number.isFinite(entity.accuracyM) && entity.accuracyM > 0, id);
  }
});

test('Shymkent microdistricts keep unique ids and representative centers', () => {
  const ids = expected.map(([id]) => id);
  const centers = expected.map(([, , lat, lng]) => `${lat}:${lng}`);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(centers).size, centers.length);
});

test('Qaytpas-1 keeps its confirmed OSM locality identity', () => {
  const entity = KZ_SHYMKENT_ENTITIES.find((candidate) => candidate.id === 'kz:shymkent:microdistrict:qaytpas-1');
  assert.deepEqual(entity?.osm, { type: 'node', id: 1496101427 });
});
