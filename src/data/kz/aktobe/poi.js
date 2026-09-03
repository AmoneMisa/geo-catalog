const wikidataPoi = (slug, type, canonicalName, lat, lng, wikidataId, accuracyM) => Object.freeze({
  id: `kz:aktobe:poi:${slug}`,
  type,
  country: 'KZ',
  canonicalName,
  parentId: 'kz:aktobe',
  center: Object.freeze({ lat, lng }),
  source: 'wikidata',
  accuracy: 'poi',
  accuracyM,
  wikidataId,
});

const osmPoi = (slug, type, canonicalName, lat, lng, osmType, osmId, accuracyM, wikidataId = null) => Object.freeze({
  id: `kz:aktobe:poi:${slug}`,
  type,
  country: 'KZ',
  canonicalName,
  parentId: 'kz:aktobe',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
  ...(wikidataId ? { wikidataId } : {}),
});

export const KZ_AKTOBE_POI_ENTITIES = Object.freeze([
  osmPoi('aktobe-international-airport', 'poi.airport', 'Aktobe International Airport', 50.245, 57.203331, 'way', 235315612, 1600, 'Q1430836'),
  wikidataPoi('aktobe-railway-station', 'poi.railway_station', 'Aktobé Railway Station', 50.283889, 57.214444, 'Q18920162', 180),
  osmPoi('koblandy-batyr-central-stadium', 'poi.stadium', 'Koblandy Batyr Central Stadium', 50.291389, 57.160306, 'way', 307134879, 180, 'Q190784'),
  wikidataPoi('nur-ghasyr-mosque', 'poi.mosque', 'Nur Ghasyr Mosque', 50.281667, 57.188889, 'Q13668724', 180),
]);
