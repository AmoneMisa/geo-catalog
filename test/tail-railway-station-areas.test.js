import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLexiconGeoEntity } from '../src/lexicon-bridge.js';
import { isUzTailCoverageGap } from '../src/coverage-gaps-uz-tail.js';

const expected = Object.freeze([
  ['Denov', { lat: 38.27216, lng: 67.90639 }, 1100],
  ['Asaka', { lat: 40.65515, lng: 72.20600 }, 1100],
  ['Kogon', { lat: 39.72483, lng: 64.57633 }, 1000],
  ['Kattakurgan', { lat: 39.90249, lng: 66.24589 }, 1100],
  ['Yangiyol', { lat: 41.11678, lng: 69.06075 }, 1000],
]);

test('tail-city Railway Station area aliases use verified station-centered representative areas', () => {
  for (const [city, center, accuracyM] of expected) {
    const resolved = resolveLexiconGeoEntity({
      country: 'UZ',
      city,
      type: 'local_area',
      canonical: 'Railway Station area',
    });

    assert.ok(resolved, city);
    assert.equal(resolved.type, 'local_area');
    assert.deepEqual(resolved.center, center);
    assert.equal(resolved.source, 'manual');
    assert.equal(resolved.accuracy, 'approximate');
    assert.equal(resolved.accuracyM, accuracyM);
    assert.equal(isUzTailCoverageGap({
      country: 'UZ',
      city,
      type: 'local_area',
      canonical: 'Railway Station area',
    }), false, city);
  }
});
