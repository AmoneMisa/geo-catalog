import { UZ_REGIONAL_ANCHORS } from './uz-regional-anchors.js';
import { UZ_P3_TRANSPORT_ENTITIES } from './uz-p3-transport.js';
import { UZ_KARAKALPAKSTAN_ANCHORS } from './uz-karakalpakstan-anchors.js';
import { CHIRCHIQ_MICRODISTRICT_ENTITIES } from './uz-chirchiq-microdistricts.js';
import { UZ_SECONDARY_LOCALITY_ENTITIES } from './uz-secondary-localities.js';
import { UZ_INDUSTRIAL_ANCHORS } from './uz-industrial-anchors.js';
import { UZ_TAIL_POI_ANCHORS } from './uz-tail-poi-anchors.js';
import { GULISTAN_SPATIAL_ENTITIES } from './uz-gulistan-anchors.js';
import { UZ_SECONDARY_POI_ANCHORS } from './uz-secondary-poi-anchors.js';

const osmPoi = (citySlug, slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 130) => ({
  id: `uz:${citySlug}:poi:${slug}`,
  type: 'poi',
  country: 'UZ',
  canonicalName,
  parentId: `uz:${citySlug}`,
  center: { lat, lng },
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

export const UZ_TASHKENT_REGION_CITY_ANCHORS = Object.freeze([
  osmPoi('angren', 'angren-railway-station', 'Angren Railway Station', 40.99905, 70.08266, 'node', 1412998292, 110),
  osmPoi('almalyk', 'olmaliq-bus-station', 'Olmaliq Bus Station', 40.86406, 69.59269, 'way', 257730061, 140),
  ...UZ_REGIONAL_ANCHORS,
  ...UZ_P3_TRANSPORT_ENTITIES,
  ...UZ_KARAKALPAKSTAN_ANCHORS,
  ...CHIRCHIQ_MICRODISTRICT_ENTITIES,
  ...UZ_SECONDARY_LOCALITY_ENTITIES,
  ...UZ_INDUSTRIAL_ANCHORS,
  ...UZ_TAIL_POI_ANCHORS,
  ...GULISTAN_SPATIAL_ENTITIES,
  ...UZ_SECONDARY_POI_ANCHORS,
]);
