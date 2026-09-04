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

const reviewed = Object.freeze([
  ['kg:bishkek:residential:akkula', 'ЖК «Аккула»', 'kg:bishkek:district:leninsky', 1462256028],
  ['kg:bishkek:residential:altyn-bulak', 'ЖК «Алтын Булак»', 'kg:bishkek:district:leninsky', 321495846],
  ['kg:bishkek:residential:botanicheskiy-sad', 'ЖК «Ботанический сад»', 'kg:bishkek:district:pervomaisky', 1049851520],
  ['kg:bishkek:residential:flagman', 'Жилой комплекс "Флагман"', 'kg:bishkek:district:oktyabrsky', 48997060],
  ['kg:bishkek:residential:khan-tengiri', 'ЖК "Хан-Теңири"', 'kg:bishkek:district:oktyabrsky', 1396676940],
  ['kg:bishkek:residential:kudaybergen', 'ЖК «Кудайберген»', 'kg:bishkek:district:pervomaisky', 357399246],
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

test('reviewed Bishkek OSM residential complexes keep district parents', () => {
  for (const [id, canonicalName, parentId, osmWayId] of reviewed) {
    const entity = getGeoEntity(id);
    assert.ok(entity, `${id} should exist`);
    assert.equal(entity.type, 'residential_complex');
    assert.equal(entity.country, 'KG');
    assert.equal(entity.canonicalName, canonicalName);
    assert.equal(entity.parentId, parentId);
    assert.equal(entity.source, 'osm');
    assert.deepEqual(entity.osm, { type: 'way', id: osmWayId });
    assert.ok(Number.isFinite(entity.center?.lat));
    assert.ok(Number.isFinite(entity.center?.lng));
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
