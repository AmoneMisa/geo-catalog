import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const expected = Object.freeze([
  ['kz:aktobe:microdistrict:1-i-mikroraion', 'microdistrict', '1-й микрорайон', 'kz:aktobe'],
  ['kz:aktobe:microdistrict:3-i-mikroraion', 'microdistrict', '3-й микрорайон', 'kz:aktobe'],
  ['kz:aktobe:microdistrict:8-i-mikroraion', 'microdistrict', '8-й микрорайон', 'kz:aktobe'],
  ['kz:almaty:residential:terracotta', 'residential_complex', 'Terracotta', 'kz:almaty'],
  ['kz:karaganda:microdistrict:16-i-mikroraion', 'microdistrict', '16-й микрорайон', 'kz:karaganda'],
  ['kz:karaganda:residential:trilistnik', 'residential_complex', 'Трилистник', 'kz:karaganda'],
  ['kz:shymkent:microdistrict:8-i-mikroraion', 'microdistrict', '8-й микрорайон', 'kz:shymkent'],
  ['kz:shymkent:microdistrict:15-i-mikroraion', 'microdistrict', '15-й микрорайон', 'kz:shymkent'],
  ['kz:shymkent:microdistrict:nursat', 'microdistrict', 'Нурсат', 'kz:shymkent'],
  ['kz:taraz:microdistrict:uly-dala', 'microdistrict', 'Улы Дала', 'kz:taraz'],
]);

test('verified Kazakhstan local geography is exposed through the catalog', () => {
  for (const [id, type, canonicalName, parentId] of expected) {
    const entity = getGeoEntity(id);
    assert.ok(entity, `${id} should exist`);
    assert.equal(entity.type, type);
    assert.equal(entity.country, 'KZ');
    assert.equal(entity.canonicalName, canonicalName);
    assert.equal(entity.parentId, parentId);
    assert.ok(Number.isFinite(entity.center.lat));
    assert.ok(Number.isFinite(entity.center.lng));
  }
});

test('renamed Tashkent citywide residential entities stay catalog-visible', () => {
  for (const id of [
    'uz:tashkent:residential:eco-dream',
    'uz:tashkent:residential:bobur-residence',
    'uz:tashkent:residential:turkiston',
  ]) {
    assert.ok(getGeoEntity(id), `${id} should remain available`);
  }
});
