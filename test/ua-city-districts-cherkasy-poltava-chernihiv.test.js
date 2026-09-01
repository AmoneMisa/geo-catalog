import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoChildren } from '../src/index.js';

const expected = new Map([
  ['ua:cherkasy', ['Prydniprovskyi', 'Sosnivskyi']],
  ['ua:poltava', ['Kyivskyi', 'Podilskyi', 'Shevchenkivskyi']],
  ['ua:chernihiv', ['Desnianskyi', 'Novozavodskyi']],
]);

const districts = (cityId) => getGeoChildren(cityId, { type: 'district' });

test('Cherkasy, Poltava and Chernihiv expose complete current district sets', () => {
  for (const [cityId, names] of expected) {
    assert.deepEqual(
      districts(cityId).map(({ canonicalName }) => canonicalName).sort(),
      [...names].sort(),
      cityId,
    );
  }
});

test('new district entities expose representative centers and provenance', () => {
  for (const cityId of expected.keys()) {
    for (const entity of districts(cityId)) {
      assert.equal(entity.accuracy, 'district', entity.id);
      assert.ok(Number.isFinite(entity.center?.lat), `${entity.id} latitude`);
      assert.ok(Number.isFinite(entity.center?.lng), `${entity.id} longitude`);
      assert.ok(Number.isFinite(entity.accuracyM) && entity.accuracyM > 0, `${entity.id} accuracyM`);
      assert.ok(entity.osm || entity.wikidataId || entity.sourceUrl, `${entity.id} provenance`);
    }
  }
});

test('historical Poltava district names are not current spatial canonicals', () => {
  const names = districts('ua:poltava').map(({ canonicalName }) => canonicalName);
  assert.equal(names.includes('Leninskyi'), false);
  assert.equal(names.includes('Oktiabrskyi'), false);
  assert.equal(names.includes('Zhovtnevyi'), false);
});
