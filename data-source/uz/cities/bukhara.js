const wikidataPoi = (slug, canonicalName, type, lat, lng, wikidataId, accuracyM = 140, osm = null) => ({
  id: `uz:bukhara:poi:${slug}`,
  type,
  country: 'UZ',
  canonicalName,
  parentId: 'uz:bukhara',
  center: { lat, lng },
  source: osm ? 'osm' : 'wikidata',
  accuracy: 'poi',
  accuracyM,
  wikidataId,
  ...(osm ? { osm } : {}),
});

const osmPoi = (slug, canonicalName, type, lat, lng, osmType, osmId, accuracyM = 140) => ({
  id: `uz:bukhara:poi:${slug}`,
  type,
  country: 'UZ',
  canonicalName,
  parentId: 'uz:bukhara',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

const osmLocalArea = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 900) => ({
  id: `uz:bukhara:local-area:${slug}`,
  type: 'local_area',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:bukhara',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

const osmMicrodistrict = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 700) => ({
  id: `uz:bukhara:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:bukhara',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

const osmStreet = (slug, canonicalName, lat, lng, osmWayId, accuracyM = 700) => ({
  id: `uz:bukhara:street:${slug}`,
  type: 'street',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:bukhara',
  center: { lat, lng },
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/way/${osmWayId}`,
  accuracy: 'street',
  accuracyM,
  osm: { type: 'way', id: osmWayId },
});

const mappedStreet = (slug, canonicalName, lat, lng, providerId, accuracyM = 650) => ({
  id: `uz:bukhara:street:${slug}`,
  type: 'street',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:bukhara',
  center: { lat, lng },
  source: 'manual',
  sourceUrl: `https://2gis.uz/bukhara/geo/${providerId}`,
  accuracy: 'street',
  accuracyM,
});

const officialLocalArea = (slug, canonicalName, lat, lng, accuracyM = 1400) => ({
  id: `uz:bukhara:local-area:${slug}`,
  type: 'local_area',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:bukhara',
  center: { lat, lng },
  source: 'official',
  accuracy: 'approximate',
  accuracyM,
});

export const BUKHARA_ENTITIES = Object.freeze([
  officialLocalArea('old-city', 'Old City', 39.77472, 64.42861, 1200),
  osmLocalArea('sharq', 'Sharq', 39.7650927, 64.454781, 'node', 3593630431, 850),
  osmLocalArea('railway-station-area', 'Railway Station area', 39.7721907, 64.4313289, 'node', 11804786229, 650),
  osmMicrodistrict('1-i-mikroraion', '1-й микрорайон', 39.7655498, 64.4290221, 'node', 3593587407),
  osmMicrodistrict('2-i-mikroraion', '2-й микрорайон', 39.7634222, 64.4326857, 'node', 3593587408),
  osmMicrodistrict('3-i-mikroraion', '3-й микрорайон', 39.7579038, 64.4291280, 'node', 3593587409),
  osmMicrodistrict('4-i-mikroraion', '4-й микрорайон', 39.7523475, 64.4303106, 'node', 3593587410),
  osmMicrodistrict('5a-mikroraion', '5А микрорайон', 39.7443596, 64.4194459, 'node', 3593587412),
  osmMicrodistrict('7-i-mikroraion', '7-й микрорайон', 39.7411183, 64.4041393, 'node', 6535785795),

  mappedStreet('1-y-povorot-ulitsy-makhtumkuli', '1-й поворот улицы Махтумкули улица', 39.816222, 64.443509, '70030077005738328'),
  mappedStreet('1-y-ulitsy-muborak', 'Улица 1-й улицы Муборак', 39.805897, 64.417944, '70030076847253265'),
  mappedStreet('1-ya-ulitsa-khavzi-bodom', '1-я улица Хавзи Бодом', 39.774168, 64.401637, '70030076717674903'),
  mappedStreet('1-ya-ulitsa-sheykhon', '1-я улица Шейхон', 39.815035, 64.42407, '70030076857236113'),
  mappedStreet('2-ya-ulitsa-khavzi-bodom', '2-я улица Хавзи Бодом', 39.774694, 64.400623, '70030076717672474'),
  osmStreet('chashmai-ayub', 'Чашмаи Аюб улица', 39.7789153, 64.4046196, 205823326),
  osmStreet('khafiza-sheraziya', 'улица Хафиза Шеразия', 39.7895839, 64.4023258, 201149195),
  osmStreet('marata-karimova', 'улица Марата Каримова', 39.7796663, 64.4059189, 1290035089),
  osmStreet('mirdustim', 'Мирдустим улица', 39.7743533, 64.4067019, 609341309),
  osmStreet('mukhtara-ashrafi', 'Мухтара Ашрафи улица', 39.777369, 64.4052448, 110280618),
  osmStreet('otabaya-eshanova', 'Отабая Эшанова улица', 39.7702272, 64.427349, 8151512),
  osmStreet('pistashikanon', 'Писташиканон улица', 39.7791802, 64.4038534, 113591052),

  wikidataPoi('bukhara-ark', 'Bukhara Ark', 'poi.fortress', 39.777778, 64.410278, 'Q4069358', 160),
  wikidataPoi('poi-kalon', 'Poi Kalon', 'poi.religious_complex', 39.776001, 64.414244, 'Q4368936', 140, { type: 'way', id: 1446270185 }),
  osmPoi('lyabi-hauz', 'Lyabi Hauz', 'poi.square', 39.77311, 64.42026, 'way', 67412309, 140),
  wikidataPoi('chor-minor', 'Chor Minor', 'poi.landmark', 39.774827, 64.427369, 'Q4517198', 110, { type: 'way', id: 202146561 }),
  wikidataPoi('bolo-hauz', 'Bolo Hauz', 'poi.mosque', 39.777778, 64.4075, 'Q4090820', 120),
  wikidataPoi('samanids-mausoleum', 'Samanids Mausoleum', 'poi.mausoleum', 39.777011, 64.40058, 'Q1268850', 120),
  wikidataPoi('bukhara-international-airport', 'Bukhara International Airport', 'poi.airport', 39.775, 64.483333, 'Q978200', 260, { type: 'relation', id: 12733977 }),
  wikidataPoi('sitorai-mohi-xosa', 'Sitorai Mohi Xosa', 'poi.palace', 39.81295, 64.44123, 'Q4421152', 140, { type: 'way', id: 197708190 }),
  osmPoi('bukhara-2', 'Bukhara-2', 'poi.railway_station', 39.7511441, 64.4635355, 'node', 1588259351, 110),
]);
