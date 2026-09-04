import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoChildren } from '../src/index.js';

test('Sumy exposes verified meat processing plant landmark', () => {
  const children = getGeoChildren('ua:sumy');
  const plant = children.find((entity) => entity.id === 'ua:sumy:poi:sumy-meat-processing-plant');

  assert.ok(plant);
  assert.equal(plant.type, 'poi.landmark');
  assert.equal(plant.canonicalName, "Сумський м'ясокомбінат");
  assert.equal(plant.parentId, 'ua:sumy');
  assert.deepEqual(plant.center, { lat: 50.89667591992915, lng: 34.83235390647599 });
  assert.equal(plant.address, 'вул. Харківська, 103');
  assert.equal(plant.registryUrl, 'https://opendatabot.ua/c/05496017');
});
