import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const expected = Object.freeze([
  ['kg:bishkek:residential:senator', 'Senator'],
  ['kg:bishkek:residential:muras-nuru', 'Muras Nuru'],
  ['kg:bishkek:residential:mansara', 'Mansara'],
  ['kg:bishkek:residential:regency', 'Regency'],
  ['kg:bishkek:residential:ilim-plus', 'Илим Плюс'],
  ['kg:bishkek:residential:akademiya', 'Академия'],
  ['kg:bishkek:residential:eliseiskie-polya', 'Елисейские поля'],
  ['kg:bishkek:residential:tianshan-1', 'TIANSHAN-1'],
]);

test('Bishkek residential enrichment exposes verified spatial anchors', () => {
  for (const [id, canonicalName] of expected) {
    const entity = getGeoEntity(id);
    assert.ok(entity, `${id} should exist`);
    assert.equal(entity.type, 'residential_complex');
    assert.equal(entity.country, 'KG');
    assert.equal(entity.parentId, 'kg:bishkek');
    assert.equal(entity.canonicalName, canonicalName);
    assert.ok(Number.isFinite(entity.center?.lat));
    assert.ok(Number.isFinite(entity.center?.lng));
    assert.notEqual(entity.center.lat, 0);
    assert.notEqual(entity.center.lng, 0);
    assert.ok(entity.sourceUrl);
  }
});

test('Tianshan-1 and Tyan-Shan remain separate geo identities', () => {
  const newer = getGeoEntity('kg:bishkek:residential:tianshan-1');
  const existing = getGeoEntity('kg:bishkek:residential:tyan-shan');
  assert.ok(newer);
  assert.ok(existing);
  assert.notEqual(newer.id, existing.id);
  assert.notDeepEqual(newer.center, existing.center);
});
