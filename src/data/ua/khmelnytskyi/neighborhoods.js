const neighborhood = (slug, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:khmelnytskyi:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UA',
  canonicalName,
  parentId: 'ua:khmelnytskyi',
  center: Object.freeze({ lat, lng }),
  source: extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : extra.source ?? 'manual',
  accuracy: 'neighborhood',
  accuracyM,
  ...extra,
});

export const UA_KHMELNYTSKYI_NEIGHBORHOOD_ENTITIES = Object.freeze([
  neighborhood('hrechany', 'Гречани', 49.44287, 26.93858, 1600, { source: 'manual', sourceUrl: 'https://mapcarta.com/13762004', geonamesId: '708163' }),
  neighborhood('rakove', 'Ракове', 49.39697, 27.05396, 1600, { source: 'manual', sourceUrl: 'https://mapcarta.com/39608434' }),
  neighborhood('ozerna', 'Озерна', 49.4452, 27.0045, 1500, { source: 'manual', sourceUrl: 'https://maps.visicom.ua/i/ADR3KH6BB7VHJCH5PF' }),
]);
