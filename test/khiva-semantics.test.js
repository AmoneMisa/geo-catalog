import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLexiconGeoEntity } from '../src/lexicon-bridge.js';
import { isUzSecondaryCoverageGap } from '../src/coverage-gaps-uz-secondary.js';

test('Khiva Ichan Kala is the spatial owner for the normalized old-city canonical', () => {
  const resolved = resolveLexiconGeoEntity({
    country: 'UZ',
    city: 'Khiva',
    type: 'local_area',
    canonical: 'Ichan Kala',
  });

  assert.ok(resolved);
  assert.equal(resolved.id, 'uz:khiva:poi:itchan-kala');
  assert.equal(resolved.canonicalName, 'Ichan Kala');
  assert.deepEqual(resolved.center, { lat: 41.37810, lng: 60.35980 });
});

test('obsolete Khiva Old City canonical is no longer tracked as a gap', () => {
  assert.equal(isUzSecondaryCoverageGap({
    country: 'UZ', city: 'Khiva', type: 'local_area', canonical: 'Old City',
  }), false);
  assert.equal(isUzSecondaryCoverageGap({
    country: 'UZ', city: 'Khiva', type: 'local_area', canonical: 'New City',
  }), true);
});
