import test from 'node:test';
import assert from 'node:assert/strict';
import { findGeoEntities, getGeoEntity } from '../src/index.js';

test('Kharkiv districts retain verified OSM relation identities', () => {
  const expected = new Map([
    ['ua:kharkiv:district:industrialnyi', 7340969],
    ['ua:kharkiv:district:kyivskyi', 7340973],
    ['ua:kharkiv:district:nemyshlianskyi', 7340972],
    ['ua:kharkiv:district:novobavarskyi', 3801278],
    ['ua:kharkiv:district:osnovianskyi', 3801315],
    ['ua:kharkiv:district:saltivskyi', 7340971],
    ['ua:kharkiv:district:slobidskyi', 7340970],
    ['ua:kharkiv:district:kholodnohirskyi', 3801249],
    ['ua:kharkiv:district:shevchenkivskyi', 3796255],
  ]);

  const districts = findGeoEntities({ country: 'UA', parentId: 'ua:kharkiv', type: 'district' });
  assert.equal(districts.length, 9);
  for (const [id, relationId] of expected) {
    assert.deepEqual(getGeoEntity(id)?.osm, { type: 'relation', id: relationId }, id);
  }
});
