import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoChildren } from '../src/index.js';

test('Sumy exposes verified railway station landmark', () => {
  const children = getGeoChildren('ua:sumy');
  const station = children.find((entity) => entity.id === 'ua:sumy:poi:railway-station');

  assert.ok(station);
  assert.equal(station.type, 'poi.landmark');
  assert.equal(station.canonicalName, 'Sumy Railway Station');
  assert.equal(station.wikidataId, 'Q9348123');
  assert.equal(station.parentId, 'ua:sumy');
});
