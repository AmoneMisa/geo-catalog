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
  microdistrict('1-i-mikroraion', '1-й микрорайон', 53.1752326, 63.6072274, 315905518),
  microdistrict('2-i-mikroraion', '2-й микрорайон', 53.1784894, 63.6064351, 163785077),
  microdistrict('6-i-mikroraion', '6-й микрорайон', 53.1769863, 63.5901354, 163785082),
  microdistrict('7-i-mikroraion', '7-й микрорайон', 53.1819089, 63.5900374, 163778559),
  microdistrict('8-i-mikroraion', '8-й микрорайон', 53.1852237, 63.5915518, 163785083),
]);
