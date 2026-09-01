const district = (slug, canonicalName, lat, lng, accuracyM, osmRelationId, wikidataId) => Object.freeze({
  id: `ua:cherkasy:district:${slug}`,
  type: 'district',
  country: 'UA',
  canonicalName,
  parentId: 'ua:cherkasy',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'district',
  accuracyM,
  osm: Object.freeze({ type: 'relation', id: osmRelationId }),
  wikidataId,
});

// Current administrative division: Prydniprovskyi and Sosnivskyi.
// OSM relations expose administrative boundaries and current KATOTTG metadata.
export const UA_CHERKASY_DISTRICT_ENTITIES = Object.freeze([
  district('prydniprovskyi', 'Prydniprovskyi', 49.40306, 32.08389, 7000, 2825509, 'Q12144114'),
  district('sosnivskyi', 'Sosnivskyi', 49.450719, 32.048969, 7000, 2825510, 'Q12154683'),
]);
