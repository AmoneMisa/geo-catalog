const osmSpatial = (slug, canonicalName, type, lat, lng, osmType, osmId, accuracyM = 900) => ({
  id: `uz:namangan:${type.replace('_', '-')}:${slug}`,
  type,
  country: 'UZ',
  canonicalName,
  parentId: 'uz:namangan',
  center: { lat, lng },
  source: 'osm',
  accuracy: type === 'district' ? 'district' : 'poi',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

const wikidataPoi = (slug, canonicalName, lat, lng, wikidataId, accuracyM = 180) => ({
  id: `uz:namangan:poi:${slug}`,
  type: 'poi',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:namangan',
  center: { lat, lng },
  source: 'wikidata',
  accuracy: 'poi',
  accuracyM,
  wikidataId,
});

export const NAMANGAN_ENTITIES = Object.freeze([
  osmSpatial('davlatobod', 'Davlatobod', 'district', 41.00223, 71.60902, 'node', 12512971291, 1800),
  osmSpatial('yangi-namangan', 'Yangi Namangan', 'district', 41.03415, 71.63436, 'node', 12512915965, 1600),
  wikidataPoi('namangan-international-airport', 'Namangan International Airport', 40.98490, 71.55683, 'Q978313', 220),
  osmSpatial('namangan-railway-station', 'Namangan Railway Station', 'poi', 40.99959, 71.64403, 'node', 301722995, 100),
  osmSpatial('namangan-chorsu', 'Namangan Chorsu', 'poi', 41.00118, 71.67952, 'way', 625100490, 120),
  wikidataPoi('valley-of-legends', 'Valley of Legends', 41.003333, 71.616944, 'Q135947258', 250),
]);
