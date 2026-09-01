import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoChildren, resolveLexiconGeoEntity } from '../src/index.js';

test('Zhytomyr exposes exactly its two current administrative districts', () => {
  const districts = getGeoChildren('ua:zhytomyr').filter((entity) => entity.type === 'district');
  assert.deepEqual(districts.map((entity) => entity.canonicalName).sort(), ['Bohunskyi', 'Korolovskyi']);

  for (const entity of districts) {
    assert.equal(entity.parentId, 'ua:zhytomyr');
    assert.equal(entity.accuracy, 'district');
    assert.ok(entity.center?.lat && entity.center?.lng);
  }
});

test('Zhytomyr district canonicals resolve through the lexicon bridge', () => {
  assert.equal(
    resolveLexiconGeoEntity({ country: 'UA', city: 'Zhytomyr', type: 'district', canonical: 'Bohunskyi' })?.id,
    'ua:zhytomyr:district:bohunskyi',
  );
  assert.equal(
    resolveLexiconGeoEntity({ country: 'UA', city: 'Zhytomyr', type: 'district', canonical: 'Korolovskyi' })?.id,
    'ua:zhytomyr:district:korolovskyi',
  );
});
