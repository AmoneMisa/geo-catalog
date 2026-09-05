import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const osmCases = Object.freeze([
  ['uz:tashkent:local-area:abu-ali-ibn-sina-2', 'local_area', 'Abu Ali ibn Sina-2', 'uz:tashkent:shaykhantahur', 41.3373461, 69.1711307, 'way', 149989839],
  ['uz:tashkent:microdistrict:chilanzar-21', 'microdistrict', 'Chilanzar-21', 'uz:tashkent:uchtepa', 41.2919358, 69.1742741, 'relation', 1563298],
  ['uz:tashkent:microdistrict:chilanzar-22', 'microdistrict', 'Chilanzar-22', 'uz:tashkent:uchtepa', 41.2882701, 69.1693758, 'relation', 13288750],
  ['uz:tashkent:local-area:guliston', 'local_area', 'Guliston', 'uz:tashkent:chilanzar', 41.2617283, 69.1591155, 'relation', 1856232],
]);

const mappedCases = Object.freeze([
  ['uz:tashkent:microdistrict:dilbulok', 'microdistrict', 'Dilbulok', 'uz:tashkent:yakkasaray', 41.270339, 69.24175, 'https://2gis.uz/tashkent/geo/70030077149953874'],
  ['uz:tashkent:mahalla:toshkent', 'mahalla', 'Toshkent mahallasi', 'uz:tashkent:yangihayot', 41.173696, 69.204985, 'https://2gis.uz/tashkent/geo/70030076273161955'],
]);

test('reviewed Tashkent OSM areas retain exact frozen provenance', () => {
  for (const [id, type, canonicalName, parentId, lat, lng, osmType, osmId] of osmCases) {
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.type, type, id);
    assert.equal(entity.country, 'UZ', id);
    assert.equal(entity.canonicalName, canonicalName, id);
    assert.equal(entity.parentId, parentId, id);
    assert.deepEqual(entity.center, { lat, lng }, id);
    assert.equal(entity.source, 'osm', id);
    assert.equal(entity.sourceUrl, `https://www.openstreetmap.org/${osmType}/${osmId}`, id);
    assert.deepEqual(entity.osm, { type: osmType, id: osmId }, id);
  }
});

test('reviewed Tashkent 2GIS areas retain exact frozen provenance', () => {
  for (const [id, type, canonicalName, parentId, lat, lng, sourceUrl] of mappedCases) {
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.type, type, id);
    assert.equal(entity.country, 'UZ', id);
    assert.equal(entity.canonicalName, canonicalName, id);
    assert.equal(entity.parentId, parentId, id);
    assert.deepEqual(entity.center, { lat, lng }, id);
    assert.equal(entity.source, 'manual', id);
    assert.equal(entity.sourceUrl, sourceUrl, id);
    assert.equal(entity.osm, undefined, id);
  }
});

test('misclassified Tashkent review candidates do not create duplicate spatial owners', () => {
  const pairs = [
    ['uz:tashkent:district:aviasozlar-2', 'uz:tashkent:local-area:aviasozlar-2'],
    ['uz:tashkent:district:aviasozlar-3', 'uz:tashkent:local-area:aviasozlar-3'],
    ['uz:tashkent:district:chilanzar-6', 'uz:tashkent:microdistrict:chilanzar-6'],
    ['uz:tashkent:district:chilanzar-14', 'uz:tashkent:microdistrict:chilanzar-14'],
    ['uz:tashkent:district:feruza-3', 'uz:tashkent:local-area:feruza-3'],
    ['uz:tashkent:district:tuzel-2', 'uz:tashkent:local-area:tuzel-2'],
    ['uz:tashkent:district:yoldosh-2', 'uz:tashkent:local-area:yoldosh-2'],
    ['uz:tashkent:district:yoldosh-16', 'uz:tashkent:local-area:yoldosh-16'],
    ['uz:tashkent:local-area:yangi-tashkent', 'uz:tashkent:mahalla:yangi-tashkent'],
  ];

  for (const [falseId, ownerId] of pairs) {
    assert.equal(getGeoEntity(falseId), null, falseId);
    assert.ok(getGeoEntity(ownerId), ownerId);
  }

  for (const falseId of [
    'uz:tashkent:district:kibrayskiy-rayon',
    'uz:tashkent:district:urtachirchikskiy-rayon',
    'uz:tashkent:district:yangiyulskiy-rayon',
    'uz:tashkent:district:yukarychirchikskiy-rayon',
    'uz:tashkent:district:zangiatinskiy-rayon',
    'uz:tashkent:local-area:tashkent',
  ]) {
    assert.equal(getGeoEntity(falseId), null, falseId);
  }
});
