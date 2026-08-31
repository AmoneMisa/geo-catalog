const microdistrict = (slug, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:kharkiv:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UA',
  canonicalName,
  parentId: 'ua:kharkiv',
  center: Object.freeze({ lat, lng }),
  source: extra.osm ? 'osm' : extra.source ?? 'manual',
  accuracy: 'neighborhood',
  accuracyM,
  ...extra,
});

const osmMicrodistrict = (slug, canonicalName, lat, lng, osmId, accuracyM = 700) => microdistrict(
  slug,
  canonicalName,
  lat,
  lng,
  accuracyM,
  {
    osm: Object.freeze({ type: 'node', id: osmId }),
    sourceUrl: `https://www.openstreetmap.org/node/${osmId}`,
  },
);

const wikimapiaMicrodistrict = (slug, canonicalName, lat, lng, accuracyM = 650) => microdistrict(
  slug,
  canonicalName,
  lat,
  lng,
  accuracyM,
  {
    source: 'manual',
    sourceUrl: `https://wikimapia.org/#lang=ru&lat=${lat}&lon=${lng}&z=16&m=w`,
  },
);

export const UA_KHARKIV_VERIFIED_MICRODISTRICT_ENTITIES = Object.freeze([
  osmMicrodistrict('455-microdistrict', '455 microdistrict', 49.98330, 36.26975, 12380753513, 500),
  osmMicrodistrict('519-microdistrict', '519 microdistrict', 50.01435, 36.30725, 12246829834, 500),
  osmMicrodistrict('520-microdistrict', '520 microdistrict', 50.01195, 36.33236, 12215617088, 500),
  wikimapiaMicrodistrict('521-microdistrict', '521 microdistrict', 50.018611, 36.338611, 700),
  wikimapiaMicrodistrict('522-microdistrict', '522 microdistrict', 50.022417, 36.326900, 650),
  wikimapiaMicrodistrict('531-microdistrict', '531 microdistrict', 50.024020, 36.358125, 650),
  wikimapiaMicrodistrict('533-microdistrict', '533 microdistrict', 50.020768, 36.369651, 650),
  wikimapiaMicrodistrict('535a', '535A', 50.00639, 36.35028, 850),
  wikimapiaMicrodistrict('602-microdistrict', '602 microdistrict', 49.995156, 36.360102, 700),
  wikimapiaMicrodistrict('603-microdistrict', '603 microdistrict', 49.999800, 36.346295, 700),
  wikimapiaMicrodistrict('604-microdistrict', '604 microdistrict', 49.992747, 36.345315, 700),
  wikimapiaMicrodistrict('605-microdistrict', '605 microdistrict', 50.003992, 36.337249, 700),
  osmMicrodistrict('606-microdistrict', '606 microdistrict', 50.01369, 36.35884, 12196622366, 500),
  wikimapiaMicrodistrict('607-microdistrict', '607 microdistrict', 50.016404, 36.350418, 650),
  wikimapiaMicrodistrict('608-microdistrict', '608 microdistrict', 50.0148, 36.3375, 900),
  microdistrict('616-microdistrict', '616 microdistrict', 50.000049, 36.327987, 650, {
    source: 'manual',
    sourceUrl: 'https://yandex.com/maps/147/kharkiv/geo/616_y_mikroraion/1508584597/',
  }),
  osmMicrodistrict('moskalevka', 'Moskalevka', 49.97553, 36.22016, 1985548337, 900),
  osmMicrodistrict('nova-bavariia', 'Nova Bavariia', 49.95126, 36.16692, 1377395019, 1100),
  osmMicrodistrict('odeska', 'Odeska', 49.94715, 36.26228, 12246218822, 1000),
  microdistrict('skhidnyi', 'Skhidnyi', 49.94524, 36.38693, 1100, {
    source: 'geonames',
    sourceUrl: 'https://www.geonames.org/8669639/',
  }),
]);
