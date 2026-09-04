import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const cityScoped = Object.freeze([
  ['kg:osh:settlement:kenesh', 'settlement', 'Кеңеш'],
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
  for (const [id, type, canonicalName] of cityScoped) {
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

test('Kerme-Too owns Kulatov through the current Osh municipal hierarchy', () => {
  const kermeToo = getGeoEntity('kg:osh:district:kerme-too');
  assert.ok(kermeToo);
  assert.equal(kermeToo.type, 'district');
  assert.equal(kermeToo.country, 'KG');
  assert.equal(kermeToo.parentId, 'kg:osh');
  assert.equal(kermeToo.canonicalName, 'Керме-Тоо');
  assert.equal(kermeToo.source, 'osm');
  assert.deepEqual(kermeToo.osm, { type: 'relation', id: 19062465 });

  const kulatov = getGeoEntity('kg:osh:microdistrict:kulatov');
  assert.ok(kulatov);
  assert.equal(kulatov.type, 'microdistrict');
  assert.equal(kulatov.country, 'KG');
  assert.equal(kulatov.parentId, 'kg:osh:district:kerme-too');
  assert.equal(kulatov.canonicalName, 'Кулатов');
  assert.equal(kulatov.source, 'osm');
  assert.deepEqual(kulatov.osm, { type: 'way', id: 452186589 });

  assert.equal(getGeoEntity('kg:osh:settlement:kerme-too'), null);
});

test('Osh scrape-backed microdistricts retain truthful OSM provenance', () => {
  for (const id of ['kg:osh:microdistrict:anar', 'kg:osh:microdistrict:tuleyken']) {
    const entity = getGeoEntity(id);
    assert.ok(entity);
    assert.equal(entity.source, 'osm');
    assert.equal(entity.osm?.type, 'way');
  }
});

test('Osh enrichment does not promote surrounding discovery noise', () => {
  assert.equal(getGeoEntity('kg:osh:settlement:andijon-viloyati'), null);
  assert.equal(getGeoEntity('kg:osh:settlement:buloqboshi-tumani'), null);
  assert.equal(getGeoEntity('kg:osh:settlement:jalaquduq'), null);
});
