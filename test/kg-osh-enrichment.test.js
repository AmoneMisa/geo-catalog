import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const expected = Object.freeze([
  ['kg:osh:settlement:kenesh', 'settlement', 'Кеңеш'],
  ['kg:osh:settlement:kerme-too', 'settlement', 'Керме-Тоо'],
  ['kg:osh:settlement:ozgur', 'settlement', 'Озгур'],
  ['kg:osh:settlement:orke', 'settlement', 'Орке'],
  ['kg:osh:settlement:pyatiletka', 'settlement', 'Пятилетка'],
  ['kg:osh:settlement:teeke', 'settlement', 'Тээке'],
  ['kg:osh:settlement:uchar', 'settlement', 'Учар'],
  ['kg:osh:settlement:ak-buura-2', 'settlement', 'Ак-Буура-2'],
  ['kg:osh:settlement:ak-buura-3', 'settlement', 'Ак-Буура-3'],
  ['kg:osh:residential:asman-residence-1', 'residential_complex', 'Asman Residence 1'],
  ['kg:osh:residential:mon-paris', 'residential_complex', 'Mon Paris'],
]);

test('Osh enrichment exposes verified city-administered settlements and housing', () => {
  for (const [id, type, canonicalName] of expected) {
    const entity = getGeoEntity(id);
    assert.ok(entity, `${id} should exist`);
    assert.equal(entity.country, 'KG');
    assert.equal(entity.parentId, 'kg:osh');
    assert.equal(entity.type, type);
    assert.equal(entity.canonicalName, canonicalName);
    assert.ok(Number.isFinite(entity.center.lat));
    assert.ok(Number.isFinite(entity.center.lng));
    assert.notEqual(entity.center.lat, 0);
    assert.notEqual(entity.center.lng, 0);
  }
});

test('Osh enrichment does not promote surrounding discovery noise', () => {
  assert.equal(getGeoEntity('kg:osh:settlement:andijon-viloyati'), null);
  assert.equal(getGeoEntity('kg:osh:settlement:buloqboshi-tumani'), null);
  assert.equal(getGeoEntity('kg:osh:settlement:jalaquduq'), null);
});
