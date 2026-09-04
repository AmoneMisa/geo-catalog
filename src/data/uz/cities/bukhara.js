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
