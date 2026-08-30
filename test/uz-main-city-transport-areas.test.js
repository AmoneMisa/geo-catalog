import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLexiconGeoEntity } from '../src/lexicon-bridge.js';
import { isGeoCoverageGap } from '../src/coverage-gaps.js';

const expected = Object.freeze([
  ['Andijan', 'Railway Station area', 40.76296, 72.35057, 1100],
  ['Andijan', 'Airport area', 40.72710, 72.29600, 1500],
  ['Fergana', 'Railway Station area', 40.39511, 71.75479, 1100],
  ['Fergana', 'Airport area', 40.35880, 71.74500, 1500],
  ['Urgench', 'Railway Station area', 41.53650, 60.63215, 1100],
  ['Urgench', 'Airport area', 41.58490, 60.63353, 1500],
  ['Qarshi', 'Railway Station area', 38.82158, 65.77723, 1100],
  ['Qarshi', 'Airport area', 38.802311, 65.773161, 1500],
]);

test('main-city transport listing areas use conservative existing-anchor centers', () => {
  for (const [city, canonical, lat, lng, accuracyM] of expected) {
    const resolved = resolveLexiconGeoEntity({ country: 'UZ', city, type: 'local_area', canonical });

    assert.ok(resolved, `${city}: ${canonical}`);
    assert.equal(resolved.type, 'local_area');
    assert.deepEqual(resolved.center, { lat, lng });
    assert.equal(resolved.source, 'manual');
    assert.equal(resolved.accuracy, 'approximate');
    assert.equal(resolved.accuracyM, accuracyM);
    assert.equal(resolved.osm, undefined);
    assert.equal(isGeoCoverageGap({ country: 'UZ', city, type: 'local_area', canonical }), false);
  }
});
