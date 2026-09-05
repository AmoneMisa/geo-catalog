import { ODESA_DISTRICT_BOUNDARIES } from './district-boundaries.js';

const district = (slug, canonicalName, lat, lng, osmId, wikidataId, accuracyM) => Object.freeze({
  id: `ua:odesa:district:${slug}`,
  type: 'district',
  country: 'UA',
  canonicalName,
  parentId: 'ua:odesa',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'district',
  accuracyM,
  osm: Object.freeze({ type: 'relation', id: osmId }),
  wikidataId,
  boundary: ODESA_DISTRICT_BOUNDARIES[slug].geometry,
});

export const UA_ODESA_DISTRICT_ENTITIES = Object.freeze([
  district('prymorskyi', 'Prymorskyi', 46.4584832, 30.7481534, 2952493, 'Q4378731', 5200),
  district('kyivskyi', 'Kyivskyi', 46.390316, 30.7204649, 2944314, 'Q4220231', 6500),
  district('khadzhybeiskyi', 'Khadzhybeiskyi', 46.4582547, 30.687121, 2945922, 'Q4277948', 8000),
  district('peresypskyi', 'Peresypskyi', 46.5543421, 30.7513268, 2952559, 'Q4445200', 7000),
]);
