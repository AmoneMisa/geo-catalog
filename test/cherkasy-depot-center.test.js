import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoChildren } from '../src/index.js';

test("Cherkasy exposes verified DEPO't Center shopping landmark", () => {
  const children = getGeoChildren('ua:cherkasy');
  const mall = children.find((entity) => entity.id === 'ua:cherkasy:poi:depot-center');

  assert.ok(mall);
  assert.equal(mall.type, 'poi.shopping_mall');
  assert.equal(mall.canonicalName, "DEPO't Center");
  assert.equal(mall.parentId, 'ua:cherkasy');
  assert.deepEqual(mall.center, { lat: 49.424326, lng: 32.096051 });
  assert.equal(mall.address, 'бульвар Шевченка, 385');
  assert.equal(mall.officialUrl, 'https://depotcenter.com.ua/');
});
