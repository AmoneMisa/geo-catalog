import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const cases = Object.freeze([
  ['aktepa-sohil-buyi', 'ЖК "Актепа Сохил буйи"', 41.2993234, 69.2043403, 'relation', 15651367],
  ['btgi-shamol', 'ЖК "Бтги Шамол"', 41.3541233, 69.3358364, 'way', 1104602117],
  ['elegant', 'Жилой комплекс Elegant', 41.2827449, 69.2628378, 'way', 180910482],
  ['green-city-drovoseki', 'ЖК "Грин Сити" (Дровосеки)', 41.286188, 69.2142619, 'way', 407533014],
  ['gulsaray', 'жилой комплекс Гульсарай', 41.3622476, 69.2329138, 'way', 141919402],
  ['khuvaydo', 'Хувайдо жилой комплекс', 41.3437217, 69.2010282, 'way', 595298393],
  ['lotus-7', 'Жилой комплекс LOTUS 7', 41.3111877, 69.3286562, 'way', 450627592],
  ['milliy-house-ness', 'жилой комплекс "Milliy House" от NESS', 41.3401092, 69.3942995, 'way', 1015249792],
  ['ness-city', 'ЖК "Ness City"', 41.2424103, 69.2206278, 'way', 1028396345],
  ['ness-one', 'жилой комплекс "Ness One" от Ness', 41.2945371, 69.1823913, 'way', 1009602345],
  ['ness-sebzar', 'ЖК "Ness Sebzar"', 41.3388372, 69.2562378, 'way', 340229091],
  ['oazis', "Жилой комплекс 'Оазис'", 41.3646933, 69.2781875, 'way', 265903250],
  ['perspektiva', 'Переспектива жилой комплекс', 41.2815745, 69.3050023, 'way', 98681697],
  ['sultania', 'Sultania ЖК', 41.3121445, 69.3148833, 'way', 87498688],
  ['uchtepa-avenue', 'ЖК Учтепа Авению', 41.2754583, 69.1850373, 'way', 1478622713],
  ['yangibakht', 'ЖК Янгибахт', 41.2636079, 69.3751627, 'way', 1476565024],
  ['zamok-schastya', 'Жилой комплекс “Замок счастья”', 41.3666989, 69.3097562, 'way', 265923511],
]);

test('reviewed Tashkent residential OSM batch retains exact physical provenance', () => {
  for (const [slug, canonicalName, lat, lng, osmType, osmId] of cases) {
    const id = `uz:tashkent:residential:${slug}`;
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.type, 'residential_complex', id);
    assert.equal(entity.country, 'UZ', id);
    assert.equal(entity.canonicalName, canonicalName, id);
    assert.equal(entity.parentId, 'uz:tashkent', id);
    assert.deepEqual(entity.center, { lat, lng }, id);
    assert.equal(entity.source, 'osm', id);
    assert.equal(entity.sourceUrl, `https://www.openstreetmap.org/${osmType}/${osmId}`, id);
    assert.deepEqual(entity.osm, { type: osmType, id: osmId }, id);
  }
});

test('reviewed Tashkent residential batch keeps ambiguous candidates excluded', () => {
  for (const id of [
    'uz:tashkent:residential:dombrabad-tauers',
    'uz:tashkent:residential:penthouse',
    'uz:tashkent:residential:assalom-boglar',
  ]) {
    assert.equal(getGeoEntity(id), null, id);
  }
});
