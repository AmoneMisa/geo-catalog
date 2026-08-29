import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLexiconGeoEntity } from '../src/lexicon-bridge.js';
import { isUzTailCoverageGap } from '../src/coverage-gaps-uz-tail.js';

test('Denov Arboretum resolves to the verified OSM nature-reserve way', () => {
  const resolved = resolveLexiconGeoEntity({
    country: 'UZ',
    city: 'Denov',
    type: 'poi',
    canonical: 'Denov Arboretum',
  });

  assert.ok(resolved);
  assert.equal(resolved.id, 'uz:denov:poi:denov-arboretum');
  assert.deepEqual(resolved.center, { lat: 38.27, lng: 67.8947 });
  assert.equal(resolved.source, 'osm');
  assert.deepEqual(resolved.osm, { type: 'way', id: 621632351 });
  assert.equal(isUzTailCoverageGap({
    country: 'UZ',
    city: 'Denov',
    type: 'poi',
    canonical: 'Denov Arboretum',
  }), false);
});
