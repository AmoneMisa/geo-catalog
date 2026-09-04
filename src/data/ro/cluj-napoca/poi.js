const osmPoi = (slug, type, canonicalName, lat, lng, osmType, osmId, accuracyM, wikidataId = null) => Object.freeze({
  id: `ro:cluj-napoca:poi:${slug}`,
  type,
  country: 'RO',
  canonicalName,
  parentId: 'ro:cluj-napoca',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
  ...(wikidataId ? { wikidataId } : {}),
});

export const RO_CLUJ_NAPOCA_POI_ENTITIES = Object.freeze([
  osmPoi('avram-iancu-international-airport', 'poi.airport', 'Aeroportul Internațional „Avram Iancu” Cluj', 46.785091666666666, 23.686119444444444, 'way', 84575461, 1200, 'Q1068685'),
  osmPoi('cluj-napoca-railway-station', 'poi.railway_station', 'Cluj-Napoca Railway Station', 46.78463, 23.58617, 'node', 258987961, 180, 'Q59615300'),
  osmPoi('central-park-simion-barnutiu', 'poi.park', 'Parcul Central Simion Bărnuțiu', 46.76989, 23.57909, 'way', 23893331, 450, 'Q715958'),
]);
