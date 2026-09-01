import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoChildren } from '../src/index.js';

const districtNames = (cityId) => getGeoChildren(cityId, { type: 'district' }).map(({ canonicalName }) => canonicalName).sort();

const expectedDistricts = new Map([
  ['kz:shymkent', ['Abai', 'Al-Farabi', 'Enbekshi', 'Karatau', 'Turan']],
  ['kz:aktobe', ['Almaty', 'Astana']],
  ['kz:karaganda', ['Alikhan Bokeikhan', 'Kazybek Bi']],
  ['kz:taraz', ['Aulieata', 'Zhibek Zholy']],
]);

test('Kazakhstan city district follow-up exposes complete current sets', () => {
  for (const [cityId, expected] of expectedDistricts) {
    assert.deepEqual(districtNames(cityId), [...expected].sort(), cityId);
  }
});

test('Kazakhstan follow-up districts carry district-level spatial provenance', () => {
  for (const cityId of expectedDistricts.keys()) {
    const districts = getGeoChildren(cityId, { type: 'district' });
    for (const entity of districts) {
      assert.equal(entity.country, 'KZ');
      assert.equal(entity.accuracy, 'district');
      assert.ok(Number.isFinite(entity.accuracyM) && entity.accuracyM > 0, `${entity.id} should have accuracyM`);
      assert.ok(entity.sourceUrl, `${entity.id} should expose its coordinate/status source`);
    }
  }
});
