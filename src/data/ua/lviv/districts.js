import { LVIV_DISTRICT_BOUNDARIES } from './district-boundaries.js';

const district = (slug, canonicalName) => {
  const { relId, center, geometry } = LVIV_DISTRICT_BOUNDARIES[slug];
  return Object.freeze({ id: `ua:lviv:district:${slug}`, type: 'district', country: 'UA', canonicalName,
    parentId: 'ua:lviv', center, source: 'osm', accuracy: 'district', osm: Object.freeze({ type: 'relation', id: relId }), boundary: geometry });
};

export const UA_LVIV_DISTRICT_ENTITIES = Object.freeze([
  district('halytskyi', 'Halytskyi'), district('zaliznychnyi', 'Zaliznychnyi'), district('lychakivskyi', 'Lychakivskyi'),
  district('sykhivskyi', 'Sykhivskyi'), district('frankivskyi', 'Frankivskyi'), district('shevchenkivskyi', 'Shevchenkivskyi'),
]);
