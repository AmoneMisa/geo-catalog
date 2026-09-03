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
  ['kz:makinsk', 'Makinsk', 52.63287, 70.41821],
  ['kz:ereymentau', 'Ereymentau', 51.61656, 73.14575],
  ['kz:akkol', 'Akkol', 51.99439, 70.95196],
  ['kz:kaskelen', 'Kaskelen', 43.19769, 76.63039],
  ['kz:talgar', 'Talgar', 43.30272, 77.23947],
  ['kz:esik', 'Esik', 43.35497, 77.44935],
  ['kz:zharkent', 'Zharkent', 44.16567, 80.00274],
  ['kz:tekeli', 'Tekeli', 44.86442, 78.7658],
  ['kz:usharal', 'Usharal', 46.16622, 80.94606],
  ['kz:saran', 'Saran', 49.80171, 72.82851],
  ['kz:shakhtinsk', 'Shakhtinsk', 49.70566, 72.59484],
  ['kz:abai', 'Abai', 49.6299, 72.87221],
  ['kz:priozersk', 'Priozersk', 46.03082, 73.69252],
  ['kz:karkaralinsk', 'Karkaralinsk', 49.41478, 75.47835],
  ['kz:aksu', 'Aksu', 52.03542, 76.93411],
  ['kz:ridder', 'Ridder', 50.344, 83.513],
  ['kz:altai', 'Altai', 49.73861, 84.27194],
  ['kz:serebryansk', 'Serebryansk', 49.6925, 83.28917],
  ['kz:shemonaikha', 'Shemonaikha', 50.62872, 81.91555],
  ['kz:kurchatov', 'Kurchatov', 50.75653, 78.54867],
  ['kz:ayagoz', 'Ayagoz', 47.97139, 80.43917],
  ['kz:khromtau', 'Khromtau', 50.25782, 58.43267],
  ['kz:alga', 'Alga', 49.89626, 57.3303],
  ['kz:kandyagash', 'Kandyagash', 49.47184, 57.42247],
  ['kz:shalkar', 'Shalkar', 47.8273, 59.61592],
  ['kz:kulsary', 'Kulsary', 46.9508, 54.0082],
  ['kz:fort-shevchenko', 'Fort-Shevchenko', 44.51667, 50.26667],
  ['kz:lisakovsk', 'Lisakovsk', 52.5449, 62.4989],
  ['kz:arkalyk', 'Arkalyk', 50.2503, 66.9038],
  ['kz:tobyl', 'Tobyl', 53.21, 63.7],
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
