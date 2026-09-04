import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const expected = [
  'kg:bishkek:residential:senator',
  'kg:bishkek:residential:muras-nuru',
  'kg:bishkek:residential:mansara',
  'kg:bishkek:residential:regency',
  'kg:bishkek:residential:ilim-plus',
  'kg:bishkek:residential:akademiya',
  'kg:bishkek:residential:eliseiskie-polya',
  'kg:bishkek:residential:tianshan-1',
  'kg:bishkek:residential:anka-tower',
  'kg:bishkek:residential:urpak',
];

test('Bishkek verified residential complexes expose canonical coordinates', () => {
  for (const id of expected) {
    const entity = getGeoEntity(id);
    assert.ok(entity, `${id} should exist`);
    assert.equal(entity.type, 'residential_complex');
    assert.equal(entity.country, 'KG');
    assert.equal(entity.parentId, 'kg:bishkek');
    assert.ok(Number.isFinite(entity.center?.lat), `${id} lat`);
    assert.ok(Number.isFinite(entity.center?.lng), `${id} lng`);
    assert.notEqual(entity.center.lat, 0);
    assert.notEqual(entity.center.lng, 0);
    assert.ok(entity.sourceUrl, `${id} sourceUrl`);
  }
});

test('out-of-city Chaika Resort is not owned by Bishkek catalog', () => {
  assert.equal(getGeoEntity('kg:bishkek:residential:chaika-resort'), null);
});
