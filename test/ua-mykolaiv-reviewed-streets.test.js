import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const cases = Object.freeze([
  ['kurortnyi-lane', 'провулок Курортний', 46.9587119, 31.9634134, 197366592],
  ['armiiskyi-lane', 'Армійський провулок', 47.0032937, 31.9956036, 849897209],
  ['finskyi-lane', 'Фінський провулок', 47.0048201, 31.9983039, 1305676875],
  ['mizhrichkovyi-lane', 'Міжрічковий провулок', 46.999715, 31.9996219, 131383328],
  ['pershyi-lane', 'Перший провулок', 46.9984676, 31.9956101, 110860137],
  ['ochakovskiy-lane', 'Очаковский переулок', 46.9881331, 31.94417, 184111710],
  ['izmailskiy-lane', 'Измаильский переулок', 46.9872069, 31.9419976, 300717981],
  ['4-parnikovyy-lane', '4-й Парниковый переулок', 46.961236, 31.9568842, 148498094],
  ['1-parnikovyy-lane', '1-й Парниковый переулок', 46.9591472, 31.9605641, 148498097],
  ['2-parnikovyy-lane', '2-й Парниковый переулок', 46.9595477, 31.9598671, 148498104],
  ['ofitserskiy-boulevard', 'Офицерский бульвар', 47.0238299, 31.9696876, 184779573],
  ['buzkyi-boulevard', 'Бузький бульвар', 46.9815669, 31.9711369, 1212975222],
]);

test('reviewed Mykolaiv streets retain representative OSM way provenance', () => {
  for (const [slug, canonicalName, lat, lng, osmId] of cases) {
    const id = `ua:mykolaiv:street:${slug}`;
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.type, 'street', id);
    assert.equal(entity.country, 'UA', id);
    assert.equal(entity.canonicalName, canonicalName, id);
    assert.equal(entity.parentId, 'ua:mykolaiv', id);
    assert.deepEqual(entity.center, { lat, lng }, id);
    assert.equal(entity.source, 'osm', id);
    assert.equal(entity.sourceUrl, `https://www.openstreetmap.org/way/${osmId}`, id);
    assert.deepEqual(entity.osm, { type: 'way', id: osmId }, id);
  }
});

test('reviewed scrape keeps the existing Flotskyi Boulevard physical owner', () => {
  const entity = getGeoEntity('ua:mykolaiv:street:flotskyi-boulevard');
  assert.ok(entity);
  assert.equal(entity.canonicalName, 'Flotskyi Boulevard');
  assert.deepEqual(entity.osm, { type: 'way', id: 143461027 });
});

test('generic Mykolaiv avenue and square hits are not promoted as streets', () => {
  assert.equal(getGeoEntity('ua:mykolaiv:street:prospekt'), null);
  assert.equal(getGeoEntity('ua:mykolaiv:street:sobornaya-ploshchad'), null);
});
