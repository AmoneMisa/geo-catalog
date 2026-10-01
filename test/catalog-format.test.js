import test from 'node:test';
import assert from 'node:assert/strict';

import { compactEntities, expandEntities } from '../src/catalog-format.js';
import { GEO_ENTITIES } from '../src/catalog.js';

const entity = (overrides = {}) => ({
  id: 'uz:tashkent:poi:test-n1',
  type: 'poi.school',
  country: 'UZ',
  canonicalName: 'Школа 1',
  parentId: 'uz:tashkent',
  center: { lat: 41.330789100000004, lng: 69.27806030000001 },
  source: 'osm',
  accuracy: 'poi',
  accuracyM: 30,
  osm: { type: 'node', id: 1 },
  concordances: { osm: [{ type: 'node', id: 1 }] },
  sourceNames: { canonical: ['Школа 1'] },
  ...overrides,
});

test('compacting rounds centers to 7 decimals and round-trips everything else exactly', () => {
  const original = [entity()];
  const [restored] = expandEntities(JSON.parse(JSON.stringify(compactEntities(original))));
  assert.deepEqual(restored.center, { lat: 41.3307891, lng: 69.2780603 });
  assert.deepEqual({ ...restored, center: original[0].center }, original[0]);
  assert.deepEqual(Object.keys(restored), Object.keys(original[0]), 'key order is preserved');
  // The original catalog is never mutated by building the artifact.
  assert.equal(original[0].center.lat, 41.330789100000004);
});

test('duplicated sourceNames and concordances are stored as a marker', () => {
  const [compact] = compactEntities([entity()]);
  assert.equal(compact.sourceNames, 1);
  assert.equal(compact.concordances, 1);
});

test('anything that is not an exact duplicate is stored in full', () => {
  const differing = entity({
    sourceNames: { canonical: ['Школа 1'], ru: ['Школа № 1'] },
    concordances: { osm: [{ type: 'node', id: 1 }], wikidata: 'Q1' },
  });
  const [compact] = compactEntities([differing]);
  assert.deepEqual(compact.sourceNames, differing.sourceNames);
  assert.deepEqual(compact.concordances, differing.concordances);

  const reordered = entity({ concordances: { osm: [{ id: 1, type: 'node' }] } });
  assert.deepEqual(compactEntities([reordered])[0].concordances, reordered.concordances);

  const noOsm = entity({ osm: undefined, concordances: { osm: [{ type: 'node', id: 1 }] } });
  delete noOsm.osm;
  assert.deepEqual(compactEntities([noOsm])[0].concordances, noOsm.concordances);

  const absent = entity();
  delete absent.sourceNames;
  delete absent.concordances;
  const [bare] = compactEntities([absent]);
  assert.ok(!('sourceNames' in bare) && !('concordances' in bare));
});

test('loaded entities are frozen to the same depth as before', () => {
  const nested = GEO_ENTITIES.find((item) => item.concordances?.osm?.length && item.sourceNames);
  assert.ok(Object.isFrozen(GEO_ENTITIES));
  assert.ok(Object.isFrozen(nested));
  assert.ok(Object.isFrozen(nested.center));
  assert.ok(Object.isFrozen(nested.osm));
  assert.ok(Object.isFrozen(nested.concordances));
  assert.ok(Object.isFrozen(nested.concordances.osm));
  assert.ok(nested.concordances.osm.every((item) => Object.isFrozen(item)));
  assert.ok(Object.isFrozen(nested.sourceNames));
  assert.throws(() => { 'use strict'; nested.center.lat = 0; }, TypeError);
  const bounded = GEO_ENTITIES.find((item) => item.boundary);
  assert.ok(Object.isFrozen(bounded.boundary) && Object.isFrozen(bounded.boundary.coordinates));
});

test('no catalog center carries more than 7 decimals', () => {
  for (const item of GEO_ENTITIES) {
    for (const value of [item.center.lat, item.center.lng]) {
      assert.equal(Math.round(value * 1e7) / 1e7, value, `${item.id} center is not rounded`);
    }
  }
});
