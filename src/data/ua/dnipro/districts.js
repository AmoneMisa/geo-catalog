import { DNIPRO_DISTRICT_BOUNDARIES } from './district-boundaries.js';

const district = (slug, canonicalName) => {
  const { relId, center, geometry } = DNIPRO_DISTRICT_BOUNDARIES[slug];
  return Object.freeze({ id: `ua:dnipro:district:${slug}`, type: 'district', country: 'UA', canonicalName,
    parentId: 'ua:dnipro', center, source: 'osm', accuracy: 'district', osm: Object.freeze({ type: 'relation', id: relId }), boundary: geometry });
};

export const UA_DNIPRO_DISTRICT_ENTITIES = Object.freeze([
  district('amur-nyzhnodniprovskyi', 'Amur-Nyzhnodniprovskyi'), district('industrialnyi', 'Industrialnyi'),
  district('samarskyi', 'Samarskyi'), district('novokodatskyi', 'Novokodatskyi'), district('tsentralnyi', 'Tsentralnyi'),
  district('chechelivskyi', 'Chechelivskyi'), district('sobornyi', 'Sobornyi'), district('shevchenkivskyi', 'Shevchenkivskyi'),
]);
