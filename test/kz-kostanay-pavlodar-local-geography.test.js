import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const expected = Object.freeze([
  ['kz:kostanay:microdistrict:3-i-mikroraion', 'microdistrict', '3-й микрорайон', 'kz:kostanay'],
  ['kz:kostanay:microdistrict:5-i-mikroraion', 'microdistrict', '5-й микрорайон', 'kz:kostanay'],
  ['kz:kostanay:microdistrict:9-i-mikroraion', 'microdistrict', '9-й микрорайон', 'kz:kostanay'],
  ['kz:kostanay:microdistrict:nauryz', 'microdistrict', 'Наурыз', 'kz:kostanay'],
  ['kz:kostanay:microdistrict:bereke', 'microdistrict', 'Береке', 'kz:kostanay'],
  ['kz:kostanay:residential:altyn-arman', 'residential_complex', 'Алтын Арман', 'kz:kostanay'],
  ['kz:pavlodar:microdistrict:dachnyi', 'microdistrict', 'Дачный', 'kz:pavlodar'],
  ['kz:pavlodar:microdistrict:saryarka', 'microdistrict', 'Сарыарка', 'kz:pavlodar'],
  ['kz:pavlodar:microdistrict:usolskii', 'microdistrict', 'Усольский', 'kz:pavlodar'],
]);

test('Kostanay and Pavlodar local geography is exposed through the catalog', () => {
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
