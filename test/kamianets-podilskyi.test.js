import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getGeoChildren,
  resolveLexiconGeoEntity,
} from '../src/index.js';

test('Kamianets-Podilskyi exposes verified core POIs', () => {
  const children = getGeoChildren('ua:kamianets-podilskyi');
  const ids = new Set(children.map((entity) => entity.id));

  assert.equal(children.filter((entity) => entity.type.startsWith('poi.')).length, 4);
  assert.ok(ids.has('ua:kamianets-podilskyi:poi:old-castle'));
  assert.ok(ids.has('ua:kamianets-podilskyi:poi:polskyi-rynok-square'));
  assert.ok(ids.has('ua:kamianets-podilskyi:poi:armenian-market-square'));
  assert.ok(ids.has('ua:kamianets-podilskyi:poi:railway-station'));
});

test('Kamianets-Podilskyi lexicon POI canonicals resolve to geo entities', () => {
  const expected = [
    ['Old Castle', 'ua:kamianets-podilskyi:poi:old-castle'],
    ['Polskyi Rynok Square', 'ua:kamianets-podilskyi:poi:polskyi-rynok-square'],
    ['Armenian Market Square', 'ua:kamianets-podilskyi:poi:armenian-market-square'],
    ['Kamianets-Podilskyi Railway Station', 'ua:kamianets-podilskyi:poi:railway-station'],
  ];

  for (const [canonical, id] of expected) {
    assert.equal(resolveLexiconGeoEntity({
      country: 'UA',
      city: 'Kamianets-Podilskyi',
      type: 'poi',
      canonical,
    })?.id, id);
  }
});
