import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getGeoChildren,
  resolveLexiconGeoEntity,
} from '../src/index.js';

test('Novovolynsk exposes verified core POIs', () => {
  const children = getGeoChildren('ua:novovolynsk');
  const ids = new Set(children.map((entity) => entity.id));

  assert.equal(children.filter((entity) => entity.type.startsWith('poi.')).length, 1);
  assert.ok(ids.has('ua:novovolynsk:poi:historical-museum'));
});

test('Novovolynsk lexicon POI canonical resolves to geo entity', () => {
  assert.equal(resolveLexiconGeoEntity({
    country: 'UA',
    city: 'Novovolynsk',
    type: 'poi',
    canonical: 'Нововолинський історичний музей',
  })?.id, 'ua:novovolynsk:poi:historical-museum');
});
