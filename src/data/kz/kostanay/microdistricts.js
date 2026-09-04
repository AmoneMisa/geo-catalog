const microdistrict = (slug, canonicalName, lat, lng, osmWayId, accuracyM = 650) => Object.freeze({
  id: `kz:kostanay:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'KZ',
  canonicalName,
  parentId: 'kz:kostanay',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/way/${osmWayId}`,
  accuracy: 'neighborhood',
  accuracyM,
  osm: Object.freeze({ type: 'way', id: osmWayId }),
});

export const KZ_KOSTANAY_MICRODISTRICT_ENTITIES = Object.freeze([
  microdistrict('3-i-mikroraion', '3-й микрорайон', 53.1768500, 63.6121561, 163785078),
  microdistrict('5-i-mikroraion', '5-й микрорайон', 53.1718973, 63.5934744, 163785081),
  microdistrict('9-i-mikroraion', '9-й микрорайон', 53.1840130, 63.6013303, 163785084),
  microdistrict('nauryz', 'Наурыз', 53.1851349, 63.6175086, 163785085),
  microdistrict('bereke', 'Береке', 53.2336237, 63.5994053, 657304169, 900),
]);
