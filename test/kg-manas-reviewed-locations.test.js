import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const osmStreets = Object.freeze([
  ['kg:jalal-abad:street:abdukaimov-kochosu', 'Абдукаимов көчөсү', 251497731, 'kg:jalal-abad'],
  ['kg:jalal-abad:street:barpy-rysbaev-kochosu', 'Барпы Рысбаев көчөсү', 630066703, 'kg:jalal-abad'],
  ['kg:jalal-abad:street:fabrichnaya-kochosu', 'Фабричная көчөсү', 169187190, 'kg:jalal-abad'],
  ['kg:jalal-abad:street:kurenkeev-kochosu', 'Куренкеев көчөсү', 169187064, 'kg:jalal-abad'],
  ['kg:jalal-abad:street:kurortnaya', 'Улица Курортная', 366809476, 'kg:jalal-abad'],
  ['kg:jalal-abad:street:lesnaya', 'Лесная улица', 179251002, 'kg:jalal-abad'],
  ['kg:jalal-abad:street:ostrovskiy-kochosu', 'Островский көчөсү', 1046116683, 'kg:jalal-abad'],
  ['kg:jalal-abad:street:tumonbay-bayzakov', 'Проспект Тумонбая Байзакова', 626544203, 'kg:jalal-abad'],
  ['kg:jalal-abad:street:umarkulov-sake-kochosu', 'Умаркулов Саке көчөсү', 366808676, 'kg:jalal-abad'],
  ['kg:jalal-abad:street:zheni-zhok', 'Улица Жени-Жок', 63699984, 'kg:jalal-abad'],
  ['kg:jalal-abad:street:murzakulov-urubay-kochosu', 'Мурзакулов Урубай көчөсү', 169186983, 'kg:jalal-abad'],
  ['kg:jalal-abad:street:proletar-kochosu', 'Пролетар көчөсү', 169187189, 'kg:jalal-abad:microdistrict:kurmanbek'],
  ['kg:jalal-abad:street:togolok-moldo-kochosu', 'Тоголок Молдо көчөсү', 173907094, 'kg:jalal-abad:microdistrict:kurmanbek'],
]);

const mappedStreets = Object.freeze([
  ['kg:jalal-abad:street:10-ya-ulitsa-elektoron', '10-я улица Электорон', 'https://2gis.kg/dzhalal-abad/geo/70030076718238261'],
  ['kg:jalal-abad:street:2-ya-ulitsa-ptf', '2-я улица ПТФ', 'https://2gis.kg/dzhalal-abad/geo/70030076718243417'],
  ['kg:jalal-abad:street:5-ya-ulitsa-elektoron', '5-я улица Электорон', 'https://2gis.kg/dzhalal-abad/geo/70030076718237948'],
  ['kg:jalal-abad:street:arstanbaeva-1-ya', 'Улица Арстанбаева 1-я', 'https://2gis.kg/dzhalal-abad/geo/70030076753279587'],
  ['kg:jalal-abad:street:arstanbaeva-2-ya', 'Улица Арстанбаева 2-я', 'https://2gis.kg/dzhalal-abad/geo/70030076753280669'],
  ['kg:jalal-abad:street:chyngyza-aytmatova-3-1-ya', 'Улица Чынгыза Айтматова 3 1-я', 'https://2gis.kg/dzhalal-abad/geo/70030076717641613'],
  ['kg:jalal-abad:street:chyngyza-aytmatova-3-3-ya', 'Улица Чынгыза Айтматова 3 3-я', 'https://2gis.kg/dzhalal-abad/geo/70030076717644073'],
  ['kg:jalal-abad:street:chyngyza-aytmatova-3-5-ya', 'Улица Чынгыза Айтматова 3 5-я', 'https://2gis.kg/dzhalal-abad/geo/70030076717642966'],
]);

const residentials = Object.freeze([
  ['kg:jalal-abad:residential:asman-residence-1', 'Асман Резиденс 1', 1358176211],
  ['kg:jalal-abad:residential:asman-residence-9', 'Асман Резиденс 9', 1466812461],
]);

test('reviewed Manas OSM streets retain exact source ways and hierarchy', () => {
  for (const [id, canonicalName, osmId, parentId] of osmStreets) {
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.type, 'street');
    assert.equal(entity.country, 'KG');
    assert.equal(entity.canonicalName, canonicalName);
    assert.equal(entity.parentId, parentId);
    assert.equal(entity.source, 'osm');
    assert.deepEqual(entity.osm, { type: 'way', id: osmId });
    assert.equal(entity.sourceUrl, `https://www.openstreetmap.org/way/${osmId}`);
  }
});

test('reviewed Manas 2GIS streets retain exact source URLs', () => {
  for (const [id, canonicalName, sourceUrl] of mappedStreets) {
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.type, 'street');
    assert.equal(entity.country, 'KG');
    assert.equal(entity.canonicalName, canonicalName);
    assert.equal(entity.parentId, 'kg:jalal-abad');
    assert.equal(entity.source, 'manual');
    assert.equal(entity.sourceUrl, sourceUrl);
    assert.equal(entity.osm, undefined);
  }
});

test('reviewed Manas residential complexes retain exact OSM provenance', () => {
  for (const [id, canonicalName, osmId] of residentials) {
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.type, 'residential_complex');
    assert.equal(entity.country, 'KG');
    assert.equal(entity.canonicalName, canonicalName);
    assert.equal(entity.parentId, 'kg:jalal-abad');
    assert.equal(entity.source, 'osm');
    assert.deepEqual(entity.osm, { type: 'way', id: osmId });
    assert.equal(entity.sourceUrl, `https://www.openstreetmap.org/way/${osmId}`);
  }
});

test('mis-scoped frozen Manas candidates are not promoted under false identities', () => {
  for (const id of [
    'kg:jalal-abad:microdistrict:3-sadik-mkr-kurmanbek',
    'kg:jalal-abad:street:pakhta-abad',
    'kg:jalal-abad:street:zhalabadskaya',
    'kg:jalal-abad:residential:asman-residence-4',
    'kg:jalal-abad:district:bazar-korgonskiy',
    'kg:jalal-abad:district:kon-66-zhalal-abad-spmk-7',
    'kg:jalal-abad:district:pes-zhalal-abad-elektro',
    'kg:jalal-abad:district:stantsiya-zhalal-abad',
    'kg:jalal-abad:district:stantsiya-zhalal-abad-yuzhnyy',
    'kg:jalal-abad:district:suzakskiy',
    'kg:jalal-abad:district:tunnel-zhalal-abad',
    'kg:jalal-abad:district:zhalal-abad-elektro',
  ]) {
    assert.equal(getGeoEntity(id), null, id);
  }

  assert.equal(getGeoEntity('kg:manas'), null);
  assert.equal(getGeoEntity('kg:manas:street:murzakulov-urubay-kochosu'), null);
  assert.equal(getGeoEntity('kg:manas:residential:asman-residence-9'), null);
});
