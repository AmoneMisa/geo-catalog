import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity, resolveLexiconGeoEntity } from '../src/index.js';

test('Turtkul Bazaar resolves to the direct city marketplace object', () => {
  const entity = getGeoEntity('uz:turtkul:poi:bazaar');
  assert.ok(entity);
  assert.equal(entity.parentId, 'uz:turtkul');
  assert.equal(entity.type, 'poi.market');
  assert.deepEqual(entity.center, { lat: 41.5629189, lng: 61.0107667 });
  assert.deepEqual(entity.osm, { type: 'way', id: 278779988 });

  const resolved = resolveLexiconGeoEntity({
    country: 'UZ',
    city: 'Turtkul',
    type: 'local_area',
    canonical: 'Bazaar',
  });
  assert.equal(resolved?.id, entity.id);
});
