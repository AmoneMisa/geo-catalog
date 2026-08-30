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
