import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const expected = Object.freeze([
  ['kg:osh:microdistrict:anar', 'Anar', 'kg:osh'],
  ['kg:osh:microdistrict:tuleyken', 'Tuleyken', 'kg:osh'],
  ['kg:karakol:microdistrict:voshod', 'Voshod', 'kg:karakol'],
]);

const reviewedBishkek = Object.freeze([
  ['kg:bishkek:microdistrict:dzhal-15', 'Джал-15', 'kg:bishkek:district:leninsky', 156482833],
  ['kg:bishkek:microdistrict:uchkun', 'Учкун', 'kg:bishkek:district:sverdlovsky', 161846744],
  ['kg:bishkek:microdistrict:zhilgorodok-sovmina', 'Жилгородок Совмина', 'kg:bishkek:district:oktyabrsky', 122732980],
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

test('reviewed Bishkek OSM microdistricts keep district parents', () => {
  for (const [id, canonicalName, parentId, osmWayId] of reviewedBishkek) {
    const entity = getGeoEntity(id);
    assert.ok(entity, `${id} should exist`);
    assert.equal(entity.type, 'microdistrict');
    assert.equal(entity.country, 'KG');
    assert.equal(entity.canonicalName, canonicalName);
    assert.equal(entity.parentId, parentId);
    assert.equal(entity.source, 'osm');
    assert.deepEqual(entity.osm, { type: 'way', id: osmWayId });
    assert.ok(Number.isFinite(entity.center.lat));
    assert.ok(Number.isFinite(entity.center.lng));
  }
});
