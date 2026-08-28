import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getGeoEntity,
  resolveLexiconGeoEntity,
} from '../src/index.js';

test('verified Odesa microdistrict canonicals resolve to dedicated spatial owners', () => {
  const expected = new Map([
    ['Arkadia', 'ua:odesa:microdistrict:arkadia'],
    ['Velykyi Fontan', 'ua:odesa:microdistrict:velykyi-fontan'],
    ['Lanzheron', 'ua:odesa:microdistrict:lanzheron'],
    ['Serednii Fontan', 'ua:odesa:microdistrict:serednii-fontan'],
    ['Sakhalinchyk', 'ua:odesa:microdistrict:sakhalinchyk'],
    ['Otrada', 'ua:odesa:microdistrict:otrada'],
  ]);

  for (const [canonical, id] of expected) {
    assert.equal(resolveLexiconGeoEntity({ country: 'UA', city: 'Odesa', type: 'microdistrict', canonical })?.id, id);
  }
});

test('Odesa microdistrict provenance stays explicit and district-scoped', () => {
  assert.deepEqual(getGeoEntity('ua:odesa:microdistrict:arkadia')?.osm, { type: 'node', id: 2151201619 });
  assert.equal(getGeoEntity('ua:odesa:microdistrict:arkadia')?.parentId, 'ua:odesa:district:prymorskyi');
  assert.deepEqual(getGeoEntity('ua:odesa:microdistrict:velykyi-fontan')?.osm, { type: 'node', id: 3901671563 });
  assert.equal(getGeoEntity('ua:odesa:microdistrict:velykyi-fontan')?.parentId, 'ua:odesa:district:kyivskyi');
  assert.equal(getGeoEntity('ua:odesa:microdistrict:otrada')?.source, 'manual');
  assert.equal(getGeoEntity('ua:odesa:microdistrict:otrada')?.accuracy, 'neighborhood');
});
