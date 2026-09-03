import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getGeoChildren,
  resolveLexiconGeoEntity,
} from '../src/index.js';

test('Volodymyr exposes verified core POIs', () => {
  const children = getGeoChildren('ua:volodymyr');
  const ids = new Set(children.map((entity) => entity.id));

  assert.equal(children.filter((entity) => entity.type.startsWith('poi.')).length, 5);
  assert.ok(ids.has('ua:volodymyr:poi:historical-museum'));
  assert.ok(ids.has('ua:volodymyr:poi:dytynets'));
  assert.ok(ids.has('ua:volodymyr:poi:joachim-and-anne-church'));
  assert.ok(ids.has('ua:volodymyr:poi:dormition-cathedral'));
  assert.ok(ids.has('ua:volodymyr:poi:st-basil-rotunda'));
});

test('Volodymyr lexicon POI canonicals resolve to geo entities', () => {
  const expected = [
    ['Володимирський історичний музей імені Омеляна Дверницького', 'ua:volodymyr:poi:historical-museum'],
    ['Volodymyr dytynets', 'ua:volodymyr:poi:dytynets'],
    ['Костел святих Йоакима та Анни', 'ua:volodymyr:poi:joachim-and-anne-church'],
    ['Свято-Успенський кафедральний собор', 'ua:volodymyr:poi:dormition-cathedral'],
    ['Свято-Василівська церква-ротонда', 'ua:volodymyr:poi:st-basil-rotunda'],
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
