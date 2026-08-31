import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoChildren } from '../src/index.js';

const districtNames = (cityId) => getGeoChildren(cityId, { type: 'district' }).map(({ canonicalName }) => canonicalName).sort();

const expectedDistricts = new Map([
  ['ua:kyiv', ['Darnytskyi', 'Desnianskyi', 'Dniprovskyi', 'Holosiivskyi', 'Obolonskyi', 'Pecherskyi', 'Podilskyi', 'Shevchenkivskyi', 'Solomianskyi', 'Sviatoshynskyi']],
  ['ua:odesa', ['Khadzhybeiskyi', 'Kyivskyi', 'Peresypskyi', 'Prymorskyi']],
  ['ua:dnipro', ['Amur-Nyzhnodniprovskyi', 'Chechelivskyi', 'Industrialnyi', 'Novokodatskyi', 'Samarskyi', 'Shevchenkivskyi', 'Sobornyi', 'Tsentralnyi']],
  ['kg:bishkek', ['Leninsky', 'Oktyabrsky', 'Pervomaisky', 'Sverdlovsky']],
  ['kz:almaty', ['Alatau', 'Almaly', 'Auezov', 'Bostandyk', 'Medeu', 'Nauryzbay', 'Turksib', 'Zhetysu']],
  ['kz:astana', ['Almaty', 'Baikonur', 'Esil', 'Nura', 'Saraishyk', 'Saryarka']],
  ['ro:bucharest', ['Sector 1', 'Sector 2', 'Sector 3', 'Sector 4', 'Sector 5', 'Sector 6']],
]);

test('priority cities expose their complete current administrative district sets', () => {
  for (const [cityId, expected] of expectedDistricts) {
    assert.deepEqual(districtNames(cityId), [...expected].sort(), cityId);
  }
});

test('new district centers carry district-level spatial provenance', () => {
  for (const cityId of ['kg:bishkek', 'kz:almaty', 'kz:astana', 'ro:bucharest']) {
    const districts = getGeoChildren(cityId, { type: 'district' });
    assert.ok(districts.length > 0, `${cityId} should have districts`);
    for (const entity of districts) {
      assert.equal(entity.accuracy, 'district');
      assert.ok(Number.isFinite(entity.accuracyM) && entity.accuracyM > 0, `${entity.id} should have accuracyM`);
      assert.ok(entity.sourceUrl, `${entity.id} should expose its coordinate source`);
    }
  }
});

test('Samarkand and Bukhara do not invent an intra-city district layer', () => {
  // Current administrative sources expose the cities through mahallas/territories, not current city districts.
  assert.deepEqual(districtNames('uz:samarkand'), []);
  assert.deepEqual(districtNames('uz:bukhara'), []);
});
