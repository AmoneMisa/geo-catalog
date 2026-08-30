import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity, resolveLexiconGeoEntity } from '../src/index.js';
import { isUzTailCoverageGap } from '../src/coverage-gaps-uz-tail.js';

const GAP_CASES = Object.freeze([
  Object.freeze({
    input: Object.freeze({ country: 'UZ', city: 'Asaka', type: 'poi', canonical: 'Dehqon Bazaar' }),
    id: 'uz:asaka:poi:dehqon-bazaar',
  }),
  Object.freeze({
    input: Object.freeze({ country: 'UZ', city: 'Kattakurgan', type: 'local_area', canonical: 'Bazaar' }),
    id: 'uz:kattakurgan:poi:dehqon-bazaar',
  }),
  Object.freeze({
    input: Object.freeze({ country: 'UZ', city: 'Shahrixon', type: 'local_area', canonical: 'Market' }),
    id: 'uz:shahrixon:poi:market',
  }),
]);

test('verified tail-city markets resolve and no longer remain explicit gaps', () => {
  for (const { input, id } of GAP_CASES) {
    assert.equal(isUzTailCoverageGap(input), false, `${input.city}: ${input.canonical}`);
    assert.equal(resolveLexiconGeoEntity(input)?.id, id, `${input.city}: ${input.canonical}`);
  }
});

test('tail-city market anchors keep defensible provenance', () => {
  const asaka = getGeoEntity('uz:asaka:poi:dehqon-bazaar');
  assert.deepEqual(asaka?.center, { lat: 40.64954, lng: 72.24528 });
  assert.equal(asaka?.source, 'manual');
  assert.equal(asaka?.accuracy, 'poi');
  assert.ok(asaka?.accuracyM >= 300);
  assert.equal(asaka?.osm, undefined);

  const kattakurgan = getGeoEntity('uz:kattakurgan:poi:dehqon-bazaar');
  assert.deepEqual(kattakurgan?.center, { lat: 39.90525, lng: 66.25121 });
  assert.equal(kattakurgan?.source, 'osm');
  assert.deepEqual(kattakurgan?.osm, { type: 'way', id: 167561007 });

  const shahrixon = getGeoEntity('uz:shahrixon:poi:market');
  assert.deepEqual(shahrixon?.center, { lat: 40.714374, lng: 72.057417 });
  assert.equal(shahrixon?.source, 'manual');
  assert.equal(shahrixon?.accuracy, 'poi');
  assert.equal(shahrixon?.osm, undefined);
});
