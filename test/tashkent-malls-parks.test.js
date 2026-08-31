import test from 'node:test';
import assert from 'node:assert/strict';

import { distanceKm, getGeoEntity } from '../src/index.js';

const entity = (slug) => getGeoEntity(`uz:tashkent:poi:${slug}`);

test('Tashkent official shopping-center set has spatial owners', () => {
  const expected = new Map([
    ['tashkent-city-mall', 'Tashkent City Mall'],
    ['compass-mall', 'Compass Mall'],
    ['next-mall', 'NEXT Mall'],
    ['mega-planet', 'Mega Planet'],
    ['samarkand-darvoza', 'Samarkand Darvoza'],
    ['vega-centre', 'Vega Centre'],
    ['poytaxt-mall', 'Poytaxt Mall'],
    ['depo-mall', 'Depo Mall'],
    ['chimgan-shopping-center', 'Chimgan Shopping Center'],
    ['high-town-mall', 'High Town Mall'],
  ]);

  for (const [slug, canonicalName] of expected) {
    const mall = entity(slug);
    assert.equal(mall?.canonicalName, canonicalName, canonicalName);
    assert.equal(mall?.type, 'poi.shopping_mall', canonicalName);
    assert.ok(Number.isFinite(mall?.center?.lat), canonicalName);
    assert.ok(Number.isFinite(mall?.center?.lng), canonicalName);
  }
});

test('Tashkent verified park canonicals have spatial owners', () => {
  const expected = new Map([
    ['tashkent-city-park', 'Tashkent City Park'],
    ['central-park', 'Central Park Mirzo Ulugbek'],
    ['ecopark', 'Ecopark'],
    ['japanese-garden', 'Japanese Garden'],
    ['alisher-navoi-national-park', 'Alisher Navoi National Park'],
    ['dream-park', 'Dream Park'],
    ['anhor-park', 'Anhor Park'],
    ['lokomotiv-park', 'Lokomotiv Park'],
    ['tashkentland', 'Tashkentland'],
    ['victory-park', 'Victory Park'],
    ['ashgabat-park', 'Ashgabat Park'],
    ['dostlik-park', 'Dostlik Park'],
    ['navruz-park', 'Navruz Park'],
    ['friendship-park', 'Friendship Park'],
    ['furqat-park', 'Furqat Park'],
    ['yakub-kolas-park', 'Yakub Kolas Park'],
    ['yangi-ozbekiston-park', 'Yangi Ozbekiston Park'],
  ]);

  for (const [slug, canonicalName] of expected) {
    const park = entity(slug);
    assert.equal(park?.canonicalName, canonicalName, canonicalName);
    assert.ok(park?.type === 'poi.park' || park?.type === 'poi.amusement_park', canonicalName);
  }
});

test('historical Bobur label no longer owns the Ecopark geometry', () => {
  assert.equal(entity('bobur-park'), null);

  const ecopark = entity('ecopark');
  assert.deepEqual(ecopark?.osm, { type: 'way', id: 1472538448 });
  assert.equal(ecopark?.parentId, 'uz:tashkent:mirzo-ulugbek');
});

test('same-named Dostlik parks remain separate physical places', () => {
  const yashnabad = entity('dostlik-park');
  const formerBobur = entity('friendship-park');

  assert.ok(yashnabad && formerBobur);
  assert.ok(distanceKm(yashnabad.center, formerBobur.center) > 5);
});
