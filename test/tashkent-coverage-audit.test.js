import test from 'node:test';
import assert from 'node:assert/strict';

import { UZ_TASHKENT_ENTITIES } from '../data-source/uz/tashkent/index.js';
import { validateGeoCatalog } from '../src/validate.js';

const SUPPORTED_SOURCES = new Set(['osm', 'wikidata', 'official', 'manual', 'geonames']);
const SUPPORTED_ACCURACY = new Set([
  'country', 'region', 'city', 'district', 'neighborhood', 'street', 'building', 'poi', 'entrance', 'approximate',
]);

test('every registered Tashkent entity carries usable spatial metadata', () => {
  assert.ok(UZ_TASHKENT_ENTITIES.length > 100, 'Tashkent catalog unexpectedly small');

  for (const entity of UZ_TASHKENT_ENTITIES) {
    assert.match(entity.id, /^uz:tashkent:/u, entity.id);
    assert.equal(entity.country, 'UZ', entity.id);
    assert.ok(entity.parentId, `${entity.id}: parentId`);
    assert.ok(Number.isFinite(entity.center?.lat), `${entity.id}: center.lat`);
    assert.ok(Number.isFinite(entity.center?.lng), `${entity.id}: center.lng`);
    assert.ok(SUPPORTED_SOURCES.has(entity.source), `${entity.id}: source`);
    assert.ok(SUPPORTED_ACCURACY.has(entity.accuracy), `${entity.id}: accuracy`);
    assert.ok(Number.isFinite(entity.accuracyM) && entity.accuracyM > 0, `${entity.id}: accuracyM`);
  }
});

test('the complete Tashkent city slice passes catalog invariants', () => {
  const ids = new Set(UZ_TASHKENT_ENTITIES.map(({ id }) => id));
  const requiredParents = UZ_TASHKENT_ENTITIES
    .filter(({ parentId }) => parentId && !ids.has(parentId))
    .map(({ parentId }) => parentId);

  assert.deepEqual([...new Set(requiredParents)], ['uz:tashkent']);

  const cityParent = {
    id: 'uz:tashkent',
    type: 'city',
    country: 'UZ',
    canonicalName: 'Tashkent',
    center: { lat: 41.311081, lng: 69.240562 },
    source: 'osm',
    accuracy: 'city',
    accuracyM: 16000,
  };
  assert.deepEqual(validateGeoCatalog([cityParent, ...UZ_TASHKENT_ENTITIES]), { valid: true, errors: [] });
});
