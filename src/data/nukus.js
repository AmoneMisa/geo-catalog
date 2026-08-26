const osmPoi = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 140, wikidataId = null) => ({
  id: `uz:nukus:poi:${slug}`,
  type: 'poi',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:nukus',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: { type: osmType, id: osmId },
  ...(wikidataId ? { wikidataId } : {}),
});

const osmMahalla = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 800) => ({
  id: `uz:nukus:mahalla:${slug}`,
  type: 'mahalla',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:nukus',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

export const NUKUS_ENTITIES = Object.freeze([
  osmPoi('savitsky-museum', 'Savitsky Museum', 42.46545, 59.61301, 'way', 884013231, 100, 'Q597055'),
  osmPoi('nukus-airport', 'Nukus Airport', 42.488333, 59.623333, 'relation', 2268677, 260, 'Q976276'),
  osmPoi('karakalpak-state-university', 'Karakalpak State University', 42.45287, 59.62706, 'node', 6974150800, 120, 'Q20536396'),

  osmMahalla('gone-qala', 'Gone qala', 42.45787, 59.58670, 'way', 415541775, 950),
  osmMahalla('turan', 'Turan', 42.45881, 59.59681, 'way', 1009066215, 720),
  osmMahalla('samanbay', 'Samanbay', 42.47395, 59.55360, 'way', 1009066209, 820),
  osmMahalla('nawbahar', 'Nawbahar', 42.39587, 59.61677, 'way', 1009066237, 850),
  osmMahalla('temir-jol', 'Temir jol', 42.43645, 59.63805, 'way', 1009066238, 720),
  osmMahalla('nur', 'Nur', 42.44289, 59.64271, 'way', 1009066198, 720),
  osmMahalla('anasay', 'Anasay', 42.47604, 59.55776, 'way', 1009066197, 800),
  osmMahalla('nawriz', 'Nawriz', 42.37986, 59.64283, 'way', 1009066233, 820),
  osmMahalla('jipek-joli', 'Jipek jolı', 42.38295, 59.62425, 'way', 1009066190, 760),
  osmMahalla('jayxun', 'Jayxun', 42.36920, 59.63526, 'way', 1009066248, 900),
]);
