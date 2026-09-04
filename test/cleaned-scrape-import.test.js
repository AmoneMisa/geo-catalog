import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const expected = Object.freeze([
  ['kz:almaty:residential:esentai-city', 'residential_complex', 'kz:almaty', 'KZ'],
  ['kz:astana:residential:grand-opera', 'residential_complex', 'kz:astana', 'KZ'],
  ['kz:aktobe:microdistrict:11-i-mikroraion', 'microdistrict', 'kz:aktobe', 'KZ'],
  ['kz:karaganda:microdistrict:stepnoi-1', 'microdistrict', 'kz:karaganda', 'KZ'],
  ['kz:shymkent:residential:asar-city', 'residential_complex', 'kz:shymkent', 'KZ'],
  ['kz:taraz:street:prospekt-zhambyla', 'street', 'kz:taraz', 'KZ'],
  ['kg:bishkek:microdistrict:asanbai', 'microdistrict', 'kg:bishkek', 'KG'],
  ['ua:chernihiv:residential:masani', 'residential_complex', 'ua:chernihiv', 'UA'],
]);

test('cleaned scrape import exposes representative canonical geo entities', () => {
  for (const [id, type, parentId, country] of expected) {
    const entity = getGeoEntity(id);
    assert.ok(entity, `${id} should exist`);
    assert.equal(entity.type, type);
    assert.equal(entity.parentId, parentId);
    assert.equal(entity.country, country);
    assert.ok(Number.isFinite(entity.center.lat));
    assert.ok(Number.isFinite(entity.center.lng));
  }
});
