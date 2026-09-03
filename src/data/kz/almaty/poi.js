const osmPoi = (slug, type, canonicalName, lat, lng, osmType, osmId, accuracyM, wikidataId = null) => Object.freeze({
  id: `kz:almaty:poi:${slug}`,
  type,
  country: 'KZ',
  canonicalName,
  parentId: 'kz:almaty',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
  ...(wikidataId ? { wikidataId } : {}),
});

export const KZ_ALMATY_POI_ENTITIES = Object.freeze([
  osmPoi('medeu-ice-rink', 'poi.stadium', 'Medeu Ice Rink', 43.15768, 77.059, 'way', 171504550, 180, 'Q864796'),
  osmPoi('kok-tobe', 'poi.landmark', 'Kok Tobe', 43.2331, 76.97553, 'node', 1826331904, 350, 'Q1795699'),
  osmPoi('panfilov-park', 'poi.park', 'Park of the 28 Panfilov Guardsmen', 43.25876, 76.95315, 'way', 208493040, 500, 'Q2052602'),
  osmPoi('sayran-bus-terminal', 'poi.bus_station', 'Sayran Bus Terminal', 43.24482, 76.85832, 'way', 159955644, 180, 'Q28407139'),
  osmPoi('almaty-2-railway-station', 'poi.railway_station', 'Almaty-2 Railway Station', 43.27376, 76.93925, 'way', 142743485, 160, 'Q800371'),
  osmPoi('almaty-international-airport', 'poi.airport', 'Almaty International Airport', 43.35211, 77.0405, 'relation', 3061093, 1600, 'Q858844'),
  osmPoi('central-state-museum', 'poi.museum', 'Central State Museum of Kazakhstan', 43.23588, 76.95075, 'way', 444574821, 140, 'Q190456'),
  osmPoi('central-park', 'poi.park', 'Central Park', 43.26214, 76.96927, 'way', 232715414, 900, 'Q190387'),
  osmPoi('ascension-cathedral', 'poi.cathedral', 'Ascension Cathedral', 43.25861, 76.95333, 'way', 50648292, 90, 'Q1078589'),
  osmPoi('almaty-zoo', 'poi.zoo', 'Almaty Zoo', 43.26342, 76.97405, 'way', 222624434, 650, 'Q4062771'),
]);
