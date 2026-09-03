const microdistrict = (slug, canonicalName, lat, lng, accuracyM, sourceUrl, osm = null) => Object.freeze({
  id: `kz:shymkent:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'KZ',
  canonicalName,
  parentId: 'kz:shymkent',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: 'neighborhood',
  accuracyM,
  ...(osm ? { osm: Object.freeze(osm) } : {}),
});

export const KZ_SHYMKENT_NEIGHBORHOOD_ENTITIES = Object.freeze([
  microdistrict('qaytpas-1', 'Қайтпас-1', 42.37547, 69.6422, 900, 'https://mapcarta.com/N1496101427', { type: 'node', id: 1496101427 }),
  microdistrict('samal-3', 'Самал-3', 42.373844, 69.552762, 1100, 'https://yandex.kz/maps/ru/221/chimkent/geo/samal_3_yqsham_audany/1957850119/'),
  microdistrict('asar', 'Асар', 42.406733, 69.59898, 1200, 'https://yandex.kz/maps/221/chimkent/geo/asar_yqsham_audany/1496992866/'),
]);
