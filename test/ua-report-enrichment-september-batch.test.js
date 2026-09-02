import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/index.js';

const owners = Object.freeze([
  ['ua:ternopil:microdistrict:bam', 'way', 327955988],
  ['ua:ternopil:microdistrict:tsentr', 'way', 327955095],
  ['ua:ternopil:poi:ternopil-pond', 'relation', 3231809],
  ['ua:ternopil:poi:national-revival-park', 'way', 31016220],
  ['ua:uzhhorod:microdistrict:bozdosh', 'node', 6516279720],
  ['ua:uzhhorod:microdistrict:domanyntsi', 'relation', 12940458],
  ['ua:uzhhorod:poi:uzhhorod-castle', 'relation', 15762897],
  ['ua:uzhhorod:poi:pedestrian-bridge', 'relation', 12992982],
  ['ua:vinnytsia:microdistrict:urozhai', 'node', 13795975856],
  ['ua:vinnytsia:microdistrict:koreia', 'node', 7807632123],
  ['ua:vinnytsia:poi:vyshenske-lake', 'way', 33826716],
  ['ua:zaporizhzhia:microdistrict:baburka', 'node', 8711973115],
  ['ua:zaporizhzhia:microdistrict:pavlo-kychkas', 'node', 8708705712],
  ['ua:zaporizhzhia:poi:dniprohes', 'way', 113308943],
  ['ua:zaporizhzhia:poi:city-mall', 'way', 199519495],
  ['ua:zhytomyr:microdistrict:bohuniia', 'relation', 12196948],
  ['ua:zhytomyr:microdistrict:smolianka', 'relation', 15569479],
  ['ua:zhytomyr:microdistrict:promavtomatyka', 'relation', 12196965],
]);

test('uploaded UA reports are represented by stable physical OSM owners', () => {
  for (const [id, osmType, osmId] of owners) {
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.deepEqual(entity.osm, { type: osmType, id: osmId }, id);
  }
});

test('known false report substitutions are not persisted as canonical owners', () => {
  assert.notEqual(getGeoEntity('ua:ternopil:poi:national-revival-park')?.osm?.id, 9898051909, 'Ternopil bus stop');
  assert.notEqual(getGeoEntity('ua:zaporizhzhia:poi:dniprohes')?.osm?.id, 1026369790, 'DniproHES bus stop');
  assert.notEqual(getGeoEntity('ua:zaporizhzhia:poi:city-mall')?.osm?.id, 199519500, 'City Mall parking');
});
