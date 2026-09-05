const wikidataPoi = (slug, type, canonicalName, lat, lng, wikidataId, accuracyM) => Object.freeze({
  id: `kz:taraz:poi:${slug}`,
  type,
  country: 'KZ',
  canonicalName,
  parentId: 'kz:taraz',
  center: Object.freeze({ lat, lng }),
  source: 'wikidata',
  accuracy: 'poi',
  accuracyM,
  wikidataId,
});

export const KZ_TARAZ_POI_ENTITIES = Object.freeze([
  wikidataPoi('taraz-airport', 'poi.airport', 'Taraz Airport', 42.853611, 71.303611, 'Q1433007', 1600),
  wikidataPoi('taraz-railway-station', 'poi.railway_station', 'Taraz Railway Station', 42.87, 71.378889, 'Q97547455', 180),
  wikidataPoi('karakhan-mausoleum', 'poi.landmark', 'Karakhan Mausoleum', 42.900617, 71.38734, 'Q4273770', 120),
]);
