import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getGeoChildren,
  resolveLexiconGeoEntity,
} from '../src/index.js';

test('Pryluky exposes verified core POIs', () => {
  const children = getGeoChildren('ua:pryluky');
  const ids = new Set(children.map((entity) => entity.id));

  assert.equal(children.filter((entity) => entity.type.startsWith('poi.')).length, 3);
  assert.ok(ids.has('ua:pryluky:poi:railway-station'));
  assert.ok(ids.has('ua:pryluky:poi:local-history-museum'));
  assert.ok(ids.has('ua:pryluky:poi:nativity-theotokos-cathedral'));
});

test('Pryluky lexicon POI canonicals resolve to geo entities', () => {
  const expected = [
    ['Pryluky Railway Station', 'ua:pryluky:poi:railway-station'],
    ['Прилуцький краєзнавчий музей імені В. І. Маслова', 'ua:pryluky:poi:local-history-museum'],
    ['Собор Різдва Пресвятої Богородиці', 'ua:pryluky:poi:nativity-theotokos-cathedral'],
  ];

  for (const [canonical, id] of expected) {
    assert.equal(resolveLexiconGeoEntity({
      country: 'UA',
      city: 'Pryluky',
      type: 'poi',
      canonical,
    })?.id, id);
  }
});
