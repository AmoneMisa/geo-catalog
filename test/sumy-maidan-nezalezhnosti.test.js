import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoChildren } from '../src/index.js';

test('Sumy exposes verified Maidan Nezalezhnosti square', () => {
  const children = getGeoChildren('ua:sumy');
  const square = children.find((entity) => entity.id === 'ua:sumy:poi:maidan-nezalezhnosti');

  assert.ok(square);
  assert.equal(square.type, 'poi.square');
  assert.equal(square.canonicalName, 'Майдан Незалежності');
  assert.equal(square.parentId, 'ua:sumy');
  assert.deepEqual(square.center, { lat: 50.9120172, lng: 34.8028851 });
  assert.equal(square.officialUrl, 'https://smr.gov.ua/en/misto/gostyam-mista.html');
});
