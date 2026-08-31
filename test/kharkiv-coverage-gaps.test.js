import test from 'node:test';
import assert from 'node:assert/strict';
import { UA_KHARKIV_COVERAGE_GAPS, isUaKharkivCoverageGap } from '../src/coverage-gaps-ua-kharkiv.js';
import { resolveLexiconGeoEntityExact } from '../src/lexicon-bridge.js';

const expected = Object.freeze([
  ['microdistrict', '536 microdistrict'],
  ['microdistrict', '537 microdistrict'],
  ['microdistrict', '614 microdistrict'],
  ['poi', 'Feldman Ecopark'],
  ['poi', 'Rost'],
  ['poi', 'Klass'],
]);

test('Kharkiv unresolved spatial canonicals are explicit and unresolved', () => {
  assert.equal(UA_KHARKIV_COVERAGE_GAPS.length, expected.length);
  for (const [type, canonical] of expected) {
    const input = { country: 'UA', city: 'Kharkiv', type, canonical };
    assert.equal(isUaKharkivCoverageGap(input), true);
    assert.equal(resolveLexiconGeoEntityExact(input), null);
  }
});

test('resolved Kharkiv canonicals are not coverage gaps', () => {
  for (const [type, canonical] of [
    ['microdistrict', '535A'],
    ['microdistrict', '627 microdistrict'],
    ['microdistrict', 'Horizont'],
    ['residential_complex', 'Newton 2'],
  ]) {
    assert.equal(isUaKharkivCoverageGap({ country: 'UA', city: 'Kharkiv', type, canonical }), false);
  }
});
