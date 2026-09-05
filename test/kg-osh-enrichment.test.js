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

test('Osh does not reuse the Kerme-Too village geometry as a municipal territory', () => {
  assert.equal(getGeoEntity('kg:osh:district:kerme-too'), null);

  const village = getGeoEntity('kg:osh:settlement:kerme-too');
  assert.ok(village);
  assert.equal(village.source, 'osm');
  assert.deepEqual(village.osm, { type: 'relation', id: 19062465 });
});

test('Osh reviewed OSM microdistricts retain their verified ways', () => {
  const expectedOsm = [
    ['kg:osh:microdistrict:anar', 'Anar', 452175726],
    ['kg:osh:microdistrict:tuleyken', 'Tuleyken', 452175725],
    ['kg:osh:microdistrict:kulatov', 'Кулатов', 452186589],
  ];

  for (const [id, canonicalName, osmId] of expectedOsm) {
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.country, 'KG');
    assert.equal(entity.type, 'microdistrict');
    assert.equal(entity.parentId, 'kg:osh');
    assert.equal(entity.canonicalName, canonicalName);
    assert.equal(entity.source, 'osm');
    assert.deepEqual(entity.osm, { type: 'way', id: osmId });
    assert.equal(entity.sourceUrl, `https://www.openstreetmap.org/way/${osmId}`);
  }
});

test('Osh reviewed 2GIS microdistricts retain their verified provenance', () => {
  const expectedMapped = [
    ['kg:osh:microdistrict:deu-21', 'ДЭУ-21', 'https://2gis.kg/osh/geo/70030077148492466'],
    ['kg:osh:microdistrict:mzhk-2', 'МЖК-2', 'https://2gis.kg/osh/geo/70030077148486886'],
    ['kg:osh:microdistrict:oshskiy', 'Ошский', 'https://2gis.kg/osh/geo/70030076149767632'],
  ];

  for (const [id, canonicalName, sourceUrl] of expectedMapped) {
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.country, 'KG');
    assert.equal(entity.type, 'microdistrict');
    assert.equal(entity.parentId, 'kg:osh');
    assert.equal(entity.canonicalName, canonicalName);
    assert.equal(entity.source, 'manual');
    assert.equal(entity.sourceUrl, sourceUrl);
    assert.equal(entity.accuracy, 'neighborhood');
    assert.equal(entity.osm, undefined);
  }
});

test('Osh enrichment does not promote surrounding discovery noise', () => {
  assert.equal(getGeoEntity('kg:osh:settlement:andijon-viloyati'), null);
  assert.equal(getGeoEntity('kg:osh:settlement:buloqboshi-tumani'), null);
  assert.equal(getGeoEntity('kg:osh:settlement:jalaquduq'), null);
  assert.equal(getGeoEntity('kg:osh:district:aravanskiy'), null);
  assert.equal(getGeoEntity('kg:osh:district:kara-suuskiy'), null);
  assert.equal(getGeoEntity('kg:osh:district:mezhdunarodnyy-aeroport-osh'), null);
});
