import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLexiconGeoEntity } from '../src/lexicon-bridge.js';
import { isGeoCoverageGap } from '../src/coverage-gaps.js';

test('historical Bobur Park resolves to the current Friendship Park site', () => {
  const resolved = resolveLexiconGeoEntity({
    country: 'UZ',
    city: 'Tashkent',
    type: 'poi',
    canonical: 'Bobur Park',
  });

  assert.ok(resolved);
  assert.equal(resolved.id, 'uz:tashkent:poi:bobur-park');
  assert.equal(resolved.type, 'poi.park');
  assert.deepEqual(resolved.center, { lat: 41.28969, lng: 69.25419 });
  assert.equal(resolved.source, 'manual');
  assert.equal(resolved.accuracyM, 320);
  assert.equal(resolved.osm, undefined);
  assert.equal(isGeoCoverageGap({
    country: 'UZ',
    city: 'Tashkent',
    type: 'poi',
    canonical: 'Bobur Park',
  }), false);
});
