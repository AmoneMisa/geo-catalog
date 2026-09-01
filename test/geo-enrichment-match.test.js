import test from 'node:test';
import assert from 'node:assert/strict';
import {
  candidateScore,
  isAutoAcceptEligible,
  isCandidateInCity,
  nameScore,
  normalizeGeoText,
} from '../scripts/geo-enrichment-match.js';

const nukusBbox = Object.freeze({ south: 42.34, west: 59.52, north: 42.56, east: 59.69 });
const cityGeo = Object.freeze({ bbox: nukusBbox });
const mahalla = (canonical) => ({ country: 'UZ', city: 'Nukus', type: 'mahalla', canonical });
const candidate = (overrides = {}) => ({
  provider: 'nominatim',
  query: overrides.query || '',
  label: overrides.label || '',
  lat: overrides.lat ?? 42.45,
  lng: overrides.lng ?? 59.62,
  city: overrides.city ?? null,
  rawType: overrides.rawType ?? 'administrative',
  persistable: overrides.persistable ?? true,
  meta: overrides.meta ?? { category: 'boundary' },
});

test('Karakalpak Latin diacritics normalize to crawler-friendly forms', () => {
  assert.equal(normalizeGeoText('Qızıl qum'), 'qizil qum');
  assert.equal(normalizeGeoText('Tunǵısh qonıs MPJ'), 'tungish qonis');
  assert.equal(normalizeGeoText('Jolshılar kóshesi'), 'jolshilar');
  assert.ok(nameScore('Qurilisshi', 'Qurılısshı MPJ') >= 0.9);
});

test('Kazakh numbered-area markers normalize as microdistrict markers', () => {
  assert.equal(normalizeGeoText('1 шағын аудан'), '1');
  assert.equal(normalizeGeoText('1 ықшамаудан'), '1');
  assert.ok(nameScore('1 microdistrict', '1 шағын аудан') >= 0.95);
});

test('mahalla auto-accept requires the candidate itself to be the area', () => {
  assert.equal(isAutoAcceptEligible(mahalla('Jeke terek'), candidate({
    query: 'Jeke terek',
    label: 'Nukus Eko Bazar, 53, Ózbekstan gúzarı, №24 Jeke terek MPJ, Nókis',
    rawType: 'marketplace',
    meta: { category: 'amenity' },
  }), cityGeo), false);

  assert.equal(isAutoAcceptEligible(mahalla('Juwazshı'), candidate({
    query: 'Juwazshı',
    label: '№37 Juwazshı MPJ, Nókis, Qaraqalpaqstan Respublikası',
    rawType: 'residential',
    meta: { category: 'place' },
  }), cityGeo), true);
});

test('mahalla auto-accept rejects a same-name settlement outside the city', () => {
  assert.equal(isAutoAcceptEligible(mahalla('Darbent'), candidate({
    query: 'Darbent',
    label: 'Darbent, Shaǵalkópir, Nókis rayonı, Qaraqalpaqstan Respublikası',
    lat: 42.5774729,
    lng: 59.6573537,
    rawType: 'hamlet',
    meta: { category: 'place' },
  }), cityGeo), false);
});

test('generic Center cannot be accepted from a branded POI', () => {
  const row = { country: 'UZ', city: 'Qarshi', type: 'local_area', canonical: 'Center' };
  const qarshiGeo = { bbox: { south: 38.75, west: 65.72, north: 38.91, east: 65.90 } };
  assert.equal(isAutoAcceptEligible(row, candidate({
    query: 'Center',
    label: 'Lavash center, Qarshi, Uzbekistan',
    lat: 38.84,
    lng: 65.79,
    rawType: 'fast_food',
    meta: { category: 'amenity' },
  }), qarshiGeo), false);
});

test('numbered microdistrict needs an explicit area marker, not a house number', () => {
  const row = { country: 'UZ', city: 'Navoiy', type: 'microdistrict', canonical: '8 microdistrict' };
  const navoiyGeo = { bbox: { south: 40.03, west: 65.30, north: 40.16, east: 65.46 } };
  assert.equal(isAutoAcceptEligible(row, candidate({
    query: '8 microdistrict',
    label: '8, Zarafshon ko‘chasi, Navoiy',
    lat: 40.09,
    lng: 65.37,
    rawType: 'house',
    meta: { category: 'building' },
  }), navoiyGeo), false);

  assert.equal(isAutoAcceptEligible(row, candidate({
    query: '8 microdistrict',
    label: '8-mikrorayon, Navoiy, Uzbekistan',
    lat: 40.09,
    lng: 65.37,
    rawType: 'neighbourhood',
    meta: { category: 'place' },
  }), navoiyGeo), true);
});

test('localized Aktau city names fall back to canonical city-center containment', () => {
  const row = { country: 'KZ', city: 'Aktau', type: 'microdistrict', canonical: '1 microdistrict' };
  const aktauGeo = { center: { lat: 43.6532, lng: 51.1975 } };
  const neighbourhood = candidate({
    query: '1 microdistrict',
    label: '1 шағын аудан, Ақтау, Маңғыстау облысы, Қазақстан',
    city: 'Ақтау',
    lat: 43.6312032,
    lng: 51.1822583,
    rawType: 'neighbourhood',
    meta: { category: 'place' },
  });
  const residentialLanduse = candidate({
    query: '1 microdistrict',
    label: '1 микрорайон, 1 шағын аудан, Ақтау, Қазақстан',
    city: 'Ақтау',
    lat: 43.6342874,
    lng: 51.1786761,
    rawType: 'residential',
    meta: { category: 'landuse' },
  });
  const serviceWay = candidate({
    query: '1 microdistrict',
    label: '1 микрорайон, 1 шағын аудан, Ақтау, Қазақстан',
    city: 'Ақтау',
    lat: 43.6342874,
    lng: 51.1786761,
    rawType: 'service',
    meta: { category: 'highway' },
  });

  assert.equal(isCandidateInCity(row, neighbourhood, aktauGeo), true);
  assert.equal(isAutoAcceptEligible(row, neighbourhood, aktauGeo), true);
  assert.equal(isAutoAcceptEligible(row, residentialLanduse, aktauGeo), false);
  assert.equal(isAutoAcceptEligible(row, serviceWay, aktauGeo), false);
  assert.ok(candidateScore(row, neighbourhood, aktauGeo) > candidateScore(row, residentialLanduse, aktauGeo));
});
