import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/index.js';

const owners = Object.freeze([
  ['ua:kherson:microdistrict:tsentr', 'node', 9402413514],
  ['ua:kherson:microdistrict:khbk', 'relation', 4487768],
  ['ua:kherson:residential-complex:european', 'way', 1166510924],
  ['ua:kryvyi-rih:microdistrict:95-kvartal', 'way', 124897028],
  ['ua:kryvyi-rih:microdistrict:sotsmisto', 'node', 5001108365],
  ['ua:kryvyi-rih:microdistrict:skhidnyi', 'node', 13701134152],
  ['ua:kryvyi-rih:microdistrict:zarichnyi', 'node', 13135135126],
  ['ua:kryvyi-rih:microdistrict:hirnytskyi', 'way', 648167098],
  ['ua:kryvyi-rih:poi:heroes-park', 'way', 124904286],
  ['ua:kryvyi-rih:poi:botanical-garden', 'way', 432919992],
  ['ua:kryvyi-rih:poi:flower-clock', 'way', 127806414],
]);

test('Kherson and Kryvyi Rih report-derived owners keep stable OSM identity', () => {
  for (const [id, type, osmId] of owners) {
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.deepEqual(entity.osm, { type, id: osmId }, id);
  }
});

test('known Kherson false residential substitutions are not persisted', () => {
  assert.equal(getGeoEntity('ua:kherson:residential-complex:tavriiskyi'), null);
  assert.equal(getGeoEntity('ua:kherson:residential-complex:suvorovskyi'), null);
  assert.equal(getGeoEntity('ua:kherson:residential-complex:raiduzhnyi'), null);
});
