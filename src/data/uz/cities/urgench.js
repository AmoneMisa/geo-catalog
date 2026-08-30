const osmMahalla = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 700) => ({
  id: `uz:urgench:mahalla:${slug}`,
  type: 'mahalla',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:urgench',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

const osmPoi = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 120, type = 'poi') => ({
  id: `uz:urgench:poi:${slug}`,
  type,
  country: 'UZ',
  canonicalName,
  parentId: 'uz:urgench',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

export const URGENCH_ENTITIES = Object.freeze([
  osmMahalla('mashal', "Mash'al", 41.54191, 60.61379, 'way', 986185170, 720),
  osmMahalla('yangi-hayot', 'Yangi hayot', 41.54361, 60.66071, 'way', 993685089, 760),
  osmMahalla('jingovuz', 'Jingovuz', 41.54642, 60.60387, 'node', 10294606905, 650),
  osmPoi('urgench-international-airport', 'Urgench International Airport', 41.58490, 60.63353, 'way', 167429835, 220, 'poi.airport'),
  osmPoi('urgench-railway-station', 'Urgench Railway Station', 41.53650, 60.63215, 'node', 1585865853, 100, 'poi.railway_station'),
  osmPoi('urgench-state-university', 'Urgench State University', 41.55635, 60.60703, 'way', 458331866, 120, 'poi.university'),
  osmPoi('al-xorazmiy-monument', 'Al-Xorazmiy Monument', 41.58168, 60.63183, 'node', 4465962252, 90, 'poi.monument'),
]);
