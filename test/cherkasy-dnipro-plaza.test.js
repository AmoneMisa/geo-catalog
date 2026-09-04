import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoChildren } from '../src/index.js';

test('Cherkasy exposes verified Dnipro Plaza shopping landmark', () => {
  const children = getGeoChildren('ua:cherkasy');
  const mall = children.find((entity) => entity.id === 'ua:cherkasy:poi:dnipro-plaza');

  assert.ok(mall);
  assert.equal(mall.type, 'poi.shopping_mall');
  assert.equal(mall.canonicalName, 'Dnipro Plaza');
  assert.equal(mall.parentId, 'ua:cherkasy');
  assert.deepEqual(mall.center, { lat: 49.4345542, lng: 32.0911583 });
  assert.equal(mall.address, 'вул. Припортова, 34');
  assert.equal(mall.officialUrl, 'https://dniproplaza.com/');
});
