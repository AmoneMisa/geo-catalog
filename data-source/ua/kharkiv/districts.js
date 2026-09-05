import { KHARKIV_DISTRICT_BOUNDARIES } from './district-boundaries.js';

const district = (slug, canonicalName, lat, lng, accuracyM, osmRelationId) => Object.freeze({
  id: `ua:kharkiv:district:${slug}`,
  type: 'district',
  country: 'UA',
  canonicalName,
  parentId: 'ua:kharkiv',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'district',
  accuracyM,
  osm: Object.freeze({ type: 'relation', id: osmRelationId }),
  boundary: KHARKIV_DISTRICT_BOUNDARIES[slug].geometry,
});

export const UA_KHARKIV_DISTRICT_ENTITIES = Object.freeze([
  district('shevchenkivskyi', 'Shevchenkivskyi', 50.0384635, 36.2268220, 3000, 3796255),
  district('saltivskyi', 'Saltivskyi', 50.0058412, 36.3378230, 800, 7340971),
  district('kholodnohirskyi', 'Kholodnohirskyi', 50.0064351, 36.1679569, 2600, 3801249),
  district('nemyshlianskyi', 'Nemyshlianskyi', 49.9643691, 36.3347396, 2600, 7340972),
  district('kyivskyi', 'Kyivskyi', 50.0368244, 36.3214449, 1200, 7340973),
  district('novobavarskyi', 'Novobavarskyi', 49.9527302, 36.1713389, 1200, 3801278),
  district('industrialnyi', 'Industrialnyi', 49.9406171, 36.3950524, 1200, 7340969),
  district('osnovianskyi', 'Osnovianskyi', 49.9347654, 36.2328047, 1000, 3801315),
  district('slobidskyi', 'Slobidskyi', 49.9490935, 36.3112697, 900, 7340970),
]);
