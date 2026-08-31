import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getGeoEntity,
  isGeoCoverageGap,
  resolveLexiconGeoEntity,
} from '../src/index.js';

const localAreaInput = (canonical) => ({
  country: 'UZ',
  city: 'Tashkent',
  type: 'local_area',
  canonical,
});

test('Shifokorlar-2 resolves from its address cluster without claiming an OSM owner', () => {
  const input = localAreaInput('Shifokorlar-2');
  const entity = resolveLexiconGeoEntity(input);

  assert.equal(entity?.id, 'uz:tashkent:local-area:shifokorlar-2');
  assert.equal(entity?.parentId, 'uz:tashkent:almazar');
  assert.deepEqual(entity?.center, { lat: 41.362796, lng: 69.182929 });
  assert.equal(entity?.source, 'manual');
  assert.equal(entity?.accuracy, 'approximate');
  assert.ok(entity?.accuracyM >= 800);
  assert.equal(entity?.osm, undefined);
  assert.equal(isGeoCoverageGap(input), false);
});

test('Shifokorlar-3 uses a conservative Jiydali representative center without claiming an OSM owner', () => {
  const input = localAreaInput('Shifokorlar-3');
  const entity = resolveLexiconGeoEntity(input);

  assert.equal(entity?.id, 'uz:tashkent:local-area:shifokorlar-3');
  assert.equal(entity?.parentId, 'uz:tashkent:almazar');
  assert.deepEqual(entity?.center, { lat: 41.36649, lng: 69.18595 });
  assert.equal(entity?.source, 'manual');
  assert.equal(entity?.accuracy, 'approximate');
  assert.ok(entity?.accuracyM >= 900);
  assert.equal(entity?.osm, undefined);
  assert.equal(isGeoCoverageGap(input), false);
});

test('Shifokorlar-1..4 retain distinct spatial identities', () => {
  assert.deepEqual(getGeoEntity('uz:tashkent:local-area:shifokorlar-1')?.osm, { type: 'way', id: 149513658 });
  assert.equal(getGeoEntity('uz:tashkent:local-area:shifokorlar-2')?.osm, undefined);
  assert.equal(getGeoEntity('uz:tashkent:local-area:shifokorlar-3')?.osm, undefined);
  assert.deepEqual(getGeoEntity('uz:tashkent:local-area:shifokorlar-4')?.osm, { type: 'way', id: 142245652 });
});

test('Shifokorlar-5 and Shifokorlar-6 stay unresolved until G-30 can be mapped to a numbered mavze', () => {
  for (const canonical of ['Shifokorlar-5', 'Shifokorlar-6']) {
    assert.equal(isGeoCoverageGap(localAreaInput(canonical)), true, canonical);
    assert.equal(getGeoEntity(`uz:tashkent:local-area:${canonical.toLowerCase()}`), null, canonical);
  }
});
