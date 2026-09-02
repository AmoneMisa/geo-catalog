import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity, resolveLexiconGeoEntity } from '../src/index.js';

const expectedLexiconAnchors = Object.freeze([
  ['Vokzalna', 'ua:bila-tserkva:microdistrict:vokzalna', 8322664948],
  ['Zarichchia', 'ua:bila-tserkva:microdistrict:zarichchia', 8322664947],
  ['DNS', 'ua:bila-tserkva:microdistrict:dns', 1489524275],
  ['4 microdistrict', 'ua:bila-tserkva:microdistrict:4', 8322664946],
]);

test('Bila Tserkva report-derived neighborhoods resolve through the lexicon bridge', () => {
  for (const [canonical, id, osmId] of expectedLexiconAnchors) {
    const resolved = resolveLexiconGeoEntity({
      country: 'UA',
      city: 'Bila Tserkva',
      type: 'microdistrict',
      canonical,
    });
    assert.equal(resolved?.id, id, canonical);
    assert.equal(resolved?.osm?.id, osmId, canonical);
  }
});

test('Bila Tserkva third microdistrict discovery is retained as a physical neighborhood owner', () => {
  const entity = getGeoEntity('ua:bila-tserkva:microdistrict:3');
  assert.equal(entity?.canonicalName, '3 microdistrict');
  assert.deepEqual(entity?.center, { lat: 49.7887894, lng: 30.1419088 });
  assert.deepEqual(entity?.osm, { type: 'node', id: 8322664945 });
});
