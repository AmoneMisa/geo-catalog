import test from 'node:test';
import assert from 'node:assert/strict';
import { GEO_ENTITIES } from '../src/catalog.js';
import { resolveLexiconGeoEntity } from '../src/lexicon-bridge.js';
import { isUzSecondaryCoverageGap } from '../src/coverage-gaps-uz-secondary.js';

function assertResolvedMicrodistrict(number) {
  const canonical = `${number} microdistrict`;
  const entity = GEO_ENTITIES.find(({ id }) => id === `uz:chirchiq:microdistrict:${number}`);
  assert.ok(entity, canonical);
  assert.equal(entity.canonicalName, canonical);
  assert.equal(entity.parentId, 'uz:chirchiq');

  const resolved = resolveLexiconGeoEntity({
    country: 'UZ',
    city: 'Chirchiq',
    type: 'microdistrict',
    canonical,
  });
  assert.equal(resolved?.id, entity.id);
  assert.equal(isUzSecondaryCoverageGap({
    country: 'UZ',
    city: 'Chirchiq',
    type: 'microdistrict',
    canonical,
  }), false);
  return entity;
}

test('Chirchiq 8 microdistrict has verified OSM spatial coverage', () => {
  const entity = assertResolvedMicrodistrict(8);
  assert.deepEqual(entity.center, { lat: 41.46214, lng: 69.5503 });
  assert.equal(entity.source, 'osm');
  assert.deepEqual(entity.osm, { type: 'node', id: 6986049350 });
});

test('Chirchiq 9 microdistrict has a verified mapping-database center', () => {
  const entity = assertResolvedMicrodistrict(9);
  assert.deepEqual(entity.center, { lat: 41.456855, lng: 69.558556 });
  assert.equal(entity.source, 'manual');
  assert.equal(entity.accuracy, 'neighborhood');
  assert.equal(entity.accuracyM, 500);
  assert.equal(entity.osm, undefined);
});
