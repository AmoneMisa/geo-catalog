import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getGeoChildren,
  resolveLexiconGeoEntity,
} from '../src/index.js';

test('Drohobych exposes verified core POIs', () => {
  const children = getGeoChildren('ua:drohobych');
  const ids = new Set(children.map((entity) => entity.id));

  assert.equal(children.filter((entity) => entity.type.startsWith('poi.')).length, 3);
  assert.ok(ids.has('ua:drohobych:poi:st-georges-church'));
  assert.ok(ids.has('ua:drohobych:poi:saltworks'));
  assert.ok(ids.has('ua:drohobych:poi:railway-station'));
});

test('Drohobych lexicon POI canonicals resolve to geo entities', () => {
  const expected = [
    ["St. George's Church", 'ua:drohobych:poi:st-georges-church'],
    ['Drohobych Saltworks', 'ua:drohobych:poi:saltworks'],
    ['Drohobych Railway Station', 'ua:drohobych:poi:railway-station'],
  ];

  for (const [canonical, id] of expected) {
    assert.equal(resolveLexiconGeoEntity({
      country: 'UA',
      city: 'Drohobych',
      type: 'poi',
      canonical,
    })?.id, id);
  }
});
