const osmPoi = (slug, type, canonicalName, lat, lng, osmType, osmId, accuracyM, wikidataId = null) => Object.freeze({
  id: `kz:astana:poi:${slug}`,
  type,
  country: 'KZ',
  canonicalName,
  parentId: 'kz:astana',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
  ...(wikidataId ? { wikidataId } : {}),
});

export const KZ_ASTANA_POI_ENTITIES = Object.freeze([
  osmPoi('bayterek', 'poi.monument', 'Bayterek', 51.12829, 71.43046, 'way', 230401645, 100, 'Q804210'),
  osmPoi('national-museum', 'poi.museum', 'National Museum of the Republic of Kazakhstan', 51.11823, 71.46938, 'node', 4894937300, 180, 'Q18405670'),
  osmPoi('khan-shatyr', 'poi.shopping_mall', 'Khan Shatyr', 51.13251, 71.40387, 'way', 460703779, 260, 'Q671484'),
  osmPoi('palace-of-peace-and-reconciliation', 'poi.cultural_venue', 'Palace of Peace and Reconciliation', 51.12311, 71.46346, 'node', 5130027840, 180, 'Q2119741'),
  osmPoi('astana-nurly-zhol-station', 'poi.railway_station', 'Astana-Nurly Zhol Railway Station', 51.11236, 71.53172, 'way', 424980293, 300, 'Q30642068'),
  osmPoi('astana-international-airport', 'poi.airport', 'Astana International Airport', 51.02589, 71.46629, 'way', 507841374, 1800, 'Q174233'),
  osmPoi('hazrat-sultan-mosque', 'poi.mosque', 'Hazrat Sultan Mosque', 51.12543, 71.47219, 'way', 240860325, 350, 'Q4494668'),
  osmPoi('astana-opera', 'poi.cultural_venue', 'Astana Opera', 51.13545, 71.41075, 'way', 917478479, 260, 'Q21371563'),
  osmPoi('city-circus', 'poi.cultural_venue', 'City Circus', 51.14507, 71.41891, 'node', 5126825313, 180),
]);
