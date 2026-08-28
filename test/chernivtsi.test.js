import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getGeoChildren,
  resolveLexiconGeoEntity,
} from '../src/index.js';

test('Chernivtsi lexicon microdistrict canonicals resolve to spatial entities', () => {
  const microdistricts = getGeoChildren('ua:chernivtsi').filter((entity) => entity.type === 'microdistrict');
  assert.equal(microdistricts.length, 13);

  const expected = new Map([
    ['Kalichanka', 'ua:chernivtsi:microdistrict:kalichanka'],
    ['Sadgora', 'ua:chernivtsi:microdistrict:sadhora'],
    ['Roscha', 'ua:chernivtsi:microdistrict:rosha'],
    ['Pivdenno-Kiltseva', 'ua:chernivtsi:microdistrict:pivdenno-kiltseva'],
  ]);

  for (const [canonical, id] of expected) {
    assert.equal(resolveLexiconGeoEntity({ country: 'UA', city: 'Chernivtsi', type: 'microdistrict', canonical })?.id, id);
  }
});

test('Chernivtsi residential and landmark canonicals resolve deterministically', () => {
  assert.equal(
    resolveLexiconGeoEntity({ country: 'UA', city: 'Chernivtsi', type: 'residential_complex', canonical: 'Comfort Hall' })?.id,
    'ua:chernivtsi:residential:comfort-hall',
  );
  assert.equal(
    resolveLexiconGeoEntity({ country: 'UA', city: 'Chernivtsi', type: 'poi', canonical: 'Chernivtsi University' })?.id,
    'ua:chernivtsi:poi:chernivtsi-university',
  );
  assert.equal(
    resolveLexiconGeoEntity({ country: 'UA', city: 'Chernivtsi', type: 'poi', canonical: 'City Hall' })?.id,
    'ua:chernivtsi:poi:city-hall',
  );
});
