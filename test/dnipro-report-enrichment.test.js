import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/index.js';

const owners = Object.freeze([
  ['ua:dnipro:microdistrict:odynkivka', 'way', 973162877],
  ['ua:dnipro:microdistrict:pokrovskyi', 'relation', 13309107],
  ['ua:dnipro:microdistrict:parus', 'relation', 3688209],
  ['ua:dnipro:residential-complex:nebo', 'way', 1225643418],
  ['ua:dnipro:residential-complex:west-hall', 'way', 887478103],
  ['ua:dnipro:street:oleksandra-polia-avenue', 'way', 987361685],
  ['ua:dnipro:street:naberezhna-peremohy', 'way', 843985207],
]);

test('Dnipro report-derived entities keep stable physical owners', () => {
  for (const [id, type, osmId] of owners) {
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.deepEqual(entity.osm, { type, id: osmId }, id);
  }
});

test('Dnipro report does not turn Haharina street evidence into a neighborhood owner', () => {
  assert.equal(getGeoEntity('ua:dnipro:microdistrict:haharina'), null);
});
