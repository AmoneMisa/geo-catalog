import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLexiconGeoEntity } from '../src/lexicon-bridge.js';
import { isGeoCoverageGap } from '../src/coverage-gaps.js';

const expected = Object.freeze([
  ['Fergana', 'Al-Fargoniy', 40.38975, 71.78353, 900],
  ['Bukhara', 'Mohi Xosa', 39.81295, 64.44123, 1000],
  ['Urgench', 'Al-Xorazmiy area', 41.58168, 60.63183, 900],
]);

test('named listing areas reuse existing verified POI centers conservatively', () => {
  for (const [city, canonical, lat, lng, accuracyM] of expected) {
    const resolved = resolveLexiconGeoEntity({
      country: 'UZ', city, type: 'local_area', canonical,
    });

    assert.ok(resolved, `${city}: ${canonical}`);
    assert.equal(resolved.type, 'local_area');
    assert.deepEqual(resolved.center, { lat, lng });
    assert.equal(resolved.source, 'manual');
    assert.equal(resolved.accuracy, 'approximate');
    assert.equal(resolved.accuracyM, accuracyM);
    assert.equal(resolved.osm, undefined);
    assert.equal(isGeoCoverageGap({
      country: 'UZ', city, type: 'local_area', canonical,
    }), false, `${city}: ${canonical}`);
  }
});
