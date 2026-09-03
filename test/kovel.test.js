import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getGeoChildren,
  resolveLexiconGeoEntity,
} from '../src/index.js';

test('Kovel exposes verified core POIs', () => {
  const children = getGeoChildren('ua:kovel');
  const ids = new Set(children.map((entity) => entity.id));

  assert.equal(children.filter((entity) => entity.type.startsWith('poi.')).length, 2);
  assert.ok(ids.has('ua:kovel:poi:railway-station'));
  assert.ok(ids.has('ua:kovel:poi:lesya-ukrainka-park'));
});

test('Kovel lexicon POI canonicals resolve to geo entities', () => {
  const expected = [
    ['Kovel Railway Station', 'ua:kovel:poi:railway-station'],
    ['Lesya Ukrainka Park', 'ua:kovel:poi:lesya-ukrainka-park'],
  ];

  for (const [canonical, id] of expected) {
    assert.equal(resolveLexiconGeoEntity({
      country: 'UA',
      city: 'Kovel',
      type: 'poi',
      canonical,
    })?.id, id);
  }
});
