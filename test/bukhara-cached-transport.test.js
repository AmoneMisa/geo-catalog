import test from 'node:test';
import assert from 'node:assert/strict';

import { BUKHARA_ENTITIES } from '../data-source/uz/cities/bukhara.js';

test('reviewed cached Bukhara transport terminals and parking are canonical city POIs', () => {
  const transport = BUKHARA_ENTITIES.filter((entity) => entity.parentId === 'uz:bukhara'
    && ['poi.railway_station', 'poi.bus_station', 'poi.parking'].includes(entity.type));
  for (const [name, type, osm] of [
    ['Bukhara-2', 'poi.railway_station', 'node:1588259351'],
    ['North Bus Station', 'poi.bus_station', 'way:165720933'],
    ['Tashkent–Samarkand Bus Station', 'poi.bus_station', 'node:6486363086'],
    ['TIR Parking', 'poi.parking', 'way:875475222'],
  ]) {
    const entity = transport.find((item) => item.canonicalName === name);
    assert.ok(entity, name);
    assert.equal(entity.type, type, name);
    assert.equal(`${entity.osm.type}:${entity.osm.id}`, osm, name);
  }
});
