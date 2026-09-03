import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getGeoChildren,
  resolveLexiconGeoEntity,
} from '../src/index.js';

test('Kolomyia exposes verified core POIs', () => {
  const children = getGeoChildren('ua:kolomyia');
  const ids = new Set(children.map((entity) => entity.id));

  assert.equal(children.filter((entity) => entity.type.startsWith('poi.')).length, 3);
  assert.ok(ids.has('ua:kolomyia:poi:pysanka-museum'));
  assert.ok(ids.has('ua:kolomyia:poi:hutsulshchyna-pokuttia-museum'));
  assert.ok(ids.has('ua:kolomyia:poi:railway-station'));
});

test('Kolomyia lexicon POI canonicals resolve to geo entities', () => {
  const expected = [
    ['Pysanka Museum', 'ua:kolomyia:poi:pysanka-museum'],
    ['National Museum of Hutsulshchyna and Pokuttia Folk Art', 'ua:kolomyia:poi:hutsulshchyna-pokuttia-museum'],
    ['Kolomyia Railway Station', 'ua:kolomyia:poi:railway-station'],
  ];

  for (const [canonical, id] of expected) {
    assert.equal(resolveLexiconGeoEntity({
      country: 'UA',
      city: 'Kolomyia',
      type: 'poi',
      canonical,
    })?.id, id);
  }
});
