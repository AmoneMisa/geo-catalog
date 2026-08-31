import test from 'node:test';
import assert from 'node:assert/strict';
import { geoIdForLexiconEntity } from '../src/lexicon-bridge.js';
import { isGeoCoverageGap } from '../src/coverage-gaps.js';
import { isUaKharkivCoverageGap } from '../src/coverage-gaps-ua-kharkiv.js';
import { UA_ODESA_COVERAGE_GAPS, isUaOdesaCoverageGap } from '../src/coverage-gaps-ua-odesa.js';

const geoId = (country, city, type, canonical) => geoIdForLexiconEntity({ country, city, type, canonical });

test('Kharkiv listing canonicals reuse verified physical owners', () => {
  assert.equal(
    geoId('UA', 'Kharkiv', 'microdistrict', 'Zhukovskoho'),
    'ua:kharkiv:microdistrict:zhukovskoho',
  );
  assert.equal(
    geoId('UA', 'Kharkiv', 'microdistrict', 'Kulynychi'),
    'ua:kharkiv:microdistrict:kulynychi',
  );
  assert.equal(
    isUaKharkivCoverageGap({ country: 'UA', city: 'Kharkiv', type: 'microdistrict', canonical: 'Kulynychi' }),
    false,
  );
});

test('Odesa listing canonicals reuse verified physical locality owners', () => {
  const expected = new Map([
    ['Kotivskoho', 'ua:odesa:local-area:kotovskoho'],
    ['Malyi Fontan', 'ua:odesa:local-area:malyi-fontan'],
    ['Vuzivskyi', 'ua:odesa:microdistrict:vuzivskyi'],
    ['Chubaivka', 'ua:odesa:microdistrict:chubaivka'],
    ['Zastava-1', 'ua:odesa:microdistrict:zastava'],
    ['Zastava-2', 'ua:odesa:microdistrict:zastava'],
    ['Center', 'ua:odesa:local-area:historical-center'],
    ['Zolotyi Bereh', 'ua:odesa:local-area:zolotyi-bereh'],
  ]);

  for (const [canonical, id] of expected) {
    assert.equal(geoId('UA', 'Odesa', 'microdistrict', canonical), id, canonical);
    assert.equal(isUaOdesaCoverageGap({ country: 'UA', city: 'Odesa', type: 'microdistrict', canonical }), false, canonical);
  }
  assert.equal(UA_ODESA_COVERAGE_GAPS.length, 0);
});

test('Kyiv Latin parser canonicals bind to existing Ukrainian neighborhood owners', () => {
  const expected = new Map([
    ['Center', 'ua:kyiv:microdistrict:staryi-kyiv'],
    ['Podil', 'ua:kyiv:microdistrict:podil'],
    ['Troyeshchyna', 'ua:kyiv:microdistrict:troieshchyna'],
    ['Kharkivskyi', 'ua:kyiv:microdistrict:kharkivskyi-masyv'],
    ['Novobilychi', 'ua:kyiv:microdistrict:novobilychi'],
  ]);

  for (const [canonical, id] of expected) {
    assert.equal(geoId('UA', 'Kyiv', 'microdistrict', canonical), id, canonical);
  }
});

test('Tashkent Silk Road Residence has a dedicated physical owner', () => {
  assert.equal(
    geoId('UZ', 'Tashkent', 'residential_complex', 'Silk Road Residence'),
    'uz:tashkent:residential:silk-road-residence',
  );
  assert.equal(
    isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'residential_complex', canonical: 'Silk Road Residence' }),
    false,
  );
  assert.equal(
    isGeoCoverageGap({ country: 'UZ', city: 'Samarkand', type: 'residential_complex', canonical: 'Silk Road Residence' }),
    false,
  );
});

test('Samarkand legacy spellings and listing buckets reuse verified physical owners', () => {
  const expected = [
    ['mahalla', 'Sattepo', 'uz:samarkand:mahalla:sattepo'],
    ['mahalla', "Navro'z", 'uz:samarkand:mahalla:navroz'],
    ['mahalla', 'Chilquduq', 'uz:samarkand:mahalla:chilquduq'],
    ['mahalla', 'Chilkuduk', 'uz:samarkand:mahalla:chilquduq'],
    ['settlement', 'Farhod', 'uz:samarkand:settlement:farhod'],
    ['local_area', 'Sattepo', 'uz:samarkand:mahalla:sattepo'],
    ['microdistrict', 'Sartepa', 'uz:samarkand:mahalla:sattepo'],
    ['microdistrict', 'Sat-Tepo', 'uz:samarkand:mahalla:sattepo'],
    ['microdistrict', 'Sogdiana', 'uz:samarkand:mahalla:sogdiana'],
    ['microdistrict', 'Kimyogarlar', 'uz:samarkand:settlement:kimyogarlar'],
    ['microdistrict', 'Vokzal', 'uz:samarkand:poi:samarkand-railway-station'],
    ['microdistrict', 'Universitet', 'uz:samarkand:street:university-boulevard'],
    ['microdistrict', 'Registan', 'uz:samarkand:poi:registan-square'],
    ['microdistrict', 'Dagbitskaya', 'uz:samarkand:street:dahbed'],
    ['microdistrict', 'Rudaki', 'uz:samarkand:street:rudakiy'],
    ['local_area', 'Sugdiyona', 'uz:samarkand:mahalla:sogdiana'],
    ['local_area', 'Registon', 'uz:samarkand:poi:registan-square'],
    ['local_area', 'University area', 'uz:samarkand:street:university-boulevard'],
    ['local_area', 'Railway Station area', 'uz:samarkand:poi:samarkand-railway-station'],
    ['local_area', 'Dahbed', 'uz:samarkand:street:dahbed'],
    ['local_area', 'Rudakiy', 'uz:samarkand:street:rudakiy'],
    ['local_area', 'Gagarin area', 'uz:samarkand:street:gagarin'],
    ['local_area', 'Mirzo Ulugbek area', 'uz:samarkand:street:mirzo-ulugbek'],
    ['local_area', 'Spitamen', 'uz:samarkand:street:spitamen'],
    ['local_area', 'Panjakent Road', 'uz:samarkand:street:panjakent'],
    ['local_area', "So'zangaron", 'uz:samarkand:street:sozangaron'],
    ['local_area', 'Buyuk Ipak Yoli', 'uz:samarkand:street:buyuk-ipak-yuli'],
    ['local_area', 'Dinamo area', 'uz:samarkand:poi:dinamo-stadium'],
    ['residential_complex', 'Samarkand City', 'uz:samarkand:residential:samarkand-city'],
    ['poi', 'Yangi Ozbekiston Park', 'uz:samarkand:poi:yangi-ozbekiston-park'],
  ];

  for (const [type, canonical, id] of expected) {
    assert.equal(geoId('UZ', 'Samarkand', type, canonical), id, `${type}:${canonical}`);
    assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Samarkand', type, canonical }), false, `${type}:${canonical}`);
  }
});
