import test from 'node:test';
import assert from 'node:assert/strict';

import {
  candidateScore,
  isAutoAcceptEligible,
  isCandidateInCity,
  normalizeGeoText,
} from '../scripts/geo-enrichment-match.js';

const candidate = (overrides = {}) => ({
  provider: 'nominatim',
  query: overrides.query || '',
  label: overrides.label || '',
  lat: overrides.lat ?? 43.65,
  lng: overrides.lng ?? 51.19,
  city: overrides.city ?? null,
  rawType: overrides.rawType ?? 'neighbourhood',
  persistable: overrides.persistable ?? true,
  meta: overrides.meta ?? { category: 'place' },
});

test('Latin and Cyrillic A suffixes are equivalent for numbered microdistricts', () => {
  assert.equal(normalizeGeoText('3A microdistrict'), '3a');
  assert.equal(normalizeGeoText('3А микрорайон'), '3a');
  assert.equal(normalizeGeoText('3 A microdistrict'), '3a');

  const row = { country: 'KZ', city: 'Aktau', type: 'microdistrict', canonical: '3A microdistrict' };
  const aktau = { center: { lat: 43.6532, lng: 51.1975 } };
  const exact = candidate({
    query: '3A microdistrict',
    label: '3А микрорайон, Ақтау, Маңғыстау облысы, Қазақстан',
    city: 'Ақтау',
    lat: 43.64,
    lng: 51.18,
  });

  assert.equal(isCandidateInCity(row, exact, aktau), true);
  assert.equal(isAutoAcceptEligible(row, exact, aktau), true);
});

test('explicit neighbourhood outranks residential landuse for numbered microdistricts', () => {
  const row = { country: 'KZ', city: 'Aktau', type: 'microdistrict', canonical: '3 microdistrict' };
  const aktau = { center: { lat: 43.6532, lng: 51.1975 } };
  const neighbourhood = candidate({
    query: '3 microdistrict',
    label: '3 микрорайон, Ақтау, Қазақстан',
    city: 'Ақтау',
    rawType: 'neighbourhood',
    meta: { category: 'place' },
  });
  const residential = candidate({
    query: '3 microdistrict',
    label: '3 микрорайон, Ақтау, Қазақстан',
    city: 'Ақтау',
    rawType: 'residential',
    meta: { category: 'landuse' },
  });

  assert.equal(isAutoAcceptEligible(row, neighbourhood, aktau), true);
  assert.equal(isAutoAcceptEligible(row, residential, aktau), false);
  assert.ok(candidateScore(row, neighbourhood, aktau) > candidateScore(row, residential, aktau));
});

test('far explicit provider city cannot be accepted as Navoiy', () => {
  const row = { country: 'UZ', city: 'Navoiy', type: 'microdistrict', canonical: '11 microdistrict' };
  const navoiy = { center: { lat: 40.0844, lng: 65.3792 } };
  const zarafshonApartment = candidate({
    query: '11 microdistrict',
    label: '11, 1-chi kichik tuman, Zarafshon shahri, Navoiy Viloyati, Oʻzbekiston',
    city: 'Zarafshon',
    lat: 41.5689725,
    lng: 64.1973278,
    rawType: 'apartments',
    meta: { category: 'building' },
  });

  assert.equal(isCandidateInCity(row, zarafshonApartment, navoiy), false);
  assert.equal(isAutoAcceptEligible(row, zarafshonApartment, navoiy), false);
});

test('Tashkent mahalla cannot auto-accept the same-name Chinoz hamlet', () => {
  const row = { country: 'UZ', city: 'Tashkent', type: 'mahalla', canonical: "Bog'bon" };
  const tashkent = {
    center: { lat: 41.3123363, lng: 69.2787079 },
    bbox: { south: 41.1577334, west: 69.121797, north: 41.4224955, east: 69.525908 },
  };
  const chinozHamlet = candidate({
    query: "Bog'bon",
    label: "Bog'bon, Chinoz Tumani, Toshkent Viloyati, Oʻzbekiston",
    city: 'Chinoz',
    lat: 41.0017371,
    lng: 68.8850292,
    rawType: 'hamlet',
    meta: { category: 'place' },
  });

  assert.equal(isCandidateInCity(row, chinozHamlet, tashkent), false);
  assert.equal(isAutoAcceptEligible(row, chinozHamlet, tashkent), false);
});

test('explicit mismatched city gets a tighter fallback for non-area candidates', () => {
  const row = { country: 'KZ', city: 'Aktau', type: 'poi', canonical: 'Example Park' };
  const aktau = { center: { lat: 43.6532, lng: 51.1975 } };
  const wrongCity = candidate({
    query: 'Example Park',
    label: 'Example Park, Other City, Kazakhstan',
    city: 'Other City',
    lat: 43.7432,
    lng: 51.1975,
    rawType: 'park',
    meta: { category: 'leisure' },
  });

  assert.equal(isCandidateInCity(row, wrongCity, aktau), false);
});
