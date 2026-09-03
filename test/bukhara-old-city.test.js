import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity, resolveLexiconGeoEntity } from '../src/index.js';
import { isGeoCoverageGap } from '../src/coverage-gaps.js';

test('Bukhara Old City resolves to the official historic centre', () => {
  const input = { country: 'UZ', city: 'Bukhara', type: 'local_area', canonical: 'Old City' };
  const entity = resolveLexiconGeoEntity(input);

  assert.equal(isGeoCoverageGap(input), false);
  assert.equal(entity?.id, 'uz:bukhara:local-area:old-city');
  assert.equal(entity?.parentId, 'uz:bukhara');
});

test('Bukhara historic-centre anchor keeps conservative official provenance', () => {
  const entity = getGeoEntity('uz:bukhara:local-area:old-city');

  assert.deepEqual(entity?.center, { lat: 39.77472, lng: 64.42861 });
  assert.equal(entity?.source, 'official');
  assert.equal(entity?.accuracy, 'approximate');
  assert.ok(entity?.accuracyM >= 1200);
  assert.equal(entity?.osm, undefined);
});

test('Bukhara enrichment uses direct city-scoped OSM owners', () => {
  const cases = [
    ['uz:bukhara:local-area:sharq', 'local_area', { type: 'node', id: 3593630431 }],
    ['uz:bukhara:local-area:railway-station-area', 'local_area', { type: 'node', id: 11804786229 }],
    ['uz:bukhara:poi:bukhara-2', 'poi.railway_station', { type: 'node', id: 1588259351 }],
  ];

  for (const [id, type, osm] of cases) {
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.parentId, 'uz:bukhara');
    assert.equal(entity.type, type);
    assert.equal(entity.source, 'osm');
    assert.deepEqual(entity.osm, osm);
  }
});

test('Bukhara report canonicals resolve without attaching Bukhara-1 from Kogon', () => {
  assert.equal(resolveLexiconGeoEntity({ country: 'UZ', city: 'Bukhara', type: 'local_area', canonical: 'Sharq' })?.id, 'uz:bukhara:local-area:sharq');
  assert.equal(resolveLexiconGeoEntity({ country: 'UZ', city: 'Bukhara', type: 'local_area', canonical: 'Railway Station area' })?.id, 'uz:bukhara:local-area:railway-station-area');
  assert.equal(resolveLexiconGeoEntity({ country: 'UZ', city: 'Bukhara', type: 'local_area', canonical: 'Bukhara-2' })?.id, 'uz:bukhara:poi:bukhara-2');
  assert.equal(resolveLexiconGeoEntity({ country: 'UZ', city: 'Bukhara', type: 'local_area', canonical: 'Bukhara-1' }), null);
});
