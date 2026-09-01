import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoChildren, resolveLexiconGeoEntity } from '../src/index.js';

const districtNames = (cityId) => getGeoChildren(cityId)
  .filter((entity) => entity.type === 'district')
  .map((entity) => entity.canonicalName)
  .sort();

test('Kropyvnytskyi and Sumy expose their complete current city district sets', () => {
  assert.deepEqual(districtNames('ua:kropyvnytskyi'), ['Fortechnyi', 'Podilskyi']);
  assert.deepEqual(districtNames('ua:sumy'), ['Kovpakivskyi', 'Zarichnyi']);
});

test('Kropyvnytskyi and Sumy district canonicals resolve through the lexicon bridge', () => {
  const expected = [
    ['Kropyvnytskyi', 'Podilskyi', 'ua:kropyvnytskyi:district:podilskyi'],
    ['Kropyvnytskyi', 'Fortechnyi', 'ua:kropyvnytskyi:district:fortechnyi'],
    ['Sumy', 'Kovpakivskyi', 'ua:sumy:district:kovpakivskyi'],
    ['Sumy', 'Zarichnyi', 'ua:sumy:district:zarichnyi'],
  ];

  for (const [city, canonical, id] of expected) {
    const entity = resolveLexiconGeoEntity({ country: 'UA', city, type: 'district', canonical });
    assert.equal(entity?.id, id);
    assert.equal(entity?.accuracy, 'district');
    assert.ok(entity?.center?.lat && entity?.center?.lng);
  }
});

test('historical district names are aliases only, not duplicate spatial canonicals', () => {
  const canonicals = new Set([
    ...districtNames('ua:kropyvnytskyi'),
    ...districtNames('ua:sumy'),
  ]);
  for (const stale of ['Leninskyi', 'Kirovskyi']) assert.equal(canonicals.has(stale), false);
});
