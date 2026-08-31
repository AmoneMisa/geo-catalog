import test from 'node:test';
import assert from 'node:assert/strict';

import {
  GEO_ENTITIES,
  getGeoChildren,
  getGeoDescendants,
  getGeoEntity,
} from '../src/index.js';

function isDescendantOf(entity, ancestorId) {
  const seen = new Set();
  let parentId = entity.parentId;
  while (parentId && !seen.has(parentId)) {
    if (parentId === ancestorId) return true;
    seen.add(parentId);
    parentId = getGeoEntity(parentId)?.parentId;
  }
  return false;
}

test('getGeoChildren returns only direct children', () => {
  const parent = GEO_ENTITIES.find((entity) => GEO_ENTITIES.some((candidate) => candidate.parentId === entity.id));
  assert.ok(parent, 'catalog should contain at least one parent entity');

  const children = getGeoChildren(parent.id);
  assert.ok(children.length > 0);
  assert.ok(children.every((entity) => entity.parentId === parent.id));
});

test('getGeoDescendants traverses hierarchy without relying on id prefixes', () => {
  const parent = GEO_ENTITIES.find((entity) => {
    const direct = GEO_ENTITIES.filter((candidate) => candidate.parentId === entity.id);
    return direct.some((child) => GEO_ENTITIES.some((candidate) => candidate.parentId === child.id));
  });
  assert.ok(parent, 'catalog should contain at least one hierarchy with grandchildren');

  const descendants = getGeoDescendants(parent.id);
  const expectedIds = GEO_ENTITIES
    .filter((entity) => isDescendantOf(entity, parent.id))
    .map((entity) => entity.id)
    .sort();

  assert.deepEqual(descendants.map((entity) => entity.id).sort(), expectedIds);
  assert.ok(descendants.some((entity) => entity.parentId !== parent.id), 'expected at least one non-direct descendant');
});

test('getGeoDescendants filters returned entities while still traversing intermediate parents', () => {
  const parent = GEO_ENTITIES.find((entity) => {
    const descendantTypes = new Set(
      GEO_ENTITIES.filter((candidate) => isDescendantOf(candidate, entity.id)).map((candidate) => candidate.type),
    );
    return descendantTypes.size > 1;
  });
  assert.ok(parent, 'catalog should contain a hierarchy with more than one descendant type');

  const all = getGeoDescendants(parent.id);
  const targetType = all.find((entity) => entity.type !== all[0]?.type)?.type ?? all[0]?.type;
  assert.ok(targetType);

  const filtered = getGeoDescendants(parent.id, { type: targetType });
  assert.ok(filtered.length > 0);
  assert.ok(filtered.every((entity) => entity.type === targetType || (targetType === 'poi' && entity.type.startsWith('poi.'))));

  const expectedIds = all.filter((entity) => entity.type === targetType).map((entity) => entity.id).sort();
  assert.deepEqual(filtered.map((entity) => entity.id).sort(), expectedIds);
});
