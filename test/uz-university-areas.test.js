import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLexiconGeoEntity } from '../src/lexicon-bridge.js';
import { isGeoCoverageGap } from '../src/coverage-gaps.js';
import { isUzSecondaryCoverageGap } from '../src/coverage-gaps-uz-secondary.js';

const expected = Object.freeze([
  ['Andijan', 40.78948, 72.37338, 'main'],
  ['Urgench', 41.55635, 60.60703, 'main'],
  ['Gulistan', 40.50611, 68.78324, 'secondary'],
]);

test('university listing areas reuse verified university anchors conservatively', () => {
  for (const [city, lat, lng, gapSet] of expected) {
    const canonical = 'University area';
    const resolved = resolveLexiconGeoEntity({ country: 'UZ', city, type: 'local_area', canonical });

    assert.ok(resolved, city);
    assert.equal(resolved.type, 'local_area');
    assert.deepEqual(resolved.center, { lat, lng });
    assert.equal(resolved.source, 'manual');
    assert.equal(resolved.accuracy, 'approximate');
    assert.equal(resolved.accuracyM, 900);
    assert.equal(resolved.osm, undefined);

    const isGap = gapSet === 'secondary' ? isUzSecondaryCoverageGap : isGeoCoverageGap;
    assert.equal(isGap({ country: 'UZ', city, type: 'local_area', canonical }), false, city);
  }
});
