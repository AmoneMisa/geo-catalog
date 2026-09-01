import test from 'node:test';
import assert from 'node:assert/strict';
import { GEO_ENTITIES } from '../src/catalog.js';
import { resolveLexiconGeoEntity } from '../src/lexicon-bridge.js';
import { isGeoCoverageGap } from '../src/coverage-gaps.js';

test('Nukus Railway Station uses the verified OSM station node', () => {
  const entity = GEO_ENTITIES.find(({ id }) => id === 'uz:nukus:poi:nukus-railway-station');

  assert.ok(entity);
  assert.equal(entity.canonicalName, 'Nukus Railway Station');
  assert.deepEqual(entity.center, { lat: 42.43778, lng: 59.64271 });
  assert.equal(entity.source, 'osm');
  assert.equal(entity.accuracy, 'poi');
  assert.deepEqual(entity.osm, { type: 'node', id: 1584776373 });
  assert.equal(entity.wikidataId, 'Q25394710');
});

test('Nukus Railway Station area resolves to a broad representative area', () => {
  const resolved = resolveLexiconGeoEntity({
    country: 'UZ',
    city: 'Nukus',
    type: 'local_area',
    canonical: 'Railway Station area',
  });

  assert.ok(resolved);
  assert.equal(resolved.id, 'uz:nukus:local-area:railway-station-area');
  assert.deepEqual(resolved.center, { lat: 42.43778, lng: 59.64271 });
  assert.equal(resolved.source, 'manual');
  assert.equal(resolved.accuracy, 'approximate');
  assert.equal(resolved.accuracyM, 1100);
  assert.equal(resolved.osm, undefined);
  assert.equal(isGeoCoverageGap({
    country: 'UZ',
    city: 'Nukus',
    type: 'local_area',
    canonical: 'Railway Station area',
  }), false);
});
