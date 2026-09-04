import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoChildren } from '../src/index.js';

test('Sumy exposes verified central bus station', () => {
  const children = getGeoChildren('ua:sumy');
  const station = children.find((entity) => entity.id === 'ua:sumy:poi:sumy-bus-station');

  assert.ok(station);
  assert.equal(station.type, 'poi.bus_station');
  assert.equal(station.canonicalName, 'Sumy Bus Station');
  assert.equal(station.parentId, 'ua:sumy');
  assert.deepEqual(station.center, { lat: 50.915239, lng: 34.769543 });
  assert.equal(station.address, 'вул. Степана Бандери, 40');
  assert.equal(station.officialUrl, 'https://bus.sumy.ua/');
});
