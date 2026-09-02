import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/index.js';

const owners = Object.freeze([
  ['ua:ivano-frankivsk:microdistrict:pasichna', 'node', 2916052026],
  ['ua:ivano-frankivsk:microdistrict:bam', 'node', 2959363634],
  ['ua:ivano-frankivsk:microdistrict:kaskad', 'way', 795691238],
  ['ua:ivano-frankivsk:microdistrict:pozitron', 'node', 2959363641],
  ['ua:ivano-frankivsk:microdistrict:knyahynyn', 'node', 4056909194],
  ['ua:ivano-frankivsk:microdistrict:vovchynets', 'relation', 2362665],
  ['ua:ivano-frankivsk:microdistrict:opryshivtsi', 'node', 2916052025],
  ['ua:ivano-frankivsk:microdistrict:sofiivka', 'node', 2916052027],
  ['ua:ivano-frankivsk:microdistrict:maizli', 'node', 3518426593],
  ['ua:ivano-frankivsk:microdistrict:braty', 'node', 2959363635],
  ['ua:ivano-frankivsk:microdistrict:hirka', 'node', 4056909192],
  ['ua:ivano-frankivsk:residential-complex:manhattan-up', 'way', 1227525616],
  ['ua:ivano-frankivsk:poi:ratusha', 'way', 88299213],
  ['ua:ivano-frankivsk:poi:vichevyi-maidan', 'node', 11229865506],
  ['ua:ivano-frankivsk:poi:rynok-square', 'relation', 5138736],
  ['ua:ivano-frankivsk:poi:bastion', 'way', 292382305],
  ['ua:ivano-frankivsk:poi:potocki-palace', 'way', 1167087137],
]);

test('Ivano-Frankivsk uploaded report owners are persisted with stable OSM identity', () => {
  for (const [id, type, osmId] of owners) {
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.deepEqual(entity.osm, { type, id: osmId }, id);
  }
});

test('Ivano-Frankivsk false report substitutions are not persisted', () => {
  assert.equal(getGeoEntity('ua:ivano-frankivsk:microdistrict:tsentr'), null);
  assert.equal(getGeoEntity('ua:ivano-frankivsk:poi:shevchenko-park'), null);
  assert.notEqual(getGeoEntity('ua:ivano-frankivsk:poi:bastion')?.osm?.id, 3804634175, 'Bastion bus stop');
  assert.equal(getGeoEntity('ua:ivano-frankivsk:residential-complex:manhattan'), null);
});
