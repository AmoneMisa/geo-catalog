import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity, resolveLexiconGeoEntity } from '../src/index.js';
import { isGeoCoverageGap } from '../src/coverage-gaps.js';

test('Andijan Bobur Square resolves and is no longer an explicit gap', () => {
  const input = { country: 'UZ', city: 'Andijan', type: 'poi', canonical: 'Bobur Square' };
  const entity = resolveLexiconGeoEntity(input);

  assert.equal(isGeoCoverageGap(input), false);
  assert.equal(entity?.id, 'uz:andijan:poi:bobur-square');
  assert.equal(entity?.parentId, 'uz:andijan');
});

test('Andijan Bobur Square keeps official conservative provenance', () => {
  const entity = getGeoEntity('uz:andijan:poi:bobur-square');

  assert.deepEqual(entity?.center, { lat: 40.761746, lng: 72.351894 });
  assert.equal(entity?.source, 'official');
  assert.equal(entity?.accuracy, 'poi');
  assert.ok(entity?.accuracyM >= 160);
  assert.equal(entity?.osm, undefined);
});
