const osmPoi = (citySlug, slug, canonicalName, type, lat, lng, osmType, osmId, accuracyM = 140, wikidataId = null) => ({
  id: `uz:${citySlug}:poi:${slug}`,
  type,
  country: 'UZ',
  canonicalName,
  parentId: `uz:${citySlug}`,
  center: { lat, lng },
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: { type: osmType, id: osmId },
  ...(wikidataId ? { wikidataId } : {}),
});

const osmArea = (citySlug, slug, canonicalName, type, lat, lng, osmType, osmId, accuracyM = 900) => ({
  id: `uz:${citySlug}:${type.replace('_', '-')}:${slug}`,
  type,
  country: 'UZ',
  canonicalName,
  parentId: `uz:${citySlug}`,
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

const wikidataPoi = (citySlug, slug, canonicalName, type, lat, lng, wikidataId, accuracyM = 220) => ({
  id: `uz:${citySlug}:poi:${slug}`,
  type,
  country: 'UZ',
  canonicalName,
  parentId: `uz:${citySlug}`,
  center: { lat, lng },
  source: 'wikidata',
  accuracy: 'poi',
  accuracyM,
  wikidataId,
});

const approximateArea = (citySlug, slug, canonicalName, lat, lng, accuracyM = 1200) => ({
  id: `uz:${citySlug}:local-area:${slug}`,
  type: 'local_area',
  country: 'UZ',
  canonicalName,
  parentId: `uz:${citySlug}`,
  center: { lat, lng },
  source: 'manual',
  accuracy: 'approximate',
  accuracyM,
});

export const UZ_SECONDARY_CITY_ANCHORS = Object.freeze([
  osmPoi('navoiy', 'navoiy-railway-station', 'Navoiy Railway Station', 'poi.railway_station', 40.07297, 65.39630, 'node', 1238436292, 120),
  osmPoi('jizzakh', 'jizzakh-railway-station', 'Jizzakh Railway Station', 'poi.railway_station', 40.09821, 67.84245, 'node', 8327788744, 120),
  osmPoi('termez', 'termez-railway-station', 'Termez Railway Station', 'poi.railway_station', 37.25114, 67.28607, 'node', 1584479577, 120),
  osmPoi('gulistan', 'gulistan-railway-station', 'Gulistan Railway Station', 'poi.railway_station', 40.49617, 68.76487, 'node', 8343551120, 120),
  osmPoi('chirchiq', 'chirchiq-railway-station', 'Chirchiq Railway Station', 'poi.railway_station', 41.47914, 69.59745, 'way', 147143855, 120),
  // Reservoir is not a catalog POI subtype. Keep the lexicon-compatible generic
  // POI owner and preserve the direct OSM relation as provenance.
  osmPoi('xonobod', 'andijan-reservoir', 'Andijan Reservoir', 'poi', 40.774721, 73.1169502, 'relation', 14663093, 300),
  osmPoi('kattakurgan', 'kattakurgan-reservoir', 'Kattakurgan Reservoir', 'poi', 39.7905028, 66.2065745, 'relation', 12571708, 320),
  wikidataPoi('navoiy', 'navoiy-international-airport', 'Navoi International Airport', 'poi.airport', 40.11720, 65.17080, 'Q1229483', 300),
  wikidataPoi('termez', 'termez-airport', 'Termez International Airport', 'poi.airport', 37.28670, 67.30990, 'Q658171', 300),

  osmArea('jizzakh', 'zilol', 'Zilol', 'local_area', 40.172831, 67.8421078, 'node', 11725490815, 850),
  osmArea('navoiy', 'guliston', 'Guliston', 'mahalla', 40.0822634, 65.4033527, 'way', 1137853275, 700),

  approximateArea('navoiy', 'railway-station-area', 'Railway Station area', 40.07297, 65.39630, 1100),
  approximateArea('jizzakh', 'railway-station-area', 'Railway Station area', 40.09821, 67.84245, 1100),
  approximateArea('termez', 'railway-station-area', 'Railway Station area', 37.25114, 67.28607, 1100),
  approximateArea('termez', 'airport-area', 'Airport area', 37.28670, 67.30990, 1500),
  approximateArea('gulistan', 'railway-station-area', 'Railway Station area', 40.49617, 68.76487, 1000),
  approximateArea('chirchiq', 'railway-station-area', 'Railway Station area', 41.47914, 69.59745, 1100),
]);
