import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const cases = Object.freeze([
  ['kyzylkumskaya-2', '2-я Кызылкумская', 39.68878, 66.86003, '70030077139880938'],
  ['samarkand-1', '1-я Самарканд улица', 39.6349, 66.8899, '70030076904323057'],
  ['samarkand-2', '2-я Самарканд улица', 39.63389, 66.89212, '70030076905356729'],
  ['khalila-sultana', 'Халила Султана улица', 39.62315, 67.00051, '70030076949380154'],
  ['makhorat', 'Улица Махорат', 39.6244, 66.9534, '70030076701317064'],
  ['namazgokh', 'Намазгох переулок', 39.63594, 66.96949, '70030077184747326'],
  ['rasadkhona', 'Улица Расадхона', 39.67319, 67.01935, '70030077190597079'],
  ['shakhmurada', 'Улица Шахмурада', 39.66883, 66.97523, '70030076601841497'],
  ['ustozlar', 'Улица Устозлар', 39.66469, 66.9172, '70030076645590632'],
]);

test('reviewed Samarkand 2GIS street records retain exact frozen provenance', () => {
  for (const [slug, canonicalName, lat, lng, providerId] of cases) {
    const id = `uz:samarkand:street:${slug}`;
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.type, 'street', id);
    assert.equal(entity.country, 'UZ', id);
    assert.equal(entity.canonicalName, canonicalName, id);
    assert.equal(entity.parentId, 'uz:samarkand', id);
    assert.deepEqual(entity.center, { lat, lng }, id);
    assert.equal(entity.source, 'manual', id);
    assert.equal(entity.sourceUrl, `https://2gis.uz/samarkand/geo/${providerId}`, id);
    assert.equal(entity.accuracy, 'street', id);
  }
});

test('ambiguous Samarkand street-like results remain excluded', () => {
  for (const id of [
    'uz:samarkand:street:samarkand',
    'uz:samarkand:street:gagarin-avenue',
    'uz:samarkand:street:new-avenue',
  ]) {
    assert.equal(getGeoEntity(id), null, id);
  }
});
