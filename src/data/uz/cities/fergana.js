const osmPoi = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 130, type = 'poi') => ({
  id: `uz:fergana:poi:${slug}`,
  type,
  country: 'UZ',
  canonicalName,
  parentId: 'uz:fergana',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

const osmMahalla = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 800) => ({
  id: `uz:fergana:mahalla:${slug}`,
  type: 'mahalla',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:fergana',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

const wikidataPoi = (slug, canonicalName, lat, lng, wikidataId, accuracyM = 220, type = 'poi') => ({
  id: `uz:fergana:poi:${slug}`,
  type,
  country: 'UZ',
  canonicalName,
  parentId: 'uz:fergana',
  center: { lat, lng },
  source: 'wikidata',
  accuracy: 'poi',
  accuracyM,
  wikidataId,
});

const manualPoi = (slug, canonicalName, lat, lng, accuracyM = 320, type = 'poi') => ({
  id: `uz:fergana:poi:${slug}`,
  type,
  country: 'UZ',
  canonicalName,
  parentId: 'uz:fergana',
  center: { lat, lng },
  source: 'manual',
  accuracy: 'poi',
  accuracyM,
});

export const FERGANA_ENTITIES = Object.freeze([
  osmMahalla('marifat', "Ma'rifat", 40.3798634, 71.7981439, 'relation', 20577024, 800),
  osmMahalla('mustaqillik', 'Mustaqillik', 40.3826570, 71.8370632, 'relation', 20582351, 850),
  osmMahalla('navoiy', 'Navoiy', 40.3711205, 71.7889134, 'relation', 20577025, 800),
  wikidataPoi('fergana-international-airport', 'Fergana International Airport', 40.35880, 71.74500, 'Q547124', 260, 'poi.airport'),
  osmPoi('fergana-railway-station', 'Fergana Railway Station', 40.39511, 71.75479, 'node', 299428601, 110, 'poi.railway_station'),
  manualPoi('al-fargoniy-park', 'Al-Fargoniy Park', 40.38975, 71.78353, 260, 'poi.park'),
  manualPoi('independence-square', 'Independence Square', 40.386879, 71.784105, 320, 'poi.square'),
]);
