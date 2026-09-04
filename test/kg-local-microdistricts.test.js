import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const expected = Object.freeze([
  ['kg:osh:microdistrict:anar', 'Anar', 'kg:osh'],
  ['kg:osh:microdistrict:tuleyken', 'Tuleyken', 'kg:osh'],
  ['kg:karakol:microdistrict:voshod', 'Voshod', 'kg:karakol'],
]);

test('verified KG scrape microdistricts are exposed through the catalog', () => {
  for (const [id, canonicalName, parentId] of expected) {
    const entity = getGeoEntity(id);
    assert.ok(entity, `${id} should exist`);
    assert.equal(entity.type, 'microdistrict');
    assert.equal(entity.country, 'KG');
    assert.equal(entity.canonicalName, canonicalName);
    assert.equal(entity.parentId, parentId);
    assert.ok(Number.isFinite(entity.center.lat));
    assert.ok(Number.isFinite(entity.center.lng));
  }
});
