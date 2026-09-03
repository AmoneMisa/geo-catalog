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
]);
