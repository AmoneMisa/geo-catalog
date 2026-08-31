import test from 'node:test';
import assert from 'node:assert/strict';

import { TASHKENT_POI_ENTITIES } from '../src/data/uz/tashkent/poi.js';

const byCanonical = new Map(TASHKENT_POI_ENTITIES.map((entry) => [entry.canonicalName, entry]));

test('Tashkent core mall expansion has spatial anchors', () => {
  for (const canonical of [
    'Anhor Park Mall',
    'Riviera Mall',
    'NEXT Mall',
    'Parus Mall',
    'Depo Mall',
    'Vega Centre',
    'Yunusabad Gallery',
    'Poytaxt Mall',
    'Alfraganus Mall',
    'High Town Mall',
    'Seoul Mun Mall',
    'Ecobozor',
    'Chimgan Shopping Center',
  ]) {
    const entry = byCanonical.get(canonical);
    assert.ok(entry, canonical);
    assert.equal(entry.type, 'poi.shopping_mall', canonical);
    assert.ok(Number.isFinite(entry.center?.lat), `${canonical} latitude`);
    assert.ok(Number.isFinite(entry.center?.lng), `${canonical} longitude`);
  }
});

test('Tashkent park expansion has spatial anchors', () => {
  for (const canonical of [
    'Ecopark',
    'Japanese Garden',
    'Alisher Navoi National Park',
    'Dream Park',
    'Anhor Lokomotiv Park',
    'Tashkentland',
    'Victory Park',
    'Ashgabat Park',
    'Dostlik Park',
    'Navruz Park',
    'Furqat Park',
    'Yakub Kolas Park',
    'Yangi Ozbekiston Park',
    'Tashkent Botanical Garden',
  ]) {
    const entry = byCanonical.get(canonical);
    assert.ok(entry, canonical);
    assert.match(entry.type, /^poi\.(?:park|amusement_park)$/, canonical);
  }
});

test('Tashkent POIs keep current physical canonicals', () => {
  assert.ok(byCanonical.has('Samarqand Darvoza'));
  assert.equal(byCanonical.has('Samarkand Darvoza'), false);
  assert.equal(byCanonical.has('Bobur Park'), false);
  assert.notEqual(byCanonical.get('Ecopark')?.id, byCanonical.get('Dostlik Park')?.id);
  assert.notEqual(byCanonical.get('Anhor Park Mall')?.id, byCanonical.get('Anhor Lokomotiv Park')?.id);
});
