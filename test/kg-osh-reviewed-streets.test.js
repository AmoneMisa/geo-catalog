import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const osmBacked = Object.freeze([
  ['kg:osh:street:askar-shakirov-kochosu', 'Аскар Шакиров көчөсү', 71032627, 'kg:osh'],
  ['kg:osh:street:asrankulov-kochosu', 'Асранкулов көчөсү', 175843374, 'kg:osh'],
  ['kg:osh:street:iminov-kochosu', 'Иминов көчөсү', 71185333, 'kg:osh'],
  ['kg:osh:street:kelechek-kochosu', 'Келечек көчөсү', 70952002, 'kg:osh'],
  ['kg:osh:street:kulatov-kochosu', 'Кулатов көчөсү', 448916343, 'kg:osh:settlement:pyatiletka'],
  ['kg:osh:street:sargalchaev-kochosu', 'Саргалчаев көчөсү', 448916346, 'kg:osh:settlement:pyatiletka'],
  ['kg:osh:street:tashmamata-dzhumabaeva', 'Ташмамата Джумабаева улица', 70904799, 'kg:osh'],
  ['kg:osh:street:togolok-moldo-kochosu', 'Тоголок Молдо көчөсү', 70899877, 'kg:osh:settlement:ak-buura-3'],
  ['kg:osh:street:torobek-abakir-uulu-kochosu', 'Төрөбек Абакир уулу көчөсү', 74095916, 'kg:osh'],
]);

const manuallyMapped = Object.freeze([
  ['kg:osh:street:khan-ordo', 'Улица Хан-Ордо', 'https://2gis.kg/osh/geo/70030076149147361'],
  ['kg:osh:street:kochkonova-turdali', 'Улица Кочконова Турдали', 'https://2gis.kg/osh/geo/70030076149717306'],
  ['kg:osh:street:kurmanzhan-datka', 'Улица Курманжан датка', 'https://2gis.kg/osh/geo/70030076147380956'],
  ['kg:osh:street:mamyrova', 'Улица Мамырова', 'https://2gis.kg/osh/geo/70030076147438479'],
  ['kg:osh:street:monueva', 'Улица Монуева', 'https://2gis.kg/osh/geo/70030076149201605'],
  ['kg:osh:street:nasirdinova', 'Улица Насирдинова', 'https://2gis.kg/osh/geo/70030076147447879'],
  ['kg:osh:street:oshskaya', 'Ошская улица', 'https://2gis.kg/osh/geo/70030076147381151'],
  ['kg:osh:street:raimbekova', 'Улица Раимбекова', 'https://2gis.kg/osh/geo/70030076147383821'],
]);

test('reviewed Osh OSM streets retain exact source ways and hierarchy', () => {
  for (const [id, canonicalName, osmId, parentId] of osmBacked) {
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.country, 'KG');
    assert.equal(entity.type, 'street');
    assert.equal(entity.canonicalName, canonicalName);
    assert.equal(entity.parentId, parentId);
    assert.equal(entity.source, 'osm');
    assert.deepEqual(entity.osm, { type: 'way', id: osmId });
    assert.equal(entity.sourceUrl, `https://www.openstreetmap.org/way/${osmId}`);
  }
});

test('reviewed Osh 2GIS streets retain exact source URLs', () => {
  for (const [id, canonicalName, sourceUrl] of manuallyMapped) {
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.country, 'KG');
    assert.equal(entity.type, 'street');
    assert.equal(entity.canonicalName, canonicalName);
    assert.equal(entity.parentId, 'kg:osh');
    assert.equal(entity.source, 'manual');
    assert.equal(entity.sourceUrl, sourceUrl);
    assert.equal(entity.accuracy, 'street');
    assert.equal(entity.osm, undefined);
  }
});

test('scrape POIs are not promoted under false Osh street identities', () => {
  for (const slug of [
    'oshskiy-filial-obshchestvennogo-obedineniya-soyuza-khudozhnikov-kyrgyzskoy-respbuluki',
    'oshskiy-gosudarstvennyy-universitet',
    'sovet-profsoyuzov-oshskoy-oblasti',
    'uzbekskiy-dramaticheskiy-teatr-im-z-m-babura',
  ]) {
    assert.equal(getGeoEntity(`kg:osh:street:${slug}`), null);
  }
});
