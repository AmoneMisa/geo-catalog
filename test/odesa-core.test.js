import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getGeoEntity,
  resolveLexiconGeoEntity,
} from '../src/index.js';

test('Odesa current administrative districts have canonical spatial owners', () => {
  const expected = new Map([
    ['Prymorskyi', 'ua:odesa:district:prymorskyi'],
    ['Kyivskyi', 'ua:odesa:district:kyivskyi'],
    ['Khadzhybeiskyi', 'ua:odesa:district:khadzhybeiskyi'],
    ['Peresypskyi', 'ua:odesa:district:peresypskyi'],
  ]);

  for (const [canonical, id] of expected) {
    assert.equal(resolveLexiconGeoEntity({ country: 'UA', city: 'Odesa', type: 'district', canonical })?.id, id);
    assert.equal(getGeoEntity(id)?.parentId, 'ua:odesa');
  }
});

test('Odesa existing microdistrict canonicals resolve deterministically', () => {
  const expected = new Map([
    ['Tairova', 'ua:odesa:microdistrict:tairova'],
    ['Cheryomushky', 'ua:odesa:microdistrict:cheremushky'],
    ['Moldavanka', 'ua:odesa:microdistrict:moldavanka'],
    ['Peresyp', 'ua:odesa:microdistrict:peresyp'],
    ['Luzanivka', 'ua:odesa:microdistrict:luzanivka'],
    ['Chornomorka', 'ua:odesa:microdistrict:chornomorka'],
    ['Dacha Kovalevskoho', 'ua:odesa:microdistrict:dacha-kovalevskoho'],
    ['Blyzhni Mlyny', 'ua:odesa:microdistrict:blyzhni-mlyny'],
    ['Dalni Mlyny', 'ua:odesa:microdistrict:dalni-mlyny'],
  ]);

  for (const [canonical, id] of expected) {
    assert.equal(resolveLexiconGeoEntity({ country: 'UA', city: 'Odesa', type: 'microdistrict', canonical })?.id, id);
  }
});

test('Odesa existing landmark canonicals reuse their physical POI owners', () => {
  assert.equal(
    resolveLexiconGeoEntity({ country: 'UA', city: 'Odesa', type: 'poi', canonical: 'Riviera Mall' })?.id,
    'ua:odesa:poi:riviera-shopping-city',
  );
  assert.equal(
    resolveLexiconGeoEntity({ country: 'UA', city: 'Odesa', type: 'poi', canonical: 'Pivdennyi Market' })?.id,
    'ua:odesa:poi:pivdennyi-market',
  );
});
