import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

for (const [id, canonicalName] of [
  ['kg:bishkek', 'Bishkek'],
  ['kg:osh', 'Osh'],
  ['kg:karakol', 'Karakol'],
]) {
  test(`${canonicalName} has a canonical KG city anchor`, () => {
    const entity = getGeoEntity(id);
    assert.ok(entity);
    assert.equal(entity.country, 'KG');
    assert.equal(entity.type, 'city');
    assert.equal(entity.canonicalName, canonicalName);
    assert.ok(Number.isFinite(entity.center.lat));
    assert.ok(Number.isFinite(entity.center.lng));
  });
}
