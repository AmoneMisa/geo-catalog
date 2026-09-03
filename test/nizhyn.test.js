import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getGeoChildren,
  resolveLexiconGeoEntity,
} from '../src/index.js';

test('Nizhyn exposes verified core POIs', () => {
  const children = getGeoChildren('ua:nizhyn');
  const ids = new Set(children.map((entity) => entity.id));

  assert.equal(children.filter((entity) => entity.type.startsWith('poi.')).length, 5);
  assert.ok(ids.has('ua:nizhyn:poi:railway-station'));
  assert.ok(ids.has('ua:nizhyn:poi:local-history-museum'));
  assert.ok(ids.has('ua:nizhyn:poi:post-station-museum'));
  assert.ok(ids.has('ua:nizhyn:poi:mykola-gogol-state-university'));
  assert.ok(ids.has('ua:nizhyn:poi:st-nicholas-cathedral'));
});

test('Nizhyn lexicon POI canonicals resolve to geo entities', () => {
  const expected = [
    ['Nizhyn Railway Station', 'ua:nizhyn:poi:railway-station'],
    ['Ніжинський краєзнавчий музей імені Івана Спаського', 'ua:nizhyn:poi:local-history-museum'],
    ['Ніжинська поштова станція', 'ua:nizhyn:poi:post-station-museum'],
    ['Ніжинський державний університет імені Миколи Гоголя', 'ua:nizhyn:poi:mykola-gogol-state-university'],
    ['Свято-Миколаївський кафедральний собор', 'ua:nizhyn:poi:st-nicholas-cathedral'],
  ];

  for (const [canonical, id] of expected) {
    assert.equal(resolveLexiconGeoEntity({
      country: 'UA',
      city: 'Nizhyn',
      type: 'poi',
      canonical,
    })?.id, id);
  }
});
