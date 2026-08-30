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

export const BUKHARA_ENTITIES = Object.freeze([
  wikidataPoi('bukhara-ark', 'Bukhara Ark', 'poi.fortress', 39.777778, 64.410278, 'Q4069358', 160),
  wikidataPoi('poi-kalon', 'Poi Kalon', 'poi.religious_complex', 39.776001, 64.414244, 'Q4368936', 140, { type: 'way', id: 1446270185 }),
  osmPoi('lyabi-hauz', 'Lyabi Hauz', 'poi.square', 39.77311, 64.42026, 'way', 67412309, 140),
  wikidataPoi('chor-minor', 'Chor Minor', 'poi.landmark', 39.774827, 64.427369, 'Q4517198', 110, { type: 'way', id: 202146561 }),
  wikidataPoi('bolo-hauz', 'Bolo Hauz', 'poi.mosque', 39.777778, 64.4075, 'Q4090820', 120),
  wikidataPoi('samanids-mausoleum', 'Samanids Mausoleum', 'poi.mausoleum', 39.777011, 64.40058, 'Q1268850', 120),
  wikidataPoi('bukhara-international-airport', 'Bukhara International Airport', 'poi.airport', 39.775, 64.483333, 'Q978200', 260, { type: 'relation', id: 12733977 }),
  wikidataPoi('sitorai-mohi-xosa', 'Sitorai Mohi Xosa', 'poi.palace', 39.81295, 64.44123, 'Q4421152', 140, { type: 'way', id: 197708190 }),
]);
