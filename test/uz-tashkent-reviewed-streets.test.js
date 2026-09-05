import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const cases = Object.freeze([
  ['tarakkiyot-4-mavze', 'Тараккиёт 4-мавзе улица', 41.35283, 69.23956, '70030076188807919'],
  ['tashkent', 'Улица Ташкент', 41.327, 69.26615, '70030076412670965'],
]);

test('reviewed Tashkent 2GIS street records retain exact frozen provenance', () => {
  for (const [slug, canonicalName, lat, lng, providerId] of cases) {
    const id = `uz:tashkent:street:${slug}`;
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.type, 'street', id);
    assert.equal(entity.country, 'UZ', id);
    assert.equal(entity.canonicalName, canonicalName, id);
    assert.equal(entity.parentId, 'uz:tashkent', id);
    assert.deepEqual(entity.center, { lat, lng }, id);
    assert.equal(entity.source, 'manual', id);
    assert.equal(entity.sourceUrl, `https://2gis.uz/tashkent/geo/${providerId}`, id);
    assert.equal(entity.accuracy, 'street', id);
  }
});

test('reviewed Tashkent street-like place stays excluded without street subtype', () => {
  assert.equal(getGeoEntity('uz:tashkent:street:gastronomicheskaya'), null);
});
