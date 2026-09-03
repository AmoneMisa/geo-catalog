import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoChildren } from '../src/index.js';

test('Sumy exposes verified Eurobazar shopping landmark', () => {
  const children = getGeoChildren('ua:sumy');
  const eurobazar = children.find((entity) => entity.id === 'ua:sumy:poi:eurobazar');

  assert.ok(eurobazar);
  assert.equal(eurobazar.type, 'poi.shopping_mall');
  assert.equal(eurobazar.canonicalName, 'Eurobazar');
  assert.equal(eurobazar.parentId, 'ua:sumy');
  assert.deepEqual(eurobazar.center, { lat: 50.914747915237015, lng: 34.7957969519494 });
  assert.equal(eurobazar.officialUrl, 'https://visit.sumy.ua/evrobazar/');
});
