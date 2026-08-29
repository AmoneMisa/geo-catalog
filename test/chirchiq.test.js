import test from 'node:test';
import assert from 'node:assert/strict';
import { GEO_ENTITIES } from '../src/catalog.js';
import { resolveLexiconGeoEntity } from '../src/lexicon-bridge.js';
import { isUzSecondaryCoverageGap } from '../src/coverage-gaps-uz-secondary.js';

test('Chirchiq 8 microdistrict has verified OSM spatial coverage', () => {
  const entity = GEO_ENTITIES.find(({ id }) => id === 'uz:chirchiq:microdistrict:8');

  assert.ok(entity);
  assert.equal(entity.canonicalName, '8 microdistrict');
  assert.equal(entity.parentId, 'uz:chirchiq');
  assert.deepEqual(entity.center, { lat: 41.46214, lng: 69.5503 });
  assert.deepEqual(entity.osm, { type: 'node', id: 6986049350 });

  const resolved = resolveLexiconGeoEntity({
    country: 'UZ',
    city: 'Chirchiq',
    type: 'microdistrict',
    canonical: '8 microdistrict',
  });
  assert.equal(resolved?.id, entity.id);
  assert.equal(isUzSecondaryCoverageGap({
    country: 'UZ',
    city: 'Chirchiq',
    type: 'microdistrict',
    canonical: '8 microdistrict',
  }), false);
});
