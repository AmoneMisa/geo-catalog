import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';
import { KG_BISHKEK_STREET_ENTITIES } from '../data-source/kg/bishkek/streets.js';
import { KG_BISHKEK_REVIEWED_STREET_ENTITIES } from '../data-source/kg/bishkek/reviewed-streets.js';

const allStreets = Object.freeze([...KG_BISHKEK_STREET_ENTITIES, ...KG_BISHKEK_REVIEWED_STREET_ENTITIES]);

const reviewed = Object.freeze([
  ['kg:bishkek:street:bishkek-1', 'Бишкек-1 улица', 'https://2gis.kg/bishkek/geo/70030077109339684'],
  ['kg:bishkek:street:bishkek-2', 'Бишкек-2 улица', 'https://2gis.kg/bishkek/geo/70030077109347845'],
  ['kg:bishkek:street:bishkek-3', 'Бишкек-3 улица', 'https://2gis.kg/bishkek/geo/70030077109388562'],
  ['kg:bishkek:street:bishkek-4', 'Бишкек-4 улица', 'https://2gis.kg/bishkek/geo/70030077109401190'],
  ['kg:bishkek:street:bishkek-5', 'Бишкек-5 улица', 'https://2gis.kg/bishkek/geo/70030077112282747'],
  ['kg:bishkek:street:bishkek-6', 'Бишкек-6 улица', 'https://2gis.kg/bishkek/geo/70030077112283379'],
  ['kg:bishkek:street:bishkek-7', 'Бишкек-7 улица', 'https://2gis.kg/bishkek/geo/70030077004288775'],
  ['kg:bishkek:street:bishkek-8', 'Бишкек-8 улица', 'https://2gis.kg/bishkek/geo/70030077004287880'],
  ['kg:bishkek:street:bishkek-9', 'Улица Бишкек-9', 'https://2gis.kg/bishkek/geo/70030076317057400'],
  ['kg:bishkek:street:abdumomunova', 'Улица Абдумомунова', 'https://2gis.kg/bishkek/geo/15763337430171734'],
  ['kg:bishkek:street:baygazak-arpachieva', 'Улица Байгазак Арпачиева', 'https://2gis.kg/bishkek/geo/15763337430178623'],
  ['kg:bishkek:street:kvartal-kirova', 'Улица квартал Кирова', 'https://2gis.kg/bishkek/geo/70030077065414085'],
  ['kg:bishkek:street:parkovaya', 'Парковая улица', 'https://2gis.kg/bishkek/geo/70030076194656195'],
  ['kg:bishkek:street:tunguch', 'Улица Тунгуч', 'https://2gis.kg/bishkek/geo/15763337430171998'],
  ['kg:bishkek:street:turusbekova', 'Улица Турусбекова', 'https://2gis.kg/bishkek/geo/15763337430171886'],
]);

test('reviewed Bishkek streets retain exact 2GIS provenance', () => {
  for (const [id, canonicalName, sourceUrl] of reviewed) {
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.country, 'KG');
    assert.equal(entity.type, 'street');
    assert.equal(entity.parentId, 'kg:bishkek');
    assert.equal(entity.canonicalName, canonicalName);
    assert.equal(entity.source, 'manual');
    assert.equal(entity.sourceUrl, sourceUrl);
    assert.equal(entity.accuracy, 'street');
    assert.equal(entity.accuracyM, 1600);
    assert.equal(entity.osm, undefined);
  }
});

test('existing Ibraimov street remains the sole physical owner', () => {
  const owner = getGeoEntity('kg:bishkek:street:ibraimov');
  assert.ok(owner);
  assert.equal(owner.canonicalName, 'Ibraimov Street');
  assert.equal(allStreets.filter((entity) => entity.canonicalName === 'Ibraimov Street').length, 1);
});

test('ambiguous, stale and out-of-city street candidates are not promoted', () => {
  const rejectedNames = [
    '1-я улица',
    'Улица 11-я',
    'Улица 12-я',
    '22-я улица',
    'Улица 8-я',
    'Береговая улица',
    'Улица СЭЗ Бишкек',
  ];
  for (const canonicalName of rejectedNames) {
    assert.equal(allStreets.some((entity) => entity.canonicalName === canonicalName), false, canonicalName);
  }
});
