import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLexiconGeoEntity } from '../src/lexicon-bridge.js';
import { isUzSecondaryCoverageGap } from '../src/coverage-gaps-uz-secondary.js';

test('Bekabad Railway Station area uses a conservative verified station center', () => {
  const resolved = resolveLexiconGeoEntity({
    country: 'UZ',
    city: 'Bekabad',
    type: 'local_area',
    canonical: 'Railway Station area',
  });

  assert.ok(resolved);
  assert.equal(resolved.id, 'uz:bekabad:local-area:railway-station-area');
  assert.deepEqual(resolved.center, { lat: 40.21455, lng: 69.22772 });
  assert.equal(resolved.source, 'manual');
  assert.equal(resolved.accuracy, 'approximate');
  assert.equal(resolved.accuracyM, 1200);
  assert.equal(resolved.osm, undefined);
  assert.equal(isUzSecondaryCoverageGap({
    country: 'UZ',
    city: 'Bekabad',
    type: 'local_area',
    canonical: 'Railway Station area',
  }), false);
});
