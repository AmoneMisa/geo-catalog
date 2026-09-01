const district = (slug, canonicalName, lat, lng, accuracyM, wikidataId, sourceUrl) => Object.freeze({
  id: `ua:chernihiv:district:${slug}`,
  type: 'district',
  country: 'UA',
  canonicalName,
  parentId: 'ua:chernihiv',
  center: Object.freeze({ lat, lng }),
  source: 'wikidata',
  sourceUrl,
  accuracy: 'district',
  accuracyM,
  wikidataId,
});

// Current administrative division: Desnianskyi and Novozavodskyi.
// Current map/KATOTTG sources expose both as city administrative districts.
export const UA_CHERNIHIV_DISTRICT_ENTITIES = Object.freeze([
  district('desnianskyi', 'Desnianskyi', 51.5063, 31.3168, 9000, 'Q4159218', 'https://ukraine-streets.openalfa.com/desnianskyi-district_chernihiv'),
  district('novozavodskyi', 'Novozavodskyi', 51.4893, 31.2563, 9000, 'Q12134083', 'https://mapcarta.com/39562614'),
]);
