import test from 'node:test';
import assert from 'node:assert/strict';
import { TURTKUL_ENTITIES } from '../data-source/uz/cities/turtkul.js';
import { isUzTailCoverageGap } from '../src/coverage-gaps-uz-tail.js';

const byCanonical = new Map(TURTKUL_ENTITIES.map((entity) => [entity.canonicalName, entity]));

test('Turtkul railway station keeps verified OSM provenance', () => {
  const entity = byCanonical.get('Turtkul Railway Station');
  assert.ok(entity);
  assert.equal(entity.type, 'poi.railway_station');
  assert.equal(entity.source, 'osm');
  assert.deepEqual(entity.osm, { type: 'node', id: 1592362133 });
  assert.deepEqual(entity.center, { lat: 41.57057, lng: 61.03238 });
});

test('Turtkul railway-station area is anchored conservatively', () => {
  const entity = byCanonical.get('Railway Station area');
  assert.ok(entity);
  assert.equal(entity.type, 'local_area');
  assert.equal(entity.parentId, 'uz:turtkul');
  assert.equal(entity.source, 'manual');
  assert.equal(entity.accuracy, 'approximate');
  assert.equal(entity.accuracyM, 1100);
  assert.deepEqual(entity.center, { lat: 41.57057, lng: 61.03238 });
  assert.equal(isUzTailCoverageGap({ country: 'UZ', city: 'Turtkul', type: 'local_area', canonical: 'Railway Station area' }), false);
});

test('unverified Turtkul local areas remain explicit gaps', () => {
  for (const canonical of ['Center', 'Bazaar']) {
    assert.equal(isUzTailCoverageGap({ country: 'UZ', city: 'Turtkul', type: 'local_area', canonical }), true);
  }
});
