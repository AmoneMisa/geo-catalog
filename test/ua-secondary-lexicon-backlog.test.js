import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity, resolveLexiconGeoEntity } from '../src/index.js';

test('Uman lexicon report owners are present', () => {
  assert.equal(resolveLexiconGeoEntity({ country: 'UA', city: 'Uman', type: 'microdistrict', canonical: 'Sofiivska Slobidka' })?.osm?.id, 1509543305);
  assert.equal(resolveLexiconGeoEntity({ country: 'UA', city: 'Uman', type: 'poi', canonical: 'Sofiyivka Park' })?.osm?.id, 977418);
  assert.equal(resolveLexiconGeoEntity({ country: 'UA', city: 'Uman', type: 'poi', canonical: 'Rabbi Nachman Tomb' })?.osm?.id, 2362821060);
  assert.equal(resolveLexiconGeoEntity({ country: 'UA', city: 'Uman', type: 'poi', canonical: 'Central Square' })?.osm?.id, 997149578);
});

test('Kramatorsk report preserves real areas and street semantics', () => {
  assert.equal(resolveLexiconGeoEntity({ country: 'UA', city: 'Kramatorsk', type: 'microdistrict', canonical: 'Sotsmisto' })?.osm?.id, 409289791);
  assert.equal(resolveLexiconGeoEntity({ country: 'UA', city: 'Kramatorsk', type: 'microdistrict', canonical: 'Lazurnyi' })?.osm?.id, 4319214059);
  assert.equal(resolveLexiconGeoEntity({ country: 'UA', city: 'Kramatorsk', type: 'poi', canonical: 'Bernatskyi Garden' })?.osm?.id, 12752571);
  assert.equal(getGeoEntity('ua:kramatorsk:street:parkova')?.osm?.id, 335788767);
  assert.equal(getGeoEntity('ua:kramatorsk:poi:peace-square'), null);
});

test('Sloviansk report owners keep resort-area semantics separate from POIs', () => {
  assert.equal(resolveLexiconGeoEntity({ country: 'UA', city: 'Sloviansk', type: 'microdistrict', canonical: 'Cherivkivka' })?.osm?.id, 4547358438);
  assert.equal(resolveLexiconGeoEntity({ country: 'UA', city: 'Sloviansk', type: 'microdistrict', canonical: 'Khymik' })?.osm?.id, 4547358437);
  assert.equal(resolveLexiconGeoEntity({ country: 'UA', city: 'Sloviansk', type: 'poi', canonical: 'Railway Station' })?.osm?.id, 127089884);
  assert.equal(getGeoEntity('ua:sloviansk:suburb:sloviansk-resort')?.osm?.id, 4547358434);
});
