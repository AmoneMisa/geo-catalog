import test from 'node:test';
import assert from 'node:assert/strict';
import { findGeoEntitiesByName } from '../src/index.js';

test('exact POI lookup remains country and type scoped', () => {
  const matches = findGeoEntitiesByName('Tashkent City Mall', { country: 'UZ', type: 'poi.shopping_mall' });
  assert.equal(matches.length, 1);
  assert.equal(matches[0].id, 'uz:tashkent:poi:tashkent-city-mall');
  assert.deepEqual(findGeoEntitiesByName('Tashkent City Mall', { country: 'UA' }), []);
});
