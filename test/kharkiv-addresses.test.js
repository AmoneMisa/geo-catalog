import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoEntity } from '../src/index.js';

const expected = new Map([
  ['ua:kharkiv:address:lva-landau-2b-1', ['ua:kharkiv:street:lva-landau-avenue', { lat: 49.93916124914873, lng: 36.29575531838618 }]],
  ['ua:kharkiv:address:amosova-26a', ['ua:kharkiv:street:amosova', { lat: 49.982357, lng: 36.348972 }]],
  ['ua:kharkiv:address:hvardiitsiv-shyronintsiv-22-1', ['ua:kharkiv:street:hvardiitsiv-shyronintsiv', { lat: 50.00373, lng: 36.332136 }]],
  ['ua:kharkiv:address:yuvileinyi-40a', ['ua:kharkiv:street:yuvileinyi-avenue', { lat: 49.995908, lng: 36.323145 }]],
  ['ua:kharkiv:address:yuvileinyi-82a', ['ua:kharkiv:street:yuvileinyi-avenue', { lat: 49.993708, lng: 36.355008 }]],
]);

test('Kharkiv verified addresses are building-level children of canonical streets', () => {
  for (const [id, [parentId, center]] of expected) {
    const entity = getGeoEntity(id);
    assert.equal(entity?.type, 'address');
    assert.equal(entity?.parentId, parentId);
    assert.equal(entity?.source, 'manual');
    assert.equal(entity?.accuracy, 'building');
    assert.ok(entity?.accuracyM <= 50);
    assert.ok(/^https:\/\//.test(entity?.sourceUrl ?? ''));
    assert.deepEqual(entity?.center, center);
  }
});

test('Newton 2 and its exact building address share one physical anchor', () => {
  assert.deepEqual(
    getGeoEntity('ua:kharkiv:address:lva-landau-2b-1')?.center,
    getGeoEntity('ua:kharkiv:residential:newton-2')?.center,
  );
});
