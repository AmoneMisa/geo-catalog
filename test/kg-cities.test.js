import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const cities = Object.freeze([
  ['kg:bishkek', 'Bishkek'],
  ['kg:osh', 'Osh'],
  ['kg:jalal-abad', 'Jalal-Abad'],
  ['kg:karakol', 'Karakol'],
  ['kg:tokmok', 'Tokmok'],
  ['kg:naryn', 'Naryn'],
  ['kg:talas', 'Talas'],
  ['kg:batken', 'Batken'],
  ['kg:kara-balta', 'Kara-Balta'],
  ['kg:balykchy', 'Balykchy'],
  ['kg:kant', 'Kant'],
  ['kg:uzgen', 'Uzgen'],
  ['kg:kyzyl-kiya', 'Kyzyl-Kiya'],
]);

for (const [id, canonicalName] of cities) {
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
