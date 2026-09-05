const microdistrict = (slug, canonicalName, lat, lng, osmWayId, accuracyM = 1000) => Object.freeze({
  id: `kz:taraz:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'KZ',
  canonicalName,
  parentId: 'kz:taraz',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/way/${osmWayId}`,
  accuracy: 'neighborhood',
  accuracyM,
  osm: Object.freeze({ type: 'way', id: osmWayId }),
});

export const KZ_TARAZ_NEIGHBORHOOD_ENTITIES = Object.freeze([
  microdistrict('uly-dala', 'Улы Дала', 42.9282803, 71.3474346, 1202753002),
  microdistrict('alatau', 'Алатау', 42.8769675, 71.3406871, 469377337),
  microdistrict('mynbulak', 'Мынбулак', 42.8803092, 71.3357430, 449337858),
  microdistrict('samal', 'Самал', 42.8837430, 71.3428554, 449337860),
  microdistrict('shanyrak', 'Шанырак', 42.8284250, 71.3491839, 1518586471, 1600),
]);
