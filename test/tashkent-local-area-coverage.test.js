import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getGeoEntity,
  isGeoCoverageGap,
  resolveLexiconGeoEntity,
} from '../src/index.js';

const resolvedAreas = Object.freeze([
  ['Gulobod', 'uz:tashkent:local-area:gulobod', 'uz:tashkent:shaykhantahur', 'way', 144061796],
  ['Sebzor', 'uz:tashkent:local-area:sebzor', 'uz:tashkent:almazar', 'way', 32593826],
  ['Olimpiya', 'uz:tashkent:local-area:olimpiya', 'uz:tashkent:almazar', 'way', 1146998118],
  ["Chamanbog'", 'uz:tashkent:local-area:chamanbog', 'uz:tashkent:almazar', 'way', 1150374391],
  ['Feruza-2', 'uz:tashkent:local-area:feruza-2', 'uz:tashkent:mirzo-ulugbek', 'node', 1868216236],
  ['Feruza-3', 'uz:tashkent:local-area:feruza-3', 'uz:tashkent:mirzo-ulugbek', 'way', 151576922],
  ["Beshqo'rg'on-1", 'uz:tashkent:local-area:beshqorgon-1', 'uz:tashkent:almazar', 'node', 1866058465],
  ["Beshqo'rg'on-2", 'uz:tashkent:local-area:beshqorgon-2', 'uz:tashkent:almazar', 'node', 1866058473],
  ["Beshqo'rg'on-3", 'uz:tashkent:local-area:beshqorgon-3', 'uz:tashkent:almazar', 'node', 1866058478],
  ["Beshqo'rg'on-4", 'uz:tashkent:local-area:beshqorgon-4', 'uz:tashkent:almazar', 'way', 149508411],
  ['Quruvchi', 'uz:tashkent:local-area:quruvchi', 'uz:tashkent:sergeli', 'way', 141913622],
  ["Bo'z-1", 'uz:tashkent:local-area:boz-1', 'uz:tashkent:mirzo-ulugbek', 'node', 1867214210],
  ["Bo'z-2", 'uz:tashkent:local-area:boz-2', 'uz:tashkent:mirzo-ulugbek', 'node', 1867214215],
  ['Asalobod-1', 'uz:tashkent:local-area:asalobod-1', 'uz:tashkent:yashnobod', 'way', 165626940],
  ['Asalobod-2', 'uz:tashkent:local-area:asalobod-2', 'uz:tashkent:yashnobod', 'way', 165626941],
  ['Ibn Sino-1', 'uz:tashkent:local-area:ibn-sino-1', 'uz:tashkent:shaykhantahur', 'way', 103249732],
  ['Ibn Sino-2', 'uz:tashkent:local-area:ibn-sino-2', 'uz:tashkent:shaykhantahur', 'way', 149989839],
  ['Parkent-Riyoziy', 'uz:tashkent:local-area:parkent-riyoziy', 'uz:tashkent:yashnobod', 'node', 1867099585],
  ['Shifokorlar-1', 'uz:tashkent:local-area:shifokorlar-1', 'uz:tashkent:almazar', 'way', 149513658],
  ['Shifokorlar-4', 'uz:tashkent:local-area:shifokorlar-4', 'uz:tashkent:almazar', 'way', 142245652],
  ['Markaz-12', 'uz:tashkent:local-area:markaz-12', 'uz:tashkent:shaykhantahur', 'node', 4984463379],
  ["Qo'yliq-1", 'uz:tashkent:local-area:qoyliq-1', 'uz:tashkent:mirobod', 'node', 3991877003],
  ["Qo'yliq-2", 'uz:tashkent:local-area:qoyliq-2', 'uz:tashkent:mirobod', 'node', 3991877004],
  ["Qo'yliq-3", 'uz:tashkent:local-area:qoyliq-3', 'uz:tashkent:mirobod', 'node', 3991877005],
  ["Qo'yliq-4", 'uz:tashkent:local-area:qoyliq-4', 'uz:tashkent:mirobod', 'node', 3991877006],
  ["Qo'yliq-5", 'uz:tashkent:local-area:qoyliq-5', 'uz:tashkent:sergeli', 'node', 3991877007],
  ["Qo'yliq-6", 'uz:tashkent:local-area:qoyliq-6', 'uz:tashkent:sergeli', 'node', 4750071797],
  ["Qo'yliq-7", 'uz:tashkent:local-area:qoyliq-7', 'uz:tashkent:sergeli', 'node', 5637605369],
]);

const derivedAreas = Object.freeze([
  ['Humoyun', 'uz:tashkent:local-area:humoyun', 'uz:tashkent:mirzo-ulugbek', 41.34339, 69.388945],
  ['Taraqqiyot-1', 'uz:tashkent:local-area:taraqqiyot-1', 'uz:tashkent:almazar', 41.354837, 69.241154],
  ['Taraqqiyot-2', 'uz:tashkent:local-area:taraqqiyot-2', 'uz:tashkent:almazar', 41.352779, 69.241154],
  ['Taraqqiyot-3', 'uz:tashkent:local-area:taraqqiyot-3', 'uz:tashkent:almazar', 41.354884, 69.239708],
]);

test('verified Tashkent local areas resolve to their exact OSM owners', () => {
  for (const [canonical, id, parentId, osmType, osmId] of resolvedAreas) {
    const input = { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical };
    const entity = resolveLexiconGeoEntity(input);

    assert.equal(entity?.id, id, canonical);
    assert.equal(entity?.parentId, parentId, canonical);
    assert.deepEqual(entity?.osm, { type: osmType, id: osmId }, canonical);
    assert.equal(entity?.source, 'osm', canonical);
    assert.equal(isGeoCoverageGap(input), false, canonical);
  }
});

test('verified approximate Tashkent local-area centers remain explicitly non-OSM', () => {
  for (const [canonical, id, parentId, lat, lng] of derivedAreas) {
    const input = { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical };
    const entity = resolveLexiconGeoEntity(input);

    assert.equal(entity?.id, id, canonical);
    assert.equal(entity?.parentId, parentId, canonical);
    assert.equal(entity?.source, 'manual', canonical);
    assert.equal(entity?.accuracy, 'approximate', canonical);
    assert.equal(entity?.osm, undefined, canonical);
    assert.ok(Math.abs(entity.center.lat - lat) < 1e-9, canonical);
    assert.ok(Math.abs(entity.center.lng - lng) < 1e-9, canonical);
    assert.equal(isGeoCoverageGap(input), false, canonical);
  }
});

test('same-name Tashkent mahallas remain independent spatial identities', () => {
  for (const canonical of ['Humoyun', 'Gulobod', "Chamanbog'", 'Olimpiya', 'Sebzor', 'Asalobod']) {
    assert.equal(
      isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'mahalla', canonical }),
      true,
      canonical,
    );
  }

  const ibnSinoMahalla = getGeoEntity('uz:tashkent:mahalla:ibn-sino');
  const ibnSino1 = getGeoEntity('uz:tashkent:local-area:ibn-sino-1');
  assert.deepEqual(ibnSinoMahalla?.osm, { type: 'way', id: 149991108 });
  assert.deepEqual(ibnSino1?.osm, { type: 'way', id: 103249732 });
  assert.notEqual(ibnSinoMahalla?.id, ibnSino1?.id);
});
