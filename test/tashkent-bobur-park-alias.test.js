import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getGeoEntity,
  isGeoCoverageGap,
  resolveLexiconGeoEntityExact,
} from '../src/index.js';

test('historical Bobur Park canonical reuses current Friendship Park owner', () => {
  const input = {
    country: 'UZ',
    city: 'Tashkent',
    type: 'poi',
    canonical: 'Bobur Park',
  };

  const entity = resolveLexiconGeoEntityExact(input);
  assert.equal(entity?.id, 'uz:tashkent:poi:friendship-park');
  assert.equal(entity?.canonicalName, 'Friendship Park');
  assert.equal(getGeoEntity('uz:tashkent:poi:bobur-park'), null);
  assert.equal(isGeoCoverageGap(input), false);
});
