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

test('Old Termez has one archaeological physical owner for POI and listing-area semantics', () => {
  const poi = resolveLexiconGeoEntity({
    country: 'UZ',
    city: 'Termez',
    type: 'poi',
    canonical: 'Old Termez',
  });
  const area = resolveLexiconGeoEntity({
    country: 'UZ',
    city: 'Termez',
    type: 'local_area',
    canonical: 'Old Termez',
  });

  assert.equal(poi?.id, 'uz:termez:poi:old-termez');
  assert.equal(area?.id, poi?.id);
  assert.equal(poi?.type, 'poi.archaeological_site');
  assert.equal(poi?.source, 'osm');
  assert.deepEqual(poi?.center, { lat: 37.2642736, lng: 67.192273 });
  assert.deepEqual(poi?.osm, { type: 'way', id: 499907480 });
});

test('Termez Alpomish listing area reuses the direct sports-complex way', () => {
  const resolved = resolveLexiconGeoEntity({
    country: 'UZ',
    city: 'Termez',
    type: 'local_area',
    canonical: 'Alpomish',
  });

  assert.equal(resolved?.id, 'uz:termez:poi:alpomish');
  assert.equal(resolved?.type, 'poi');
  assert.deepEqual(resolved?.center, { lat: 37.2444298, lng: 67.2861956 });
  assert.deepEqual(resolved?.osm, { type: 'way', id: 110890449 });
});
