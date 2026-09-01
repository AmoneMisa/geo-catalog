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
  wikidataPoi('fergana-international-airport', 'Fergana International Airport', 40.35880, 71.74500, 'Q547124', 260, 'poi.airport'),
  osmPoi('fergana-railway-station', 'Fergana Railway Station', 40.39511, 71.75479, 'node', 299428601, 110, 'poi.railway_station'),
  manualPoi('al-fargoniy-park', 'Al-Fargoniy Park', 40.38975, 71.78353, 260, 'poi.park'),
  manualPoi('independence-square', 'Independence Square', 40.386879, 71.784105, 320, 'poi.square'),
]);
