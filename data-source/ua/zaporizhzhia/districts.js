import { ZAPORIZHZHIA_DISTRICT_BOUNDARIES } from './district-boundaries.js';

const district = (slug, canonicalName) => {
  const { relId, center, geometry } = ZAPORIZHZHIA_DISTRICT_BOUNDARIES[slug];
  return Object.freeze({ id: `ua:zaporizhzhia:district:${slug}`, type: 'district', country: 'UA', canonicalName,
    parentId: 'ua:zaporizhzhia', center, source: 'osm', accuracy: 'district', osm: Object.freeze({ type: 'relation', id: relId }), boundary: geometry });
};

export const UA_ZAPORIZHZHIA_DISTRICT_ENTITIES = Object.freeze([
  district('voznesenivskyi', 'Voznesenivskyi'), district('dniprovskyi', 'Dniprovskyi'), district('zavodskyi', 'Zavodskyi'),
  district('kosmichnyi', 'Kosmichnyi'), district('oleksandrivskyi', 'Oleksandrivskyi'), district('khortytskyi', 'Khortytskyi'),
  district('shevchenkivskyi', 'Shevchenkivskyi'),
]);
