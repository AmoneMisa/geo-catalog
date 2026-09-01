import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoChildren } from '../src/index.js';

const districts = (cityId) => getGeoChildren(cityId, { type: 'district' });
const districtNames = (cityId) => districts(cityId).map(({ canonicalName }) => canonicalName).sort();

const expected = new Map([
  ['ua:mykolaiv', ['Inhulskyi', 'Korabelnyi', 'Tsentralnyi', 'Zavodskyi']],
  ['ua:kherson', ['Dniprovskyi', 'Korabelnyi', 'Tsentralnyi']],
]);

test('Mykolaiv and Kherson expose their complete current administrative district sets', () => {
  // Mykolaiv municipal scheme: four current districts.
  // https://dgkh.mkrada.gov.ua/wp-content/uploads/2023/07/2_tekst.mater._sso-mykolai%CC%88v_06.07.23_compressed.pdf
  // Current Kherson budget/KATOTTG sources use Dniprovskyi, Korabelnyi and Tsentralnyi.
  for (const [cityId, names] of expected) {
    assert.deepEqual(districtNames(cityId), [...names].sort(), cityId);
  }
});

test('new Ukrainian district entities expose district-level spatial provenance', () => {
  for (const cityId of expected.keys()) {
    for (const entity of districts(cityId)) {
      assert.equal(entity.accuracy, 'district');
      assert.ok(Number.isFinite(entity.center?.lat), `${entity.id} should expose latitude`);
      assert.ok(Number.isFinite(entity.center?.lng), `${entity.id} should expose longitude`);
      assert.ok(Number.isFinite(entity.accuracyM) && entity.accuracyM > 0, `${entity.id} should expose accuracyM`);
      assert.ok(entity.source === 'osm' || entity.sourceUrl, `${entity.id} should expose spatial provenance`);
    }
  }
});

test('historical Kherson district names are not spatial canonicals', () => {
  const names = districtNames('ua:kherson');
  assert.equal(names.includes('Suvorovskyi'), false);
  assert.equal(names.includes('Komsomolskyi'), false);
});
