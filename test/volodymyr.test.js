import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getGeoChildren,
  resolveLexiconGeoEntity,
} from '../src/index.js';

test('Volodymyr exposes verified core POIs', () => {
  const children = getGeoChildren('ua:volodymyr');
  const ids = new Set(children.map((entity) => entity.id));

  assert.equal(children.filter((entity) => entity.type.startsWith('poi.')).length, 3);
  assert.ok(ids.has('ua:volodymyr:poi:historical-museum'));
  assert.ok(ids.has('ua:volodymyr:poi:dytynets'));
  assert.ok(ids.has('ua:volodymyr:poi:joachim-and-anne-church'));
});

test('Volodymyr lexicon POI canonicals resolve to geo entities', () => {
  const expected = [
    ['Володимирський історичний музей імені Омеляна Дверницького', 'ua:volodymyr:poi:historical-museum'],
    ['Volodymyr dytynets', 'ua:volodymyr:poi:dytynets'],
    ['Костел святих Йоакима та Анни', 'ua:volodymyr:poi:joachim-and-anne-church'],
  ];

  for (const [canonical, id] of expected) {
    assert.equal(resolveLexiconGeoEntity({
      country: 'UA',
      city: 'Volodymyr',
      type: 'poi',
      canonical,
    })?.id, id);
  }
});
