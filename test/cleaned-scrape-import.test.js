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
  ['ua:kyiv:residential:krister-hrad', 'residential_complex', 'ua:kyiv', 'UA'],
  ['ua:kyiv:residential:edelweiss-house', 'residential_complex', 'ua:kyiv', 'UA'],
  ['ua:kyiv:residential:nyvky-plaza', 'residential_complex', 'ua:kyiv', 'UA'],
  ['ua:kyiv:residential:parkova-vezha', 'residential_complex', 'ua:kyiv', 'UA'],
  ['ua:dnipro:residential-complex:pikhtovyi', 'residential_complex', 'ua:dnipro', 'UA'],
  ['ua:dnipro:residential-complex:atlant', 'residential_complex', 'ua:dnipro', 'UA'],
  ['ua:dnipro:residential-complex:lighthouse', 'residential_complex', 'ua:dnipro', 'UA'],
  ['ua:dnipro:residential-complex:ptakhy', 'residential_complex', 'ua:dnipro', 'UA'],
  ['ua:odesa:residential-complex:arc-palace', 'residential_complex', 'ua:odesa', 'UA'],
  ['ua:odesa:residential-complex:club-marine', 'residential_complex', 'ua:odesa', 'UA'],
  ['ua:odesa:residential-complex:7-pearl', 'residential_complex', 'ua:odesa', 'UA'],
  ['ua:odesa:residential-complex:8-pearl', 'residential_complex', 'ua:odesa', 'UA'],
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

test('cleaned scrape import does not duplicate known Chernihiv Masany as a residential complex', () => {
  assert.equal(getGeoEntity('ua:chernihiv:residential:masani'), null);
  assert.equal(getGeoEntity('ua:chernihiv:microdistrict:masany')?.canonicalName, 'Masany');
});

test('cleaned Odesa import does not force surrounding settlements into Odesa residential scope', () => {
  assert.equal(getGeoEntity('ua:odesa:residential-complex:green-cape'), null);
  assert.equal(getGeoEntity('ua:odesa:residential-complex:21-pearl'), null);
  assert.equal(getGeoEntity('ua:odesa:residential-complex:columbus'), null);
});

test('cleaned Kyiv import keeps surrounding settlements outside Kyiv residential scope', () => {
  assert.equal(getGeoEntity('ua:kyiv:residential:desna-residence'), null);
  assert.equal(getGeoEntity('ua:kyiv:residential:sofia-residence'), null);
  assert.equal(getGeoEntity('ua:kyiv:residential:petropavlivskyi-posad'), null);
  assert.equal(getGeoEntity('ua:kyiv:residential:avia-kvartal'), null);
  assert.equal(getGeoEntity('ua:kyiv:residential:country-townhouse'), null);
});
