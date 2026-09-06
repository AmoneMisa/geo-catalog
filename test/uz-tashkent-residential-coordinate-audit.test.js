import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const audited = Object.freeze([
  {
    id: 'uz:tashkent:residential:nrg-oybek',
    center: { lat: 41.293185, lng: 69.281641 },
    sourceUrl: 'https://2gis.uz/tashkent/geo/70030076393567169',
  },
  {
    id: 'uz:tashkent:residential:boulevard',
    center: { lat: 41.316212, lng: 69.244075 },
    sourceUrl: 'https://2gis.uz/tashkent/geo/70030077107380510',
  },
  {
    id: 'uz:tashkent:residential:karasaray',
    center: { lat: 41.345333, lng: 69.23418 },
    sourceUrl: 'https://2gis.uz/tashkent/geo/70030076283055927',
  },
]);

for (const expected of audited) {
  test(`${expected.id} keeps its audited residential-complex anchor`, () => {
    const entity = getGeoEntity(expected.id);
    assert.ok(entity);
    assert.equal(entity.type, 'residential_complex');
    assert.deepEqual(entity.center, expected.center);
    assert.equal(entity.sourceUrl, expected.sourceUrl);
  });
}

test('known-good curated anchors are not replaced by weaker scrape-only alternatives', () => {
  assert.deepEqual(
    getGeoEntity('uz:tashkent:residential:yangi-sergeli')?.center,
    { lat: 41.222096, lng: 69.224966 },
  );
  assert.deepEqual(
    getGeoEntity('uz:tashkent:residential:infinity')?.center,
    { lat: 41.3025714, lng: 69.2889718 },
  );
  assert.deepEqual(
    getGeoEntity('uz:tashkent:residential:akay-city')?.center,
    { lat: 41.320741, lng: 69.294792 },
  );
  assert.deepEqual(
    getGeoEntity('uz:tashkent:residential:mirabad-avenue')?.center,
    { lat: 41.291499, lng: 69.271517 },
  );
  assert.deepEqual(
    getGeoEntity('uz:tashkent:residential:assalom-sohil')?.center,
    { lat: 41.282995, lng: 69.30842 },
  );
  assert.deepEqual(
    getGeoEntity('uz:tashkent:residential:manzara')?.center,
    { lat: 41.356109, lng: 69.314573 },
  );
});
