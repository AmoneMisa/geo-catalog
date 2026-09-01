import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLexiconGeoEntity } from '../src/lexicon-bridge.js';
import { isUzSecondaryCoverageGap } from '../src/coverage-gaps-uz-secondary.js';

test('Angren Dukent local-area alias resolves to the verified OSM settlement', () => {
  const resolved = resolveLexiconGeoEntity({
    country: 'UZ',
    city: 'Angren',
    type: 'local_area',
    canonical: 'Dukent',
  });

  assert.ok(resolved);
  assert.equal(resolved.id, 'uz:angren:settlement:dukent');
  assert.equal(resolved.type, 'settlement');
  assert.deepEqual(resolved.center, { lat: 41.02983, lng: 70.09285 });
  assert.equal(resolved.source, 'osm');
  assert.deepEqual(resolved.osm, { type: 'node', id: 2520618202 });
  assert.equal(isUzSecondaryCoverageGap({
    country: 'UZ',
    city: 'Angren',
    type: 'local_area',
    canonical: 'Dukent',
  }), false);
});

test('Angren Geolog remains a conservative mahalla representative anchor', () => {
  const resolved = resolveLexiconGeoEntity({
    country: 'UZ',
    city: 'Angren',
    type: 'local_area',
    canonical: 'Geolog',
  });

  assert.ok(resolved);
  assert.equal(resolved.id, 'uz:angren:mahalla:geolog');
  assert.equal(resolved.type, 'mahalla');
  assert.equal(resolved.source, 'manual');
  assert.equal(resolved.accuracy, 'approximate');
  assert.equal(resolved.accuracyM, 2500);
});

test('Angren Railway Station area uses the verified station as a broad representative anchor', () => {
  const resolved = resolveLexiconGeoEntity({
    country: 'UZ',
    city: 'Angren',
    type: 'local_area',
    canonical: 'Railway Station area',
  });

  assert.ok(resolved);
  assert.equal(resolved.id, 'uz:angren:local-area:railway-station-area');
  assert.deepEqual(resolved.center, { lat: 40.99905, lng: 70.08266 });
  assert.equal(resolved.source, 'manual');
  assert.equal(resolved.accuracy, 'approximate');
  assert.equal(resolved.accuracyM, 1100);
  assert.equal(isUzSecondaryCoverageGap({
    country: 'UZ',
    city: 'Angren',
    type: 'local_area',
    canonical: 'Railway Station area',
  }), false);
});
