const neighborhood = (slug, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:cherkasy:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UA',
  canonicalName,
  parentId: 'ua:cherkasy',
  center: Object.freeze({ lat, lng }),
  source: extra.source ?? (extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : 'manual'),
  accuracy: 'neighborhood',
  accuracyM,
  ...extra,
});

export const UA_CHERKASY_NEIGHBORHOOD_ENTITIES = Object.freeze([
  neighborhood('mytnytsia', 'Mytnytsia', 49.43783, 32.08465, 1700, { osm: Object.freeze({ type: 'node', id: 6736046144 }), wikidataId: 'Q12123633' }),
  neighborhood('kazbet', 'Kazbet', 49.45364, 32.04262, 1300, { osm: Object.freeze({ type: 'node', id: 6736078899 }) }),
  neighborhood('sosnivka', 'Sosnivka', 49.46774, 32.01103, 1800, { source: 'geonames', geonamesId: '693090' }),
  neighborhood('pivdenno-zakhidnyi', 'Pivdenno-Zakhidnyi', 49.43181, 32.00924, 1800, { osm: Object.freeze({ type: 'node', id: 6736078900 }) }),
  neighborhood('dakhnivka', 'Dakhnivka', 49.48529, 31.9781, 1800, { source: 'geonames', geonamesId: '710327' }),
  neighborhood('khimpaselyshche', 'Khimpaselyshche', 49.4022758, 32.0360956, 1200, { osm: Object.freeze({ type: 'relation', id: 15871183 }) }),
  neighborhood('tsentr', 'Tsentr', 49.4452907, 32.0551263, 1200, { osm: Object.freeze({ type: 'relation', id: 16017902 }) }),
  neighborhood('zelenyi', 'Zelenyi', 49.4211417, 32.0584697, 1100, { osm: Object.freeze({ type: 'relation', id: 15853105 }) }),
]);
