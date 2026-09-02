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

test('named river POI cannot auto-accept a same-name hotel', () => {
  const row = { country: 'UA', city: 'Bila Tserkva', type: 'poi', canonical: 'Ros River' };
  const bilaTserkvaGeo = { center: { lat: 49.795, lng: 30.115 } };
  assert.equal(isAutoAcceptEligible(row, candidate({
    query: 'Ros River',
    label: 'Рось, 94, Олександрійський бульвар, Біла Церква, Україна',
    lat: 49.795,
    lng: 30.11,
    rawType: 'hotel',
    meta: { category: 'tourism' },
  }), bilaTserkvaGeo), false);

  assert.equal(isAutoAcceptEligible(row, candidate({
    query: 'Ros River',
    label: 'Рось, Біла Церква, Україна',
    lat: 49.79,
    lng: 30.12,
    rawType: 'river',
    meta: { category: 'waterway' },
  }), bilaTserkvaGeo), true);
});

test('railway station POI does not auto-accept a bus stop with station text', () => {
  const row = { country: 'UA', city: 'Berdychiv', type: 'poi', canonical: 'Railway Station' };
  const berdychivGeo = { center: { lat: 49.894, lng: 28.5815 } };
  assert.equal(isAutoAcceptEligible(row, candidate({
    query: 'Railway Station',
    label: 'Залізничний вокзал, Бердичів, Україна',
    lat: 49.892,
    lng: 28.6,
    rawType: 'bus_stop',
    meta: { category: 'highway' },
  }), berdychivGeo), false);

  assert.equal(isAutoAcceptEligible(row, candidate({
    query: 'Railway Station',
    label: 'Berdychiv railway station, Бердичів, Україна',
    lat: 49.892,
    lng: 28.6,
    rawType: 'railway_station',
    meta: { category: 'railway' },
  }), berdychivGeo), true);
});

test('nearby separate settlements are not treated as city neighborhoods', () => {
  const row = { country: 'UA', city: 'Uzhhorod', type: 'microdistrict', canonical: 'Minai' };
  const uzhhorodGeo = { center: { lat: 48.6224, lng: 22.3023 } };
  assert.equal(isCandidateInCity(row, candidate({
    query: 'Minai',
    label: 'Минай, Холмківська сільська громада, Ужгородський район, Україна',
    city: 'Минай',
    lat: 48.589088,
    lng: 22.27718,
    rawType: 'administrative',
    meta: { category: 'boundary' },
  }), uzhhorodGeo), false);
});

test('city-center fallback no longer admits a different city 34 km away', () => {
  const row = { country: 'UA', city: 'Vinnytsia', type: 'poi', canonical: 'Friendship Park', aliases: ['парк Дружби народів'] };
  const vinnytsiaGeo = { center: { lat: 49.232, lng: 28.468 } };
  assert.equal(isCandidateInCity(row, candidate({
    query: 'парк Дружби народів',
    label: 'Парк Дружби Народів, Жмеринка, Вінницька область, Україна',
    city: 'Жмеринка',
    lat: 49.0401142,
    lng: 28.0969646,
    rawType: 'park',
    meta: { category: 'leisure' },
  }), vinnytsiaGeo), false);
});

test('DniproHES requires a hydro object instead of a same-name transport stop', () => {
  const row = { country: 'UA', city: 'Zaporizhzhia', type: 'poi', canonical: 'DniproHES', aliases: ['ДніпроГЕС', 'ДнепроГЭС'] };
  const zaporizhzhiaGeo = { bbox: { south: 47.75, west: 34.98, north: 47.96, east: 35.37 } };
  assert.equal(isAutoAcceptEligible(row, candidate({
    query: 'ДніпроГЕС',
    label: 'ДніпроГЕС, Запоріжжя, Україна',
    lat: 47.8743681,
    lng: 35.0783239,
    rawType: 'bus_stop',
    meta: { category: 'highway' },
  }), zaporizhzhiaGeo), false);
  assert.equal(isAutoAcceptEligible(row, candidate({
    query: 'ДніпроГЕС',
    label: 'Дніпровська ГЕС, Запоріжжя, Україна',
    lat: 47.8678685,
    lng: 35.089358,
    rawType: 'dam',
    meta: { category: 'waterway' },
  }), zaporizhzhiaGeo), true);
});

test('mall landmarks reject parking lots and accept the mall owner', () => {
  const row = { country: 'UA', city: 'Zaporizhzhia', type: 'poi', canonical: 'City Mall', aliases: [] };
  const zaporizhzhiaGeo = { bbox: { south: 47.75, west: 34.98, north: 47.96, east: 35.37 } };
  assert.equal(isAutoAcceptEligible(row, candidate({
    query: 'City Mall',
    label: 'City mall, Запоріжжя, Україна',
    lat: 47.818805,
    lng: 35.1558985,
    rawType: 'parking',
    meta: { category: 'amenity' },
  }), zaporizhzhiaGeo), false);
  assert.equal(isAutoAcceptEligible(row, candidate({
    query: 'City Mall',
    label: 'City Mall, Запоріжжя, Україна',
    lat: 47.8183818,
    lng: 35.1569137,
    rawType: 'mall',
    meta: { category: 'shop' },
  }), zaporizhzhiaGeo), true);
});

test('park aliases reject transport stops with the same name', () => {
  const row = { country: 'UA', city: 'Ternopil', type: 'poi', canonical: 'National Revival Park', aliases: ['парк Національного відродження'] };
  const ternopilGeo = { center: { lat: 49.5558, lng: 25.5924 } };
  assert.equal(isAutoAcceptEligible(row, candidate({
    query: 'парк Національного відродження',
    label: 'Парк Національного відродження, Тернопіль, Україна',
    lat: 49.5574115,
    lng: 25.631643,
    rawType: 'bus_stop',
    meta: { category: 'highway' },
  }), ternopilGeo), false);
  assert.equal(isAutoAcceptEligible(row, candidate({
    query: 'парк Національного відродження',
    label: 'Парк Національного Відродження, Тернопіль, Україна',
    lat: 49.5533185,
    lng: 25.6339767,
    rawType: 'park',
    meta: { category: 'leisure' },
  }), ternopilGeo), true);
});
