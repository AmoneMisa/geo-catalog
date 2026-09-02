import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';
import { isKzCityCoverageGap } from '../src/coverage-gaps-kz-cities.js';

const expected = Object.freeze([
  ['kz:temirtau', 'Temirtau', 50.0549, 72.9646],
  ['kz:ekibastuz', 'Ekibastuz', 51.7237, 75.3229],
  ['kz:rudny', 'Rudny', 52.9645, 63.1335],
  ['kz:zhezkazgan', 'Zhezkazgan', 47.7833, 67.7667],
  ['kz:balkhash', 'Balkhash', 46.8481, 74.9950],
  ['kz:konaev', 'Konaev', 43.86484, 77.06604],
  ['kz:zhanaozen', 'Zhanaozen', 43.3381, 52.8556],
  ['kz:satbayev', 'Satbayev', 47.9049, 67.5306],
  ['kz:kosshy', 'Kosshy', 50.9754, 71.3549],
  ['kz:arys', 'Arys', 42.43247, 68.81349],
  ['kz:kentau', 'Kentau', 43.516721, 68.504631],
  ['kz:saryagash', 'Saryagash', 41.45, 69.1666667],
  ['kz:stepnogorsk', 'Stepnogorsk', 52.3506, 71.8816],
  ['kz:atbasar', 'Atbasar', 51.820495, 68.363693],
  ['kz:shchuchinsk', 'Shchuchinsk', 52.9359, 70.189],
]);

test('KZ major city expansion is present in the geo catalog', () => {
  for (const [id, canonicalName, lat, lng] of expected) {
    const entity = getGeoEntity(id);
    assert.ok(entity, `${id} should exist`);
    assert.equal(entity.type, 'city');
    assert.equal(entity.country, 'KZ');
    assert.equal(entity.canonicalName, canonicalName);
    assert.deepEqual(entity.center, { lat, lng });
    assert.equal(entity.accuracy, 'city');
  }
});

test('resolved KZ cities are no longer reported as coverage gaps', () => {
  for (const [, canonicalName] of expected) {
    assert.equal(isKzCityCoverageGap({ country: 'KZ', type: 'city', canonical: canonicalName }), false);
  }
});
