const neighborhood = (slug, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:chernihiv:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UA',
  canonicalName,
  parentId: 'ua:chernihiv',
  center: Object.freeze({ lat, lng }),
  source: extra.source ?? (extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : 'manual'),
  accuracy: 'neighborhood',
  accuracyM,
  ...extra,
});

export const UA_CHERNIHIV_NEIGHBORHOOD_ENTITIES = Object.freeze([
  neighborhood('masany', 'Masany', 51.53316, 31.2313, 1900, { source: 'manual', sourceUrl: 'https://mapcarta.com/13748964', geonamesId: '701643' }),
  neighborhood('bobrovytsia', 'Bobrovytsia', 51.51953, 31.3615, 1800, { source: 'manual', sourceUrl: 'https://mapcarta.com/13769674', geonamesId: '711998' }),
  neighborhood('sherstianka', 'Sherstianka', 51.48207, 31.25996, 1600, { source: 'manual', sourceUrl: 'https://mapcarta.com/de/39562610' }),
  neighborhood('liskovytsia', 'Liskovytsia', 51.47562, 31.28799, 1500, { source: 'manual', sourceUrl: 'https://mapcarta.com/39562612', geonamesId: '13608467' }),
  neighborhood('koty', 'Koty', 51.52989, 31.26548, 1700, { source: 'manual', sourceUrl: 'https://mapcarta.com/13754994', geonamesId: '704658' }),
]);
