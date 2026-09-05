import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const osmBacked = Object.freeze([
  ['kg:osh:residential:ak-bata', 'Ак-Бата', 1359814538],
  ['kg:osh:residential:ak-bata-2', 'Ак-Бата 2', 1359814550],
  ['kg:osh:residential:manas', 'Манас', 1359814541],
]);

const manuallyMapped = Object.freeze([
  ['kg:osh:residential:aristokrat', 'Аристократ', 'https://2gis.kg/osh/geo/70030076301946115'],
  ['kg:osh:residential:frunzenskiy', 'Фрунзенский', 'https://2gis.kg/osh/geo/70030076162724974'],
  ['kg:osh:residential:million', 'Миллион', 'https://2gis.kg/osh/geo/70030076181344221'],
  ['kg:osh:residential:osh-plaza', 'Osh Plaza', 'https://2gis.kg/osh/geo/70030076178106403'],
  ['kg:osh:residential:sere', 'Сере', 'https://2gis.kg/osh/geo/70030076168033038'],
  ['kg:osh:residential:sulayman-too', 'ЖК Сулайман Тоо', 'https://2gis.kg/osh/geo/70030076192613424'],
  ['kg:osh:residential:taberik', 'Таберик', 'https://2gis.kg/osh/geo/70030076155803515'],
  ['kg:osh:residential:yudzhin', 'Юджин', 'https://2gis.kg/osh/geo/70030076158011871'],
]);

test('reviewed Osh OSM residentials retain their physical provenance', () => {
  for (const [id, canonicalName, osmId] of osmBacked) {
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.country, 'KG');
    assert.equal(entity.type, 'residential_complex');
    assert.equal(entity.parentId, 'kg:osh');
    assert.equal(entity.canonicalName, canonicalName);
    assert.equal(entity.source, 'osm');
    assert.deepEqual(entity.osm, { type: 'way', id: osmId });
    assert.equal(entity.sourceUrl, `https://www.openstreetmap.org/way/${osmId}`);
  }
});

test('reviewed Osh 2GIS residentials retain their verified provenance', () => {
  for (const [id, canonicalName, sourceUrl] of manuallyMapped) {
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.country, 'KG');
    assert.equal(entity.type, 'residential_complex');
    assert.equal(entity.parentId, 'kg:osh');
    assert.equal(entity.canonicalName, canonicalName);
    assert.equal(entity.source, 'manual');
    assert.equal(entity.sourceUrl, sourceUrl);
    assert.equal(entity.accuracy, 'building');
    assert.equal(entity.osm, undefined);
  }
});

test('Osh residential review does not promote duplicate, ambiguous, or planning-label identities', () => {
  assert.equal(getGeoEntity('kg:osh:residential:ikhlas-osh'), null);
  assert.equal(getGeoEntity('kg:osh:residential:ak-buura'), null);
  for (const slug of ['lot-4-zhk', 'lot-5-zhk', 'lot-6-moll', 'lot-7-zhk', 'lot-9-zhk', 'lot-15-zhk', 'lot-16-zhk']) {
    assert.equal(getGeoEntity(`kg:osh:residential:${slug}`), null);
  }
});
