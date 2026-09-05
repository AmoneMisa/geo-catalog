import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const osmBacked = Object.freeze([
  ['kg:karakol:street:yu-abdrakhmanova', 'Улица Ю. Абдрахманова', 27427286],
  ['kg:karakol:street:arychnaya', 'Арычная улица', 178785649],
  ['kg:karakol:street:n-aitmatovoy', 'Улица Н. Айтматовой', 446571699],
  ['kg:karakol:street:konkina', 'Улица Конкина', 803847586],
  ['kg:karakol:street:koshevogo', 'Улица Кошевого', 400042020],
  ['kg:karakol:street:kyshtobaeva', 'Улица Кыштобаева', 220766288],
  ['kg:karakol:street:michurina', 'Улица Мичурина', 182091982],
  ['kg:karakol:street:molodezhnaya', 'Молодёжная улица', 243569007],
  ['kg:karakol:street:moskovskaya', 'Московская улица', 178785680],
  ['kg:karakol:street:sadybekova', 'Улица Садыбекова', 178823537],
  ['kg:karakol:street:shapak-baatyra', 'Улица Шапак-баатыра', 220868237],
  ['kg:karakol:street:stalingradskaya', 'Сталинградская улица', 220868238],
  ['kg:karakol:street:voroshilova', 'Улица Ворошилова', 220868257],
  ['kg:karakol:street:zhakshylyk', 'Улица Жакшылык', 220868245],
]);

const manuallyMapped = Object.freeze([
  ['kg:karakol:street:2-ya-karasaeva', '2-я улица Карасаева', 'https://2gis.kg/karakol/geo/70030076750268137'],
  ['kg:karakol:street:derbisheva', 'Улица Дербишева', 'https://2gis.kg/karakol/geo/70030076136845714'],
  ['kg:karakol:street:kadyr-ake-1', 'Улица Кадыр аке 1-я', 'https://2gis.kg/karakol/geo/70030076258910388'],
  ['kg:karakol:street:kadyr-ake-3', 'Улица Кадыр аке 3-я', 'https://2gis.kg/karakol/geo/70030076258904612'],
  ['kg:karakol:street:kadyr-ake-4', 'Улица Кадыр аке 4-я', 'https://2gis.kg/karakol/geo/70030076258903884'],
  ['kg:karakol:street:kadyr-ake-5', 'Улица Кадыр аке 5-я', 'https://2gis.kg/karakol/geo/70030076488434522'],
  ['kg:karakol:street:karakolskaya', 'Каракольская улица', 'https://2gis.kg/karakol/geo/70030076136851739'],
  ['kg:karakol:street:kutmanalieva', 'Улица Кутманалиева', 'https://2gis.kg/karakol/geo/70030076136846387'],
  ['kg:karakol:street:kuzbasskaya-9', 'Улица Кузбасская 9-я', 'https://2gis.kg/karakol/geo/70030076676594983'],
  ['kg:karakol:street:kuzbasskaya-10', 'Улица Кузбасская 10-я', 'https://2gis.kg/karakol/geo/70030076676595424'],
  ['kg:karakol:street:kuzbasskaya-14', 'Улица Кузбасская 14-я', 'https://2gis.kg/karakol/geo/70030076676602146'],
  ['kg:karakol:street:masalieva', 'Улица Масалиева', 'https://2gis.kg/karakol/geo/70030076136846143'],
  ['kg:karakol:street:torgoeva', 'Улица Торгоева', 'https://2gis.kg/karakol/geo/70030076136731817'],
]);

test('reviewed Karakol streets expose canonical OSM-backed entities', () => {
  for (const [id, canonicalName, osmId] of osmBacked) {
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.country, 'KG');
    assert.equal(entity.type, 'street');
    assert.equal(entity.parentId, 'kg:karakol');
    assert.equal(entity.canonicalName, canonicalName);
    assert.equal(entity.source, 'osm');
    assert.deepEqual(entity.osm, { type: 'way', id: osmId });
    assert.equal(entity.sourceUrl, `https://www.openstreetmap.org/way/${osmId}`);
  }
});

test('remaining reviewed Karakol streets retain their verified 2GIS provenance', () => {
  for (const [id, canonicalName, sourceUrl] of manuallyMapped) {
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.country, 'KG');
    assert.equal(entity.type, 'street');
    assert.equal(entity.parentId, 'kg:karakol');
    assert.equal(entity.canonicalName, canonicalName);
    assert.equal(entity.source, 'manual');
    assert.equal(entity.sourceUrl, sourceUrl);
    assert.equal(entity.accuracy, 'street');
    assert.equal(entity.osm, undefined);
  }

  assert.equal(getGeoEntity('kg:karakol:street:karakol'), null);
});
