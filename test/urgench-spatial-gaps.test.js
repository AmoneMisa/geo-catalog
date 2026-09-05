import test from 'node:test';
import assert from 'node:assert/strict';
import { URGENCH_ENTITIES } from '../data-source/uz/cities/urgench.js';
import { isGeoCoverageGap } from '../src/coverage-gaps.js';

const byCanonical = new Map(URGENCH_ENTITIES.map((entity) => [entity.canonicalName, entity]));

for (const [canonical, expected] of [
  ['Railway Station area', { lat: 41.53650, lng: 60.63215, accuracyM: 1100 }],
  ['Airport area', { lat: 41.58490, lng: 60.63353, accuracyM: 1500 }],
  ['University area', { lat: 41.55635, lng: 60.60703, accuracyM: 900 }],
  ['Al-Xorazmiy area', { lat: 41.58168, lng: 60.63183, accuracyM: 900 }],
]) {
  test(`Urgench ${canonical} uses a conservative semantic anchor`, () => {
    const entity = byCanonical.get(canonical);
    assert.ok(entity);
    assert.equal(entity.type, 'local_area');
    assert.equal(entity.country, 'UZ');
    assert.equal(entity.parentId, 'uz:urgench');
    assert.equal(entity.source, 'manual');
    assert.equal(entity.accuracy, 'approximate');
    assert.equal(entity.accuracyM, expected.accuracyM);
    assert.deepEqual(entity.center, { lat: expected.lat, lng: expected.lng });
    assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Urgench', type: 'local_area', canonical }), false);
  });
}

test('unverified Urgench semantic areas remain explicit gaps', () => {
  for (const canonical of ['Center', 'Olimpiya', 'Navoiy', 'Gurlan Road', 'Khiva Road']) {
    assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Urgench', type: 'local_area', canonical }), true);
  }
});
