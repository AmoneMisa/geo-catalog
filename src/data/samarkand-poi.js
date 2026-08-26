const wikidataPoi = (slug, canonicalName, lat, lng, wikidataId, accuracyM = 120, osm = null) => ({
  id: `uz:samarkand:poi:${slug}`,
  type: 'poi',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:samarkand',
  center: { lat, lng },
  source: 'wikidata',
  accuracy: 'poi',
  accuracyM,
  wikidataId,
  ...(osm ? { osm } : {}),
});

const osmPoi = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 140, wikidataId = null) => ({
  id: `uz:samarkand:poi:${slug}`,
  type: 'poi',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:samarkand',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: { type: osmType, id: osmId },
  ...(wikidataId ? { wikidataId } : {}),
});

const manualPoi = (slug, canonicalName, lat, lng, accuracy = 'building', accuracyM = 160) => ({
  id: `uz:samarkand:poi:${slug}`,
  type: 'poi',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:samarkand',
  center: { lat, lng },
  source: 'manual',
  accuracy,
  accuracyM,
});

export const SAMARKAND_POI_ENTITIES = Object.freeze([
  wikidataPoi('registan-square', 'Registan Square', 39.654722, 66.975556, 'Q1373583', 120, { type: 'relation', id: 17141748 }),
  wikidataPoi('gur-e-amir', 'Gur-e Amir', 39.648333, 66.968889, 'Q1256223', 100),
  wikidataPoi('shohi-zinda', 'Shohi Zinda', 39.662620, 66.987878, 'Q671935', 140),
  wikidataPoi('bibi-khanym', 'Bibi-Khanym', 39.660556, 66.979722, 'Q679218', 100),
  wikidataPoi('siyob-bazaar', 'Siyob Bazaar', 39.661893, 66.979915, 'Q13534449', 120),
  wikidataPoi('ulugbek-observatory', 'Ulugbek Observatory', 39.674722, 67.005556, 'Q608580', 150),
  wikidataPoi('samarkand-international-airport', 'Samarkand International Airport', 39.700556, 66.983889, 'Q976746', 180, { type: 'relation', id: 3193755 }),
  wikidataPoi('samarkand-railway-station', 'Samarkand Railway Station', 39.685888, 66.928915, 'Q9333092', 90, { type: 'node', id: 2279305298 }),
  osmPoi('silk-road-samarkand', 'Silk Road Samarkand', 39.65960, 67.05576, 'node', 12536653209, 150),
  osmPoi('afrosiyob', 'Afrosiyob', 39.67045, 66.98799, 'way', 110296439, 250, 'Q2167520'),
  osmPoi('eternal-city', 'Eternal City', 39.65384, 67.06127, 'way', 1083701137, 180),
  osmPoi('alisher-navoiy-park', 'Alisher Navoiy Park', 39.64968, 66.95803, 'way', 203548053, 220),
  manualPoi('family-park', 'Family Park', 39.662847, 66.907978, 'building', 180),
]);
