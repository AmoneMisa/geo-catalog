const station = (slug, canonicalName, lat, lng, osmId, wikidataId = null) => ({
  id: `kz:almaty:metro:${slug}`,
  type: 'metro',
  country: 'KZ',
  canonicalName,
  parentId: 'kz:almaty',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'poi',
  accuracyM: 80,
  osm: { type: 'node', id: osmId },
  ...(wikidataId ? { wikidataId } : {}),
});

export const ALMATY_METRO_ENTITIES = Object.freeze([
  station('raiymbek-batyr', 'Raiymbek Batyr', 43.27111, 76.94466, 9346636498, 'Q2002989'),
  station('zhibek-zholy', 'Zhibek Zholy', 43.26050, 76.94603, 2522351053, 'Q746678'),
  station('almaly', 'Almaly', 43.25204, 76.94710, 11496660771, 'Q2072127'),
  station('abay', 'Abay', 43.24255, 76.94845, 2522351049, 'Q638963'),
  station('baikonur', 'Baikonur', 43.24124, 76.92882, 2522351052, 'Q420603'),
  station('auezov-theatre', 'Auezov Theatre', 43.24027, 76.91702, 2522351055, 'Q2072183'),
  station('alatau', 'Alatau', 43.23845, 76.89755, 2522351050, 'Q2072205'),
  station('sairan', 'Sairan', 43.23662, 76.87688, 3464799079, 'Q3024359'),
  station('moskva', 'Moskva', 43.23049, 76.86730, 3464799078, 'Q3024377'),
  station('saryarka', 'Saryarka', 43.22369, 76.85825, 9354808688, 'Q4408837'),
  station('bauyrzhan-momyshuly', 'Bauyrzhan Momyshuly', 43.21645, 76.83783, 9354769024),
]);
