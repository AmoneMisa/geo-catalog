import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const cases = Object.freeze([
  ['koty-lane', 'провулок Коти', 51.5276699, 31.2604199, 146827831],
  ['kvitky-tsisyk-lane', 'провулок Квітки Цісик', 51.5322833, 31.263258, 146827841],
  ['poliskyi-lane', 'провулок Поліський', 51.502865, 31.2712506, 1271828572],
  ['yevhena-onatskoho', 'вулиця Євгена Онацького', 51.5201137, 31.2639957, 107339142],
]);

test('reviewed Chernihiv streets retain exact OSM way provenance', () => {
  for (const [slug, canonicalName, lat, lng, osmId] of cases) {
    const id = `ua:chernihiv:street:${slug}`;
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.type, 'street', id);
    assert.equal(entity.country, 'UA', id);
    assert.equal(entity.canonicalName, canonicalName, id);
    assert.equal(entity.parentId, 'ua:chernihiv', id);
    assert.deepEqual(entity.center, { lat, lng }, id);
    assert.equal(entity.source, 'osm', id);
    assert.equal(entity.sourceUrl, `https://www.openstreetmap.org/way/${osmId}`, id);
    assert.deepEqual(entity.osm, { type: 'way', id: osmId }, id);
  }
});

test('nearby rural Chernihiv-region lane hits remain excluded', () => {
  for (const id of [
    'ua:chernihiv:street:tsentralnyi-lane',
    'ua:chernihiv:street:peremohy-lane',
    'ua:chernihiv:street:horikhovyi-lane',
    'ua:chernihiv:street:vokzalnyi-lane',
    'ua:chernihiv:street:yatsevskiy-lane',
    'ua:chernihiv:street:naberezhnyi-lane',
  ]) {
    assert.equal(getGeoEntity(id), null, id);
  }
});
