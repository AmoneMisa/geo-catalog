const residential = (slug, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:kremenchuk:residential:${slug}`,
  type: 'residential_complex',
  country: 'UA',
  canonicalName,
  parentId: 'ua:kremenchuk',
  center: Object.freeze({ lat, lng }),
  source: extra.source ?? (extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : 'manual'),
  accuracy: 'building',
  accuracyM,
  ...extra,
});

export const UA_KREMENCHUK_RESIDENTIAL_COMPLEX_ENTITIES = Object.freeze([
  residential('tsentralnyi', 'Tsentralnyi', 49.0733492, 33.4066602, 350, { source: 'manual' }),
]);
