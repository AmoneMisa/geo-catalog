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

test("Sug'diyona mavze resolves independently from the same-name mahalla", () => {
  const input = { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: "Sug'diyona" };
  const area = resolveLexiconGeoEntity(input);
  const mahalla = getGeoEntity('uz:tashkent:mahalla:sugdiyona');

  assert.equal(area?.id, 'uz:tashkent:local-area:sugdiyona');
  assert.equal(area?.type, 'local_area');
  assert.equal(area?.parentId, 'uz:tashkent:sergeli');
  assert.deepEqual(area?.center, { lat: 41.223284, lng: 69.235013 });
  assert.equal(area?.source, 'manual');
  assert.equal(area?.accuracy, 'approximate');
  assert.ok(area?.accuracyM >= 1400);
  assert.equal(area?.osm, undefined);
  assert.equal(area?.boundary, undefined);
  assert.equal(isGeoCoverageGap(input), false);
  assert.ok(mahalla);
  assert.notEqual(area?.id, mahalla?.id);
});
