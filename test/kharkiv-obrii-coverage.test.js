import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoEntity, resolveLexiconGeoEntity } from '../src/index.js';

test('legacy Kharkiv Horizont canonical resolves to current Obrii OSM owner', () => {
  const entity = resolveLexiconGeoEntity({ country: 'UA', city: 'Kharkiv', type: 'microdistrict', canonical: 'Horizont' });
  assert.equal(entity?.id, 'ua:kharkiv:microdistrict:obrii');
  assert.equal(entity?.canonicalName, 'Obrii');
  assert.deepEqual(entity?.osm, { type: 'node', id: 3344516784 });
  assert.deepEqual(entity?.center, { lat: 49.92682, lng: 36.4376 });
});

test('Obrii owner keeps explicit OSM provenance', () => {
  const entity = getGeoEntity('ua:kharkiv:microdistrict:obrii');
  assert.equal(entity?.source, 'osm');
  assert.equal(entity?.sourceUrl, 'https://www.openstreetmap.org/node/3344516784');
});
