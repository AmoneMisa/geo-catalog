import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLexiconGeoEntityExact } from '../src/lexicon-bridge.js';

const expected = Object.freeze([
  ['microdistrict', '1 microdistrict', 327570454],
  ['microdistrict', '2 microdistrict', 231187787],
  ['microdistrict', '3 microdistrict', 327570293],
  ['poi', 'TRK Aktau', 326728530],
  ['poi', 'Halyk Arena', 798221754],
  ['poi', 'Botanical Garden', 416714261],
]);

test('Aktau crawler-backed entities resolve to direct OSM representatives', () => {
  for (const [type, canonical, osmId] of expected) {
    const resolved = resolveLexiconGeoEntityExact({ country: 'KZ', city: 'Aktau', type, canonical });
    assert.ok(resolved, canonical);
    assert.equal(resolved.source, 'osm', canonical);
    assert.equal(resolved.osm?.id, osmId, canonical);
    assert.ok(Number.isFinite(resolved.center?.lat), canonical);
    assert.ok(Number.isFinite(resolved.center?.lng), canonical);
  }
});
