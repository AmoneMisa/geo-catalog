const accuracyByType = Object.freeze({
  district: 'district',
  microdistrict: 'neighborhood',
  mahalla: 'neighborhood',
  local_area: 'neighborhood',
  street: 'street',
  poi: 'poi',
});

const osmSpatial = (slug, canonicalName, type, lat, lng, osmType, osmId, accuracyM = 900) => ({
  id: `uz:namangan:${type.startsWith('poi.') ? 'poi' : type.replace('_', '-')}:${slug}`,
  type,
  country: 'UZ',
  canonicalName,
  parentId: 'uz:namangan',
  center: { lat, lng },
  source: 'osm',
  accuracy: type.startsWith('poi.') ? 'poi' : accuracyByType[type] || 'approximate',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

const wikidataPoi = (slug, canonicalName, lat, lng, wikidataId, accuracyM = 180, type = 'poi') => ({
  id: `uz:namangan:poi:${slug}`,
  type,
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
  osmSpatial('1-microdistrict', '1 microdistrict', 'microdistrict', 41.00477, 71.58837, 'way', 717033061, 500),
  osmSpatial('2-microdistrict', '2 microdistrict', 'microdistrict', 40.99877, 71.58907, 'way', 717045170, 500),
  osmSpatial('3-microdistrict', '3 microdistrict', 'microdistrict', 41.00376, 71.60365, 'way', 1504295427, 500),
  osmSpatial('4-microdistrict', '4 microdistrict', 'microdistrict', 40.99387, 71.60421, 'way', 1503603833, 500),
  osmSpatial('5-microdistrict', '5 microdistrict', 'microdistrict', 40.99735, 71.60093, 'way', 1504295428, 500),
  osmSpatial('6-microdistrict', '6 microdistrict', 'microdistrict', 40.99712, 71.61644, 'way', 318257014, 520),
  osmSpatial('porloq', 'Porloq', 'mahalla', 41.0060152, 71.5988033, 'relation', 20587979, 700),
  osmSpatial('boburshox', 'Boburshox', 'mahalla', 40.9911956, 71.6810535, 'relation', 20578134, 700),

  // Street matches exposed while resolving same-name local-area lexicon rows.
  // These remain independent street entities; a road hit must never satisfy a local_area gap.
  osmSpatial('galaba', 'Galaba Street', 'street', 41.0125935, 71.6745114, 'way', 798437179, 1100),
  osmSpatial('alisher-navoiy', 'Alisher Navoiy Street', 'street', 40.9972682, 71.6464427, 'way', 720208509, 2200),
  osmSpatial('islom-karimov', 'Islom Karimov Street', 'street', 41.0070306, 71.6249352, 'way', 26978858, 2600),
  osmSpatial('qoqimboyshox', 'Qoqimboyshox Street', 'street', 41.0027769, 71.6109908, 'way', 718816732, 1500),
  osmSpatial('nodira', 'Nodira Street', 'street', 40.9953489, 71.6673385, 'way', 525607577, 1200),

  wikidataPoi('namangan-international-airport', 'Namangan International Airport', 40.98490, 71.55683, 'Q978313', 220, 'poi.airport'),
  osmSpatial('namangan-railway-station', 'Namangan Railway Station', 'poi.railway_station', 40.99959, 71.64403, 'node', 301722995, 100),
  osmSpatial('namangan-chorsu', 'Namangan Chorsu', 'poi.market', 41.00118, 71.67952, 'way', 625100490, 120),
  wikidataPoi('valley-of-legends', 'Valley of Legends', 41.003333, 71.616944, 'Q135947258', 250, 'poi.amusement_park'),
  osmSpatial('bobur-park', 'Bobur Park', 'poi.park', 40.99679, 71.67197, 'way', 399917916, 140),
  osmSpatial('yangi-ozbekiston-park', 'Yangi Ozbekiston Park', 'poi.amusement_park', 41.0023723, 71.5600246, 'way', 560575723, 180),
]);
