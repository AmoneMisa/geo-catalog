import test from 'node:test';
import assert from 'node:assert/strict';
import { GEO_ENTITIES } from '../src/catalog.js';
import { resolveLexiconGeoEntity } from '../src/lexicon-bridge.js';
import { isUzSecondaryCoverageGap } from '../src/coverage-gaps-uz-secondary.js';

test('Almalyk Kamalak mahalla uses a conservative derived representative center', () => {
  const entity = GEO_ENTITIES.find(({ id }) => id === 'uz:almalyk:mahalla:kamalak');

  assert.ok(entity);
  assert.equal(entity.canonicalName, 'Kamalak');
  assert.equal(entity.parentId, 'uz:almalyk');
  assert.deepEqual(entity.center, { lat: 40.85209, lng: 69.59927 });
  assert.equal(entity.source, 'manual');
  assert.equal(entity.accuracy, 'approximate');
  assert.equal(entity.accuracyM, 900);

  const resolved = resolveLexiconGeoEntity({
    country: 'UZ',
    city: 'Almalyk',
    type: 'mahalla',
    canonical: 'Kamalak',
  });
  assert.equal(resolved?.id, entity.id);
  assert.equal(isUzSecondaryCoverageGap({
    country: 'UZ',
    city: 'Almalyk',
    type: 'mahalla',
    canonical: 'Kamalak',
  }), false);
});
