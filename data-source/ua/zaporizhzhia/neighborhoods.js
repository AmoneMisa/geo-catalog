const neighborhood = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 1200) => Object.freeze({
  id: `ua:zaporizhzhia:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UA',
  canonicalName,
  parentId: 'ua:zaporizhzhia',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
});

export const UA_ZAPORIZHZHIA_NEIGHBORHOOD_ENTITIES = Object.freeze([
  neighborhood('baburka', 'Baburka', 47.8218155, 35.0433224, 'node', 8711973115),
  neighborhood('borodynskyi', 'Borodynskyi', 47.8908407, 35.0709425, 'node', 8708705714),
  neighborhood('osypenkivskyi', 'Osypenkivskyi', 47.8838937, 35.0152975, 'node', 8708705716),
  neighborhood('kosmichnyi', 'Kosmichnyi', 47.7821916, 35.2223054, 'node', 8708705701),
  neighborhood('sotsmisto', 'Sotsmisto', 47.8604077, 35.100368, 'node', 8708705711),
  neighborhood('verkhnia-khortytsia', 'Verkhnia Khortytsia', 47.8605007, 35.0034136, 'node', 8708713717),
  neighborhood('velykyi-luh', 'Velykyi Luh', 47.9270146, 35.0940946, 'node', 8708705713),
  neighborhood('zelenyi-yar', 'Zelenyi Yar', 47.8426929, 35.1843721, 'node', 8708705709),
  neighborhood('pavlo-kychkas', 'Pavlo-Kychkas', 47.8940635, 35.14907, 'node', 8708705712),
  neighborhood('dniprovski-porohy', 'Dniprovski Porohy', 47.8971432, 35.0717056, 'way', 485429356, 1400),
]);
