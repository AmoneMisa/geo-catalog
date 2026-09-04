import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

test('Bukhara first microdistrict is exposed through the catalog', () => {
  const entity = getGeoEntity('uz:bukhara:microdistrict:1-i-mikroraion');
  assert.ok(entity);
  assert.equal(entity.type, 'microdistrict');
  assert.equal(entity.country, 'UZ');
  assert.equal(entity.canonicalName, '1-й микрорайон');
  assert.equal(entity.parentId, 'uz:bukhara');
  assert.equal(entity.osm?.type, 'node');
  assert.equal(entity.osm?.id, 3593587407);
  assert.ok(Number.isFinite(entity.center.lat));
  assert.ok(Number.isFinite(entity.center.lng));
});
