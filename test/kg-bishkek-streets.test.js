import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const expected = [
  'kg:bishkek:street:chyngyz-aytmatov-avenue',
  'kg:bishkek:street:aaly-tokombayev-avenue',
  'kg:bishkek:street:manas-avenue',
  'kg:bishkek:street:chui-avenue',
  'kg:bishkek:street:baitik-baatyr',
  'kg:bishkek:street:nasirdin-isanov',
  'kg:bishkek:street:ibraimov',
  'kg:bishkek:street:toktogul',
  'kg:bishkek:street:joomart-bokonbayev',
  'kg:bishkek:street:jusup-abdrakhmanov',
];

test('Bishkek canonical street entities expose verified centers', () => {
  for (const id of expected) {
    const entity = getGeoEntity(id);
    assert.ok(entity, `${id} should exist`);
    assert.equal(entity.type, 'street');
    assert.equal(entity.country, 'KG');
    assert.equal(entity.parentId, 'kg:bishkek');
    assert.ok(Number.isFinite(entity.center?.lat), `${id} lat`);
    assert.ok(Number.isFinite(entity.center?.lng), `${id} lng`);
    assert.ok(entity.sourceUrl, `${id} sourceUrl`);
  }
});
