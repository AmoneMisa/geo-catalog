const district = (slug, canonicalName, lat, lng, accuracyM, sourceUrl, osmRelationId) => Object.freeze({
  id: `ua:kharkiv:district:${slug}`,
  type: 'district',
  country: 'UA',
  canonicalName,
  parentId: 'ua:kharkiv',
  center: Object.freeze({ lat, lng }),
  source: 'geonames',
  accuracy: 'district',
  accuracyM,
  sourceUrl,
  osm: Object.freeze({ type: 'relation', id: osmRelationId }),
});

export const UA_KHARKIV_DISTRICT_ENTITIES = Object.freeze([
  district('shevchenkivskyi', 'Шевченківський', 50.0202, 36.2247, 3000, 'https://mapcarta.com/39706880', 3796255),
  district('saltivskyi', 'Салтівський', 50.005841, 36.337823, 800, 'https://www.openstreetmap.org/relation/7340971', 7340971),
  district('kholodnohirskyi', 'Холодногірський', 49.99535, 36.17737, 2600, 'https://www.wikidata.org/wiki/Q7242862', 3801249),
  district('nemyshlianskyi', 'Немишлянський', 49.964369, 36.334740, 2600, 'https://harkiv.streetmaps.ru/administrative/nemyshlyanskiy-rayon-r7340972', 7340972),
  district('kyivskyi', 'Київський', 50.004865, 36.239911, 1200, 'https://www.openstreetmap.org/node/13620290149', 7340973),
  district('novobavarskyi', 'Новобаварський', 49.987693, 36.221992, 1200, 'https://www.openstreetmap.org/node/4311863673', 3801278),
  district('industrialnyi', 'Індустріальний', 49.987371, 36.235081, 1200, 'https://www.openstreetmap.org/node/13883680330', 7340969),
  district('osnovianskyi', 'Основ’янський', 49.968528, 36.233872, 1000, 'https://www.openstreetmap.org/way/87343468', 3801315),
  district('slobidskyi', 'Слобідський', 49.949094, 36.311270, 900, 'https://www.openstreetmap.org/relation/7340970', 7340970),
]);
