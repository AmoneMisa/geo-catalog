const district = (slug, canonicalName, lat, lng, osmId, wikidataId, accuracyM) => Object.freeze({
  id: `ua:odesa:district:${slug}`,
  type: 'district',
  country: 'UA',
  canonicalName,
  parentId: 'ua:odesa',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'approximate',
  accuracyM,
  osm: Object.freeze({ type: 'relation', id: osmId }),
  wikidataId,
});

export const UA_ODESA_DISTRICT_ENTITIES = Object.freeze([
  district('prymorskyi', 'Prymorskyi', 46.466669, 30.75, 2952493, 'Q4378731', 5200),
  district('kyivskyi', 'Kyivskyi', 46.398289, 30.727369, 2944314, 'Q4220231', 6500),
  district('khadzhybeiskyi', 'Khadzhybeiskyi', 46.457806, 30.683306, 2945922, 'Q4277948', 8000),
  district('peresypskyi', 'Peresypskyi', 46.525925, 30.728864, 2952559, 'Q4445200', 7000),
]);
