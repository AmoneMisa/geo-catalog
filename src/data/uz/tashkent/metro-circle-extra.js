const station = (slug, canonicalName, lat, lng, wikidataId, osmId) => ({
  id: `uz:tashkent:metro:${slug}`,
  type: 'metro',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent',
  center: { lat, lng },
  source: 'wikidata',
  accuracy: 'entrance',
  accuracyM: 75,
  wikidataId,
  osm: { type: 'node', id: osmId },
});

export const TASHKENT_METRO_CIRCLE_EXTRA_ENTITIES = Object.freeze([
  station('yangiobod', 'Yangiobod', 41.25651, 69.35872, 'Q97344283', 10537927082),
  station('matonat', 'Matonat', 41.24447, 69.30832, 'Q117865916', 10537931294),
  station('qiyot', 'Qiyot', 41.24448, 69.29973, 'Q117865934', 10537931295),
  station('tolariq', 'Tolariq', 41.24451, 69.28496, 'Q117868715', 10538303447),
  station('xonobod', 'Xonobod', 41.23001, 69.27044, 'Q117868791', 10637629351),
  station('quruvchilar', 'Quruvchilar', 41.22164, 69.2605, 'Q117868858', 10637629352),
  station('turon', 'Turon', 41.21068, 69.23415, 'Q124820177', 11218653779),
]);
