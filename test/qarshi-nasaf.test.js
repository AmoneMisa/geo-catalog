import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLexiconGeoEntity } from '../src/lexicon-bridge.js';
import { isGeoCoverageGap } from '../src/coverage-gaps.js';

test('Qarshi Nasaf local-area alias resolves to the verified Nasaf mahalla', () => {
  const resolved = resolveLexiconGeoEntity({
    country: 'UZ',
    city: 'Qarshi',
    type: 'local_area',
    canonical: 'Nasaf',
  });

  assert.ok(resolved);
  assert.equal(resolved.id, 'uz:qarshi:mahalla:nasaf');
  assert.equal(resolved.type, 'mahalla');
  assert.equal(resolved.canonicalName, 'Nasaf');
  assert.deepEqual(resolved.center, { lat: 38.86914, lng: 65.79576 });
  assert.equal(resolved.source, 'osm');
  assert.equal(resolved.accuracy, 'neighborhood');
  assert.equal(resolved.accuracyM, 750);
  assert.deepEqual(resolved.osm, { type: 'way', id: 1027629334 });
  assert.equal(isGeoCoverageGap({
    country: 'UZ', city: 'Qarshi', type: 'local_area', canonical: 'Nasaf',
  }), false);
});

test('Qarshi Qat local area resolves to the direct Kat mahalla polygon', () => {
  const resolved = resolveLexiconGeoEntity({
    country: 'UZ',
    city: 'Qarshi',
    type: 'local_area',
    canonical: 'Qat',
  });

  assert.ok(resolved);
  assert.equal(resolved.id, 'uz:qarshi:mahalla:qat');
  assert.equal(resolved.type, 'mahalla');
  assert.deepEqual(resolved.center, { lat: 38.8216925, lng: 65.7982117 });
  assert.deepEqual(resolved.osm, { type: 'way', id: 1027317118 });
});

test('Qarshi Paxtazor uses the broad microdistrict neighbourhood, not Paxtazor 1', () => {
  const input = {
    country: 'UZ',
    city: 'Qarshi',
    type: 'local_area',
    canonical: 'Paxtazor',
  };
  const resolved = resolveLexiconGeoEntity(input);

  assert.equal(resolved?.id, 'uz:qarshi:local-area:paxtazor');
  assert.deepEqual(resolved?.center, { lat: 38.8339247, lng: 65.8040604 });
  assert.deepEqual(resolved?.osm, { type: 'node', id: 10583911556 });
  assert.equal(resolved?.source, 'osm');
  assert.equal(isGeoCoverageGap(input), false);
});
