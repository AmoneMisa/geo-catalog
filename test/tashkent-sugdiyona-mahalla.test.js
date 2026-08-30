import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getGeoEntity,
  isGeoCoverageGap,
  resolveLexiconGeoEntity,
} from '../src/index.js';

test("Sug'diyona mahalla has an approximate Sergeli spatial center", () => {
  const input = { country: 'UZ', city: 'Tashkent', type: 'mahalla', canonical: "Sug'diyona" };
  const entity = resolveLexiconGeoEntity(input);

  assert.equal(entity?.id, 'uz:tashkent:mahalla:sugdiyona');
  assert.equal(entity?.parentId, 'uz:tashkent:sergeli');
  assert.deepEqual(entity?.center, { lat: 41.223284, lng: 69.235013 });
  assert.equal(entity?.source, 'manual');
  assert.equal(entity?.accuracy, 'approximate');
  assert.ok(entity?.accuracyM >= 1200);
  assert.equal(entity?.osm, undefined);
  assert.equal(isGeoCoverageGap(input), false);
});

test("Sug'diyona local area remains unresolved independently of the mahalla", () => {
  const input = { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: "Sug'diyona" };

  assert.equal(isGeoCoverageGap(input), true);
  assert.equal(resolveLexiconGeoEntity(input), null);
  assert.ok(getGeoEntity('uz:tashkent:mahalla:sugdiyona'));
});
