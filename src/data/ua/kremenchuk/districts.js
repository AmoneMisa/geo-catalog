const district = (slug, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:kremenchuk:district:${slug}`,
  type: 'district',
  country: 'UA',
  canonicalName,
  parentId: 'ua:kremenchuk',
  center: Object.freeze({ lat, lng }),
  source: extra.source ?? (extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : 'manual'),
  accuracy: 'district',
  accuracyM,
  ...extra,
});

export const UA_KREMENCHUK_DISTRICT_ENTITIES = Object.freeze([
  district('avtozavodskyi', 'Avtozavodskyi', 49.097531, 33.432061, 6000, { wikidataId: 'Q12075964', source: 'geonames' }),
  district('kriukivskyi', 'Kriukivskyi', 49.0289, 33.4385, 7000, { wikidataId: 'Q12115170', source: 'geonames' }),
]);
