import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

test('renamed Manas city keeps the stable Jalal-Abad geo id', () => {
  const city = getGeoEntity('kg:jalal-abad');
  assert.ok(city);
  assert.equal(city.type, 'city');
  assert.equal(city.country, 'KG');
  assert.equal(city.canonicalName, 'Manas');
  assert.deepEqual(city.center, { lat: 40.94498117, lng: 72.99313177 });
  assert.equal(city.source, 'geonames');
  assert.equal(city.sourceUrl, 'https://www.geonames.org/advanced-search.html?country=KG&q=Manas');
  assert.equal(city.accuracy, 'city');
});

test('city rename does not create a duplicate Manas geo id', () => {
  assert.equal(getGeoEntity('kg:manas'), null);
});
