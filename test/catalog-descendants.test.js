import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoDescendants, getGeoEntity } from '../src/index.js';

test('catalog descendants traverse through intermediate parents', () => {
  const descendants = getGeoDescendants('uz:tashkent');
  assert.ok(descendants.length > 12);
  assert.ok(descendants.some((entity) => entity.type === 'district'));
  assert.ok(descendants.some((entity) => entity.type === 'microdistrict'));
  assert.ok(descendants.every((entity) => entity.id !== 'uz:tashkent'));
});

test('catalog descendants filter result types without blocking traversal', () => {
  const areas = getGeoDescendants('uz:tashkent', { country: 'UZ', type: 'local_area' });
  assert.ok(areas.length > 0);
  assert.ok(areas.every((entity) => entity.country === 'UZ' && entity.type === 'local_area'));

  for (const entity of areas) {
    let current = entity;
    let foundCity = false;
    while (current?.parentId) {
      if (current.parentId === 'uz:tashkent') {
        foundCity = true;
        break;
      }
      current = getGeoEntity(current.parentId);
    }
    assert.equal(foundCity, true, entity.id);
  }
});

test('catalog descendants preserve canonical catalog order', () => {
  const descendants = getGeoDescendants('uz:tashkent', { type: 'district' });
  const ids = descendants.map((entity) => entity.id);
  assert.deepEqual(ids, [...ids].sort((a, b) => {
    const expectedOrder = getGeoDescendants('uz:tashkent').map((entity) => entity.id);
    return expectedOrder.indexOf(a) - expectedOrder.indexOf(b);
  }));
});
