import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const osmCases = Object.freeze([
  ['uz:tashkent:microdistrict:chilanzar-21', 'microdistrict', 'Chilanzar-21', 'uz:tashkent:uchtepa', 41.2919358, 69.1742741, 'relation', 1563298],
  ['uz:tashkent:microdistrict:chilanzar-22', 'microdistrict', 'Chilanzar-22', 'uz:tashkent:uchtepa', 41.2882701, 69.1693758, 'relation', 13288750],
  ['uz:tashkent:local-area:guliston', 'local_area', 'Guliston', 'uz:tashkent:chilanzar', 41.2617283, 69.1591155, 'relation', 1856232],
]);

const mappedCases = Object.freeze([
  ['uz:tashkent:microdistrict:dilbulok', 'microdistrict', 'Dilbulok', 'uz:tashkent:yakkasaray', 41.270339, 69.24175, 'https://2gis.uz/tashkent/geo/70030077149953874'],
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

test('reviewed Tashkent mapped areas retain exact frozen provenance', () => {
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
    assert.equal(entity.accuracyM, 800, id);
    assert.equal(entity.osm, undefined, id);
  }
});

test('Chilanzar-20 is owned by the reviewed microdistrict relation', () => {
  const entity = getGeoEntity('uz:tashkent:microdistrict:chilanzar-20');
  assert.ok(entity);
  assert.equal(entity.type, 'microdistrict');
  assert.equal(entity.country, 'UZ');
  assert.equal(entity.canonicalName, 'Chilanzar-20');
  assert.equal(entity.parentId, 'uz:tashkent:chilanzar');
  assert.deepEqual(entity.center, { lat: 41.2665051, lng: 69.1798855 });
  assert.equal(entity.source, 'osm');
  assert.deepEqual(entity.osm, { type: 'relation', id: 1850375 });
});

test('misclassified Tashkent review candidates do not create duplicate spatial owners', () => {
  const pairs = [
    ['uz:tashkent:district:aviasozlar-2', 'uz:tashkent:local-area:aviasozlar-2'],
    ['uz:tashkent:district:aviasozlar-3', 'uz:tashkent:local-area:aviasozlar-3'],
    ['uz:tashkent:district:chilanzar-6', 'uz:tashkent:microdistrict:chilanzar-6'],
    ['uz:tashkent:district:chilanzar-14', 'uz:tashkent:microdistrict:chilanzar-14'],
    ['uz:tashkent:district:chilanzar-20', 'uz:tashkent:microdistrict:chilanzar-20'],
    ['uz:tashkent:district:feruza-3', 'uz:tashkent:local-area:feruza-3'],
    ['uz:tashkent:district:tuzel-2', 'uz:tashkent:local-area:tuzel-2'],
    ['uz:tashkent:district:yoldosh-2', 'uz:tashkent:local-area:yoldosh-2'],
    ['uz:tashkent:district:yoldosh-16', 'uz:tashkent:local-area:yoldosh-16'],
    ['uz:tashkent:local-area:yangi-tashkent', 'uz:tashkent:mahalla:yangi-tashkent'],
    ['uz:tashkent:local-area:abu-ali-ibn-sina-2', 'uz:tashkent:local-area:ibn-sino-2'],
    ['uz:tashkent:district:yuldosh-sputnik-2', 'uz:tashkent:local-area:yoldosh-2'],
    ['uz:tashkent:district:yuldosh-sputnik-9', 'uz:tashkent:local-area:yoldosh-9'],
    ['uz:tashkent:district:yuldosh-sputnik-16', 'uz:tashkent:local-area:yoldosh-16'],
    ['uz:tashkent:district:yuldosh-sputnik-17', 'uz:tashkent:local-area:yoldosh-17'],
    ['uz:tashkent:district:yuldosh-sputnik-ts2', 'uz:tashkent:local-area:yoldosh-c2'],
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
    'uz:tashkent:mahalla:toshkent',
  ]) {
    assert.equal(getGeoEntity(falseId), null, falseId);
  }
});
