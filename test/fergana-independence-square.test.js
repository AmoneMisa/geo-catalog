import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity, resolveLexiconGeoEntity } from '../src/index.js';
import { isGeoCoverageGap } from '../src/coverage-gaps.js';

test('Fergana Independence Square resolves and is no longer an explicit gap', () => {
  const input = { country: 'UZ', city: 'Fergana', type: 'poi', canonical: 'Independence Square' };
  const entity = resolveLexiconGeoEntity(input);

  assert.equal(isGeoCoverageGap(input), false);
  assert.equal(entity?.id, 'uz:fergana:poi:independence-square');
  assert.equal(entity?.parentId, 'uz:fergana');
});

test('Fergana Independence Square keeps conservative manual provenance', () => {
  const entity = getGeoEntity('uz:fergana:poi:independence-square');

  assert.deepEqual(entity?.center, { lat: 40.386879, lng: 71.784105 });
  assert.equal(entity?.source, 'manual');
  assert.equal(entity?.accuracy, 'poi');
  assert.ok(entity?.accuracyM >= 320);
  assert.equal(entity?.osm, undefined);
});
