import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const manuallyMapped = Object.freeze([
  ['kg:bishkek:residential:achekey', 'Ачекей', 'https://2gis.kg/bishkek/geo/70030076177262940'],
  ['kg:bishkek:residential:arbat', 'Арбат', 'https://2gis.kg/bishkek/geo/70030076198458074'],
  ['kg:bishkek:residential:chyngyz-aytmatov', 'Чынгыз Айтматов Ордосу', 'https://2gis.kg/bishkek/geo/70030076353131122'],
  ['kg:bishkek:residential:dzhal-artis', 'Jal Artis', 'https://2gis.kg/bishkek/geo/70030077146127951'],
  ['kg:bishkek:residential:florentsiya', 'Флоренция', 'https://2gis.kg/bishkek/geo/70030076168537056'],
  ['kg:bishkek:residential:ihlas-residence', 'IHLAS Residence', 'https://2gis.kg/bishkek/geo/70030076201436762'],
  ['kg:bishkek:residential:imperial', 'Империал', 'https://2gis.kg/bishkek/geo/15763234351119787'],
  ['kg:bishkek:residential:jibekcity', 'Jibekcity', 'https://2gis.kg/bishkek/geo/70030077154003011'],
  ['kg:bishkek:residential:kontinental', 'Континенталь', 'https://2gis.kg/bishkek/geo/70030076201799610'],
  ['kg:bishkek:residential:kremlevskiy', 'Кремлевский', 'https://2gis.kg/bishkek/geo/70030076170116197'],
  ['kg:bishkek:residential:malina', 'Malina', 'https://2gis.kg/bishkek/geo/70030076221163219'],
  ['kg:bishkek:residential:muras', 'Мурас', 'https://2gis.kg/bishkek/geo/70030076176544634'],
  ['kg:bishkek:residential:pioner', 'Пионер', 'https://2gis.kg/bishkek/geo/15763234351047236'],
  ['kg:bishkek:residential:royal', 'Royal', 'https://2gis.kg/bishkek/geo/70030076377140948'],
]);

test('reviewed Bishkek 2GIS residentials retain verified physical provenance', () => {
  for (const [id, canonicalName, sourceUrl] of manuallyMapped) {
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.country, 'KG');
    assert.equal(entity.type, 'residential_complex');
    assert.equal(entity.parentId, 'kg:bishkek');
    assert.equal(entity.canonicalName, canonicalName);
    assert.equal(entity.source, 'manual');
    assert.equal(entity.sourceUrl, sourceUrl);
    assert.equal(entity.accuracy, 'building');
    assert.equal(entity.osm, undefined);
  }
});

test('Bishkek residential review does not promote aliases or ambiguous duplicate owners', () => {
  assert.equal(getGeoEntity('kg:bishkek:residential:tokyo'), null);
  assert.ok(getGeoEntity('kg:bishkek:residential:tokyo-city'));
  assert.equal(getGeoEntity('kg:bishkek:residential:belek'), null);
  assert.equal(getGeoEntity('kg:bishkek:residential:asman-residence'), null);
  assert.equal(getGeoEntity('kg:bishkek:residential:asman-towers'), null);

  const southern = getGeoEntity('kg:bishkek:residential:yuzhnyy');
  assert.ok(southern);
  assert.equal(southern.osm?.id, 169829010);
});
