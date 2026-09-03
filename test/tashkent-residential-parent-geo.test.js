import test from 'node:test';
import assert from 'node:assert/strict';

import { GEO_ENTITIES } from '../src/catalog.js';

function byId(id) {
  return GEO_ENTITIES.find((entity) => entity.id === id);
}

test('Assalom Sohil uses its verified Yashnobod parent and representative complex point', () => {
  const entity = byId('uz:tashkent:residential:assalom-sohil');
  assert.ok(entity);
  assert.equal(entity.parentId, 'uz:tashkent:yashnobod');
  assert.deepEqual(entity.center, { lat: 41.282995, lng: 69.30842 });
  assert.equal(entity.accuracyM, 140);
  assert.equal(entity.sourceUrl, 'https://yandex.com/maps/10335/tashkent/geo/4098449809/');
});

test('Infinity remains a separate Yashnobod residential complex', () => {
  const entity = byId('uz:tashkent:residential:infinity');
  assert.ok(entity);
  assert.equal(entity.parentId, 'uz:tashkent:yashnobod');
  assert.deepEqual(entity.center, { lat: 41.3025714, lng: 69.2889718 });
  assert.equal(entity.accuracyM, 220);
  assert.equal(entity.sourceUrl, 'https://gh.uz/infinity-2/');
  assert.notEqual(entity.id, 'uz:tashkent:residential:assalom-sohil');
});
