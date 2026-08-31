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

test('Odesa listing canonicals reuse broader verified locality owners', () => {
  assert.equal(
    geoId('UA', 'Odesa', 'microdistrict', 'Kotivskoho'),
    'ua:odesa:local-area:kotovskoho',
  );
  assert.equal(
    geoId('UA', 'Odesa', 'microdistrict', 'Malyi Fontan'),
    'ua:odesa:local-area:malyi-fontan',
  );
  assert.equal(
    geoId('UA', 'Odesa', 'microdistrict', 'Zastava-1'),
    'ua:odesa:microdistrict:zastava',
  );
  assert.equal(
    geoId('UA', 'Odesa', 'microdistrict', 'Zastava-2'),
    'ua:odesa:microdistrict:zastava',
  );

  for (const canonical of ['Center', 'Zolotyi Bereh']) {
    assert.equal(isUaOdesaCoverageGap({ country: 'UA', city: 'Odesa', type: 'microdistrict', canonical }), true, canonical);
  }
  for (const canonical of ['Zastava-1', 'Zastava-2']) {
    assert.equal(isUaOdesaCoverageGap({ country: 'UA', city: 'Odesa', type: 'microdistrict', canonical }), false, canonical);
  }
  assert.equal(UA_ODESA_COVERAGE_GAPS.length, 2);
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

test('Samarkand legacy spellings and parser buckets reuse verified physical owners', () => {
  assert.equal(
    geoId('UZ', 'Samarkand', 'mahalla', 'Sartepa'),
    'uz:samarkand:mahalla:sattepo',
  );
  assert.equal(
    geoId('UZ', 'Samarkand', 'microdistrict', 'Sartepa'),
    'uz:samarkand:mahalla:sattepo',
  );
  assert.equal(
    geoId('UZ', 'Samarkand', 'microdistrict', 'Sat-Tepo'),
    'uz:samarkand:mahalla:sattepo',
  );
  assert.equal(
    isGeoCoverageGap({ country: 'UZ', city: 'Samarkand', type: 'microdistrict', canonical: 'Sartepa' }),
    false,
  );
  assert.equal(
    isGeoCoverageGap({ country: 'UZ', city: 'Samarkand', type: 'microdistrict', canonical: 'Sat-Tepo' }),
    false,
  );
  assert.equal(
    geoId('UZ', 'Samarkand', 'microdistrict', 'Sogdiana'),
    'uz:samarkand:mahalla:sogdiana',
  );
  assert.equal(
    geoId('UZ', 'Samarkand', 'microdistrict', 'Kimyogarlar'),
    'uz:samarkand:settlement:kimyogarlar',
  );
  assert.equal(
    geoId('UZ', 'Samarkand', 'local_area', 'Sugdiyona'),
    'uz:samarkand:mahalla:sogdiana',
  );
});
