import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

test('reviewed Kyiv boulevard retains representative OSM way provenance', () => {
  const entity = getGeoEntity('ua:kyiv:street:tarasa-shevchenko-boulevard');
  assert.ok(entity);
  assert.equal(entity.type, 'street');
  assert.equal(entity.country, 'UA');
  assert.equal(entity.canonicalName, 'бульвар Тараса Шевченко');
  assert.equal(entity.parentId, 'ua:kyiv');
  assert.deepEqual(entity.center, { lat: 50.4442305, lng: 30.5078918 });
  assert.equal(entity.source, 'osm');
  assert.equal(entity.sourceUrl, 'https://www.openstreetmap.org/way/895868109');
  assert.deepEqual(entity.osm, { type: 'way', id: 895868109 });
});

test('non-street Kyiv scrape hits remain excluded from street owners', () => {
  for (const id of [
    'ua:kyiv:street:centralna-mirotske',
    'ua:kyiv:street:kontraktova-square',
    'ua:kyiv:street:mykhailivska-square',
    'ua:kyiv:street:kyiv-airport',
    'ua:kyiv:street:kyiv-zoo',
  ]) {
    assert.equal(getGeoEntity(id), null, id);
  }
});
