import test from 'node:test';
import assert from 'node:assert/strict';

import {
  isGeoCoverageGap,
  resolveLexiconGeoEntity,
} from '../src/index.js';

test("So'lim resolves to a conservative O'qchi-Olmazor representative center", () => {
  const input = { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: "So'lim" };
  const entity = resolveLexiconGeoEntity(input);

  assert.equal(entity?.id, 'uz:tashkent:local-area:solim');
  assert.equal(entity?.parentId, 'uz:tashkent:yashnobod');
  assert.deepEqual(entity?.center, { lat: 41.2932, lng: 69.3088 });
  assert.equal(entity?.source, 'manual');
  assert.equal(entity?.accuracy, 'approximate');
  assert.ok(entity?.accuracyM >= 1400);
  assert.equal(entity?.osm, undefined);
  assert.equal(isGeoCoverageGap(input), false);
});

test("So'lim representative center does not assert Obod Makon as the mavze's physical OSM owner", () => {
  const entity = resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: "So'lim" });

  assert.equal(entity?.osm, undefined);
  assert.equal(entity?.boundary, undefined);
});
