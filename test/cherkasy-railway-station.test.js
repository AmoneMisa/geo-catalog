import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoChildren } from '../src/index.js';

test('Cherkasy exposes verified railway station', () => {
  const children = getGeoChildren('ua:cherkasy');
  const station = children.find((entity) => entity.id === 'ua:cherkasy:poi:cherkasy-railway-station');

  assert.ok(station);
  assert.equal(station.type, 'poi.railway_station');
  assert.equal(station.canonicalName, 'Cherkasy Railway Station');
  assert.equal(station.parentId, 'ua:cherkasy');
  assert.deepEqual(station.center, { lat: 49.42601, lng: 32.04991 });
  assert.deepEqual(station.osm, { type: 'node', id: 1970581474 });
  assert.equal(station.wikidataId, 'Q1771041');
});
