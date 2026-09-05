import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const cases = Object.freeze([
  ['guzal', 'улица Гузал', 41.0166598, 71.6619732, 187902810],
  ['girvanbulakskaya', 'Гирванбулакская улица', 41.0165907, 71.6045166, 852599663],
  ['yangi-arik', 'улица Янги Арик', 40.976558, 71.6063434, 851502583],
  ['kh-khayitov', 'улица Х.Хайитов', 40.9767691, 71.5882833, 1528740101],
  ['kazanbulak', 'улица Казанбулак', 41.0449923, 71.672433, 187902820],
  ['ipakchi', 'улица Ипакчи', 41.044806, 71.7284428, 850460149],
  ['dilshod', 'улица Дилшод', 41.026362, 71.6696244, 624913238],
  ['chamanzor', 'улица Чаманзор', 41.0211147, 71.6632492, 1543123906],
  ['yangiaryk-2-proezd', 'улица Янгиарык 2-й проезд', 40.9771727, 71.6090035, 853102435],
  ['shark-guzali', 'улица Шарк гузали', 41.0398742, 71.5888633, 365638505],
  ['1-ya-doston', '1-я улица Достон', 41.0349798, 71.6261432, 851359881],
  ['olmazora', 'улица Олмазора', 41.0405346, 71.6812332, 836189730],
  ['1-ya-charkhpalak', '1-я улица Чархпалак', 41.0549535, 71.6308171, 1530545669],
  ['bunyodkor', 'улица Бунёдкор', 41.0109284, 71.6154308, 171349121],
  ['mingterak', 'улица Мингтерак', 41.0349498, 71.5985997, 1530274319],
  ['2-ya-tabarruk', '2-я улица Табаррук', 41.0451898, 71.6255013, 850439947],
  ['20-letiya-nezavisimosti', 'улица 20-летия Независимости', 41.025701, 71.6286242, 1530545652],
  ['yangi-bog', 'улица Янги Бог', 40.9888775, 71.6156016, 851500910],
  ['3-ya-khasanabad', '3-я улица Хасанабад', 41.0407487, 71.7133951, 1530773261],
]);

test('reviewed Namangan OSM streets retain exact way provenance', () => {
  for (const [slug, canonicalName, lat, lng, osmId] of cases) {
    const id = `uz:namangan:street:${slug}`;
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.type, 'street', id);
    assert.equal(entity.country, 'UZ', id);
    assert.equal(entity.canonicalName, canonicalName, id);
    assert.equal(entity.parentId, 'uz:namangan', id);
    assert.deepEqual(entity.center, { lat, lng }, id);
    assert.equal(entity.source, 'osm', id);
    assert.equal(entity.sourceUrl, `https://www.openstreetmap.org/way/${osmId}`, id);
    assert.deepEqual(entity.osm, { type: 'way', id: osmId }, id);
  }
});

test('ambiguous or non-street Namangan scrape hits remain excluded', () => {
  for (const id of [
    'uz:namangan:street:sakhovat',
    'uz:namangan:street:namangan-davlat-texnika-universiteti',
    'uz:namangan:street:yangi-namangan-tumani-86-maktab',
    'uz:namangan:street:yangi-namangan-tumani-hokimligi',
  ]) {
    assert.equal(getGeoEntity(id), null, id);
  }
});
