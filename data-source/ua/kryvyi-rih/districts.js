import { KRYVYI_RIH_DISTRICT_BOUNDARIES } from './district-boundaries.js';

const district = (slug, canonicalName) => {
  const { relId, center, geometry } = KRYVYI_RIH_DISTRICT_BOUNDARIES[slug];
  return Object.freeze({ id: `ua:kryvyi-rih:district:${slug}`, type: 'district', country: 'UA', canonicalName,
    parentId: 'ua:kryvyi-rih', center, source: 'osm', accuracy: 'district', osm: Object.freeze({ type: 'relation', id: relId }), boundary: geometry });
};

export const UA_KRYVYI_RIH_DISTRICT_ENTITIES = Object.freeze([
  district('ternivskyi', 'Ternivskyi'), district('pokrovskyi', 'Pokrovskyi'), district('saksahanskyi', 'Saksahanskyi'),
  district('tsentralno-miskyi', 'Tsentralno-Miskyi'), district('dovhyntsivskyi', 'Dovhyntsivskyi'),
  district('metalurhiinyi', 'Metalurhiinyi'), district('inhuletskyi', 'Inhuletskyi'),
]);
