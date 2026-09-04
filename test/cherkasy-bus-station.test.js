import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoChildren } from '../src/index.js';

test('Cherkasy exposes verified main bus station', () => {
  const children = getGeoChildren('ua:cherkasy');
  const station = children.find((entity) => entity.id === 'ua:cherkasy:poi:cherkasy-bus-station-1');

  assert.ok(station);
  assert.equal(station.type, 'poi.bus_station');
  assert.equal(station.canonicalName, 'Cherkasy Bus Station No. 1');
  assert.equal(station.parentId, 'ua:cherkasy');
  assert.deepEqual(station.center, { lat: 49.40614, lng: 32.017105 });
  assert.equal(station.address, 'вул. Смілянська, 166А');
  assert.equal(station.sourceUrl, 'https://www.blablacar.com.ua/bus/stations/avtovokzal-novyi-cherkasy');
});

test('Cherkasy exposes verified bus station No. 2 beside the railway station', () => {
  const children = getGeoChildren('ua:cherkasy');
  const station = children.find((entity) => entity.id === 'ua:cherkasy:poi:cherkasy-bus-station-2');

  assert.ok(station);
  assert.equal(station.type, 'poi.bus_station');
  assert.equal(station.canonicalName, 'Cherkasy Bus Station No. 2');
  assert.equal(station.parentId, 'ua:cherkasy');
  assert.deepEqual(station.center, { lat: 49.4269086050262, lng: 32.0504368249179 });
  assert.equal(station.address, 'вул. Володимира Ложешнікова, 7');
  assert.equal(station.sourceUrl, 'https://autofort.net/directions/cherkasi-lodz');
});

test('Cherkasy exposes verified bus station No. 3', () => {
  const children = getGeoChildren('ua:cherkasy');
  const station = children.find((entity) => entity.id === 'ua:cherkasy:poi:cherkasy-bus-station-3');

  assert.ok(station);
  assert.equal(station.type, 'poi.bus_station');
  assert.equal(station.canonicalName, 'Cherkasy Bus Station No. 3');
  assert.equal(station.parentId, 'ua:cherkasy');
  assert.deepEqual(station.center, { lat: 49.438147, lng: 32.065858 });
  assert.equal(station.address, 'вул. Гоголя, 293');
  assert.equal(station.sourceUrl, 'https://www.blablacar.com.ua/bus/stations/avtostantsiia-cherkasy-3');
});

test('Cherkasy exposes verified Autoexpress bus station', () => {
  const children = getGeoChildren('ua:cherkasy');
  const station = children.find((entity) => entity.id === 'ua:cherkasy:poi:cherkasy-autoexpress-bus-station');

  assert.ok(station);
  assert.equal(station.type, 'poi.bus_station');
  assert.equal(station.canonicalName, 'Cherkasy Autoexpress Bus Station');
  assert.equal(station.parentId, 'ua:cherkasy');
  assert.deepEqual(station.center, { lat: 49.438522, lng: 32.071464 });
  assert.equal(station.address, 'вул. Митницька, 7/2');
  assert.equal(station.sourceUrl, 'https://www.blablacar.com.ua/bus/stations/avtovokzal-avtoekspres-cherkasy');
});
