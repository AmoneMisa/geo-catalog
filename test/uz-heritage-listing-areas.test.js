import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLexiconGeoEntity } from '../src/lexicon-bridge.js';
import { isUzSecondaryCoverageGap } from '../src/coverage-gaps-uz-secondary.js';

const expected = Object.freeze([
  ['Kokand', 'Khudoyar Khan area', 40.538333, 70.937500, 900],
  ['Margilan', 'Kumtepa', 40.45504, 71.66594, 1100],
  ['Margilan', 'Yodgorlik', 40.47636, 71.71783, 900],
  ['Shakhrisabz', 'Oqsaroy', 39.060776, 66.829475, 900],
]);

test('heritage-centered listing areas reuse verified POI centers conservatively', () => {
  for (const [city, canonical, lat, lng, accuracyM] of expected) {
    const resolved = resolveLexiconGeoEntity({
      country: 'UZ',
      city,
      type: 'local_area',
      canonical,
    });

    assert.ok(resolved, `${city}: ${canonical}`);
    assert.equal(resolved.type, 'local_area');
    assert.deepEqual(resolved.center, { lat, lng });
    assert.equal(resolved.source, 'manual');
    assert.equal(resolved.accuracy, 'approximate');
    assert.equal(resolved.accuracyM, accuracyM);
    assert.equal(resolved.osm, undefined);
    assert.equal(isUzSecondaryCoverageGap({
      country: 'UZ', city, type: 'local_area', canonical,
    }), false, `${city}: ${canonical}`);
  }
});
