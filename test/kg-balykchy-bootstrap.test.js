import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoEntity } from '../src/index.js';

test('Balykchy keeps its canonical city center and OSM administrative provenance', () => {
  const entity = getGeoEntity('kg:balykchy');

  assert.ok(entity);
  assert.equal(entity.type, 'city');
  assert.equal(entity.country, 'KG');
  assert.equal(entity.canonicalName, 'Balykchy');
  assert.deepEqual(entity.center, { lat: 42.46, lng: 76.19 });
  assert.equal(entity.source, 'geonames');
  assert.deepEqual(entity.osm, { type: 'relation', id: 15586036 });
});
