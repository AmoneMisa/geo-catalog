import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLexiconGeoEntity } from '../src/lexicon-bridge.js';
import { isGeoCoverageGap } from '../src/coverage-gaps.js';

const expected = Object.freeze([
  ['Bayterek', 'uz:nukus:mahalla:bayterek', 42.46600, 59.59120],
  ['Aq otaw', 'uz:nukus:mahalla:aq-otaw', 42.44765, 59.62590],
]);

test('Nukus administrative-office-backed mahallas remain conservative representatives', () => {
  for (const [canonical, id, lat, lng] of expected) {
    const resolved = resolveLexiconGeoEntity({ country: 'UZ', city: 'Nukus', type: 'mahalla', canonical });

    assert.ok(resolved, canonical);
    assert.equal(resolved.id, id);
    assert.deepEqual(resolved.center, { lat, lng });
    assert.equal(resolved.source, 'manual');
    assert.equal(resolved.accuracy, 'approximate');
    assert.equal(resolved.accuracyM, 1000);
    assert.equal(resolved.osm, undefined);
    assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Nukus', type: 'mahalla', canonical }), false);
  }
});
