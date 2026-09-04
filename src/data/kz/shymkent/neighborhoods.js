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

const osmMicrodistrict = (slug, canonicalName, lat, lng, osmWayId, accuracyM = 900) => Object.freeze({
  id: `kz:shymkent:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'KZ',
  canonicalName,
  parentId: 'kz:shymkent',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/way/${osmWayId}`,
  accuracy: 'neighborhood',
  accuracyM,
  osm: Object.freeze({ type: 'way', id: osmWayId }),
});

export const KZ_SHYMKENT_NEIGHBORHOOD_ENTITIES = Object.freeze([
  microdistrict('qaytpas-1', 'Қайтпас-1', 42.37547, 69.6422, 900, 'https://mapcarta.com/N1496101427', { type: 'node', id: 1496101427 }),
  microdistrict('samal-3', 'Самал-3', 42.373844, 69.552762, 1100, 'https://yandex.kz/maps/ru/221/chimkent/geo/samal_3_yqsham_audany/1957850119/'),
  microdistrict('asar', 'Асар', 42.406733, 69.59898, 1200, 'https://yandex.kz/maps/221/chimkent/geo/asar_yqsham_audany/1496992866/'),
  microdistrict('18-i-mikroraion', '18-й микрорайон', 42.340993352, 69.629553314, 900, 'https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Shymkent'),
  microdistrict('akzhaiyk', 'Акжайык', 42.378879574, 69.600920823, 900, 'https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Shymkent'),
  microdistrict('astana', 'Астана', 42.355123255, 69.651703271, 900, 'https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Shymkent'),
  microdistrict('sairam', 'Сайрам', 42.339711874, 69.636264201, 900, 'https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Shymkent'),
  microdistrict('sever', 'Север', 42.338934815, 69.638336208, 900, 'https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Shymkent'),
  microdistrict('sportivnyi', 'Спортивный', 42.332094803, 69.598852544, 900, 'https://yandex.com/maps/?text=%D0%BC%D0%B8%D0%BA%D1%80%D0%BE%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%2C%20Shymkent'),
  microdistrict('shymsiti', 'Шымсити', 42.41155951, 69.614180439, 900, 'https://yandex.com/maps/?text=%D0%96%D0%9A%2C%20%D0%A8%D1%8B%D0%BC%D0%BA%D0%B5%D0%BD%D1%82'),
  microdistrict('8-i-mikroraion', '8-й микрорайон', 42.3219765, 69.5787247, 700, 'https://www.openstreetmap.org/way/112174234', { type: 'way', id: 112174234 }),
  microdistrict('15-i-mikroraion', '15-й микрорайон', 42.3320047, 69.6352536, 700, 'https://www.openstreetmap.org/way/111573531', { type: 'way', id: 111573531 }),
  microdistrict('nursat', 'Нурсат', 42.3616655, 69.6286885, 900, 'https://www.openstreetmap.org/way/560311711', { type: 'way', id: 560311711 }),
  osmMicrodistrict('11-i-mikroraion', '11-й микрорайон', 42.3229445, 69.6386518, 117484137),
]);
