import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getGeoEntity,
  isGeoCoverageGap,
  resolveLexiconGeoEntity,
} from '../src/index.js';

test('Suvsoz-3, Suvsoz-4 and Suvsoz-5 use explicit approximate Bektemir centers', () => {
  const expected = new Map([
    ['Suvsoz-3', ['uz:tashkent:local-area:suvsoz-3', { lat: 41.244307, lng: 69.36724 }, 1100]],
    ['Suvsoz-4', ['uz:tashkent:local-area:suvsoz-4', { lat: 41.253458, lng: 69.376753 }, 900]],
    ['Suvsoz-5', ['uz:tashkent:local-area:suvsoz-5', { lat: 41.258983, lng: 69.372314 }, 1200]],
  ]);

  for (const [canonical, [id, center, accuracyM]] of expected) {
    const input = { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical };
    const entity = resolveLexiconGeoEntity(input);

    assert.equal(entity?.id, id, canonical);
    assert.equal(entity?.parentId, 'uz:tashkent:bektemir', canonical);
    assert.deepEqual(entity?.center, center, canonical);
    assert.equal(entity?.source, 'manual', canonical);
    assert.equal(entity?.accuracy, 'approximate', canonical);
    assert.equal(entity?.accuracyM, accuracyM, canonical);
    assert.equal(entity?.osm, undefined, canonical);
    assert.equal(isGeoCoverageGap(input), false, canonical);
  }
});

test('Shimoliy Olmazor-2 resolves while Shimoliy Olmazor-1 remains an explicit gap', () => {
  const resolved = { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Shimoliy Olmazor-2' };
  const unresolved = { ...resolved, canonical: 'Shimoliy Olmazor-1' };

  assert.equal(resolveLexiconGeoEntity(resolved)?.id, 'uz:tashkent:local-area:shimoliy-olmazor-2');
  assert.deepEqual(
    getGeoEntity('uz:tashkent:local-area:shimoliy-olmazor-2')?.center,
    { lat: 41.351744, lng: 69.255455 },
  );
  assert.equal(isGeoCoverageGap(resolved), false);

  assert.equal(isGeoCoverageGap(unresolved), true);
  assert.equal(getGeoEntity('uz:tashkent:local-area:shimoliy-olmazor-1'), null);
});
