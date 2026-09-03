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

test('Denov Chaganiyon listing area reuses the direct archaeological-site way', () => {
  const resolved = resolveLexiconGeoEntity({
    country: 'UZ',
    city: 'Denov',
    type: 'local_area',
    canonical: 'Chaganiyon',
  });

  assert.equal(resolved?.id, 'uz:denov:poi:chaganiyon');
  assert.equal(resolved?.type, 'poi.archaeological_site');
  assert.deepEqual(resolved?.center, { lat: 38.2761596, lng: 67.8864905 });
  assert.deepEqual(resolved?.osm, { type: 'way', id: 274738274 });
});

test('Denov New Market listing area reuses the direct shopping-mall way', () => {
  const resolved = resolveLexiconGeoEntity({
    country: 'UZ',
    city: 'Denov',
    type: 'local_area',
    canonical: 'New Market',
  });

  assert.equal(resolved?.id, 'uz:denov:poi:new-market');
  assert.equal(resolved?.type, 'poi.shopping_mall');
  assert.deepEqual(resolved?.center, { lat: 38.2512785, lng: 67.9038606 });
  assert.deepEqual(resolved?.osm, { type: 'way', id: 1031989034 });
});
