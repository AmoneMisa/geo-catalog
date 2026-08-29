import test from 'node:test';
import assert from 'node:assert/strict';
import { GEO_ENTITIES } from '../src/catalog.js';
import { resolveLexiconGeoEntity } from '../src/lexicon-bridge.js';
import { isUzSecondaryCoverageGap } from '../src/coverage-gaps-uz-secondary.js';

test('Angren Geolog local-area lexicon entry resolves to the real mahalla', () => {
  const entity = GEO_ENTITIES.find(({ id }) => id === 'uz:angren:mahalla:geolog');

  assert.ok(entity);
  assert.equal(entity.type, 'mahalla');
  assert.equal(entity.canonicalName, 'Geolog');
  assert.equal(entity.parentId, 'uz:angren');
  assert.deepEqual(entity.center, { lat: 40.99013, lng: 70.04007 });
  assert.equal(entity.source, 'manual');
  assert.equal(entity.accuracy, 'approximate');
  assert.equal(entity.accuracyM, 2500);

  const resolved = resolveLexiconGeoEntity({
    country: 'UZ',
    city: 'Angren',
    type: 'local_area',
    canonical: 'Geolog',
  });
  assert.equal(resolved?.id, entity.id);
  assert.equal(isUzSecondaryCoverageGap({
    country: 'UZ',
    city: 'Angren',
    type: 'local_area',
    canonical: 'Geolog',
  }), false);
});
