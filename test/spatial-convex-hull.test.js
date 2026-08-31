import test from 'node:test';
import assert from 'node:assert/strict';

import { convexHullPositions } from '../src/index.js';

test('convexHullPositions returns the outer GeoJSON positions without closing the ring', () => {
  const hull = convexHullPositions([
    [0, 0],
    [2, 0],
    [2, 2],
    [0, 2],
    [1, 1],
    [2, 0],
  ]);

  assert.equal(hull.length, 4);
  assert.deepEqual(new Set(hull.map(([lng, lat]) => `${lng},${lat}`)), new Set([
    '0,0',
    '2,0',
    '2,2',
    '0,2',
  ]));
  assert.notDeepEqual(hull[0], hull[hull.length - 1]);
});

test('convexHullPositions ignores invalid positions and handles degenerate inputs', () => {
  assert.deepEqual(convexHullPositions([]), []);
  assert.deepEqual(convexHullPositions([[30, 50], [30, 50], [Number.NaN, 1], [181, 0]]), [[30, 50]]);
});
