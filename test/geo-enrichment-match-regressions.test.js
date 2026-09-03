import test from 'node:test';
import assert from 'node:assert/strict';

import {
  candidateScore,
  isAutoAcceptEligible,
} from '../scripts/geo-enrichment-match.js';

const ANGREN_GEO = Object.freeze({
  center: { lat: 41.0167, lng: 70.1436 },
  bbox: { west: 69.98, south: 40.91, east: 70.25, north: 41.13 },
});

const ASAKA_GEO = Object.freeze({
  center: { lat: 40.6415, lng: 72.2387 },
  bbox: { west: 72.16, south: 40.57, east: 72.31, north: 40.71 },
});

const areaRow = (city, canonical) => ({
  country: 'UZ',
  city,
  type: 'local_area',
  canonical,
  parent: null,
  aliases: [],
});

const candidate = (overrides) => ({
  provider: 'nominatim',
  query: overrides.query,
  label: overrides.label,
  lat: overrides.lat,
  lng: overrides.lng,
  city: overrides.city ?? null,
  rawType: overrides.rawType,
  source: 'osm',
  persistable: true,
  meta: { category: overrides.category ?? null },
});

test('area auto-accept rejects a same-name cemetery POI (Angren / Dukent regression)', () => {
  const row = areaRow('Angren', 'Dukent');
  const value = candidate({
    query: 'Dukent',
    label: 'Дукент, Yangiobod-2, Angren shahri, Toshkent Viloyati, 110200, Oʻzbekiston',
    lat: 41.0708884,
    lng: 70.0859115,
    city: 'Angren',
    rawType: 'cemetery',
    category: 'landuse',
  });

  assert.equal(isAutoAcceptEligible(row, value, ANGREN_GEO), false);
});

test('generic Center does not auto-accept a POI containing center in its name', () => {
  const row = areaRow('Angren', 'Center');
  const value = candidate({
    query: 'Center',
    label: 'Центр УЗИ Соатали Пирдаус, Chikrizov ko\'chasi, Angren shahri, Toshkent Viloyati, Oʻzbekiston',
    lat: 41.0059915,
    lng: 70.0719796,
    city: 'Angren',
    rawType: 'hospital',
    category: 'amenity',
  });

  assert.equal(isAutoAcceptEligible(row, value, ANGREN_GEO), false);
});

test('area auto-accept rejects a geographically wrong same-word locality candidate', () => {
  const row = areaRow('Asaka', 'Center');
  const value = candidate({
    query: 'Center',
    label: 'Центр репродуктивного здоровья населения, Asaka mahalla, Toshkent shahri, Oʻzbekiston',
    lat: 41.3115219,
    lng: 69.301741,
    city: 'Tashkent',
    rawType: 'hospital',
    category: 'amenity',
  });

  assert.equal(isAutoAcceptEligible(row, value, ASAKA_GEO), false);
});

test('a direct local-area locality candidate remains eligible', () => {
  const row = areaRow('Angren', 'Dukent');
  const value = candidate({
    query: 'Dukent',
    label: 'Dukent, Angren shahri, Toshkent Viloyati, Oʻzbekiston',
    lat: 41.062,
    lng: 70.087,
    city: 'Angren',
    rawType: 'neighbourhood',
    category: 'place',
  });

  assert.equal(isAutoAcceptEligible(row, value, ANGREN_GEO), true);
  assert.ok(candidateScore(row, value, ANGREN_GEO) >= 0.84);
});
