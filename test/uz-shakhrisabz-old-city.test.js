import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity, resolveLexiconGeoEntity } from '../src/index.js';
import { isUzSecondaryCoverageGap } from '../src/coverage-gaps-uz-secondary.js';

test('Shakhrisabz Old City resolves to the official historic centre', () => {
  const input = { country: 'UZ', city: 'Shakhrisabz', type: 'local_area', canonical: 'Old City' };
  const entity = resolveLexiconGeoEntity(input);

  assert.equal(isUzSecondaryCoverageGap(input), false);
  assert.equal(entity?.id, 'uz:shakhrisabz:local-area:old-city');
  assert.equal(entity?.parentId, 'uz:shakhrisabz');
});

test('Shakhrisabz historic-centre anchor keeps conservative official provenance', () => {
  const entity = getGeoEntity('uz:shakhrisabz:local-area:old-city');

  assert.deepEqual(entity?.center, { lat: 39.05, lng: 66.83333 });
  assert.equal(entity?.source, 'official');
  assert.equal(entity?.accuracy, 'approximate');
  assert.ok(entity?.accuracyM >= 1200);
  assert.equal(entity?.osm, undefined);
});
