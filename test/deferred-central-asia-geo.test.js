import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const expected = Object.freeze([
  ['kg:jalal-abad:microdistrict:kurmanbek', 'microdistrict', 'Микрорайон Курманбек', 'kg:jalal-abad'],
  ['kz:oskemen:residential:oazis', 'residential_complex', 'Оазис', 'kz:oskemen'],
  ['kz:oskemen:residential:rakhat', 'residential_complex', 'Рахат', 'kz:oskemen'],
  ['kz:oskemen:residential:renesans', 'residential_complex', 'Renesans', 'kz:oskemen'],
]);

test('deferred Central Asia entities are exposed through verified city parents', () => {
  for (const [id, type, canonicalName, parentId] of expected) {
    const entity = getGeoEntity(id);
    assert.ok(entity, `${id} should exist`);
    assert.equal(entity.type, type);
    assert.equal(entity.canonicalName, canonicalName);
    assert.equal(entity.parentId, parentId);
    assert.ok(Number.isFinite(entity.center.lat));
    assert.ok(Number.isFinite(entity.center.lng));
    assert.equal(entity.source, 'osm');
    assert.ok(entity.sourceUrl.startsWith('https://www.openstreetmap.org/way/'));
  }
});
