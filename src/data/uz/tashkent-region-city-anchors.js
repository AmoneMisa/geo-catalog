import { UZ_REGIONAL_ANCHORS } from './regional-anchors.js';
import { UZ_P3_TRANSPORT_ENTITIES } from './p3-transport.js';
import { UZ_KARAKALPAKSTAN_ANCHORS } from './karakalpakstan-anchors.js';
import { CHIRCHIQ_MICRODISTRICT_ENTITIES } from './chirchiq-microdistricts.js';
import { UZ_SECONDARY_LOCALITY_ENTITIES } from './secondary-localities.js';
import { UZ_INDUSTRIAL_ANCHORS } from './industrial-anchors.js';
import { UZ_TAIL_POI_ANCHORS } from './tail-poi-anchors.js';
import { GULISTAN_SPATIAL_ENTITIES } from './gulistan-anchors.js';
import { UZ_SECONDARY_POI_ANCHORS } from './secondary-poi-anchors.js';
import { CHIRCHIQ_POI_ANCHORS } from './chirchiq-poi-anchors.js';
import { UZ_OFFICIAL_INSTITUTION_ANCHORS } from './official-institution-anchors.js';
import { NAVOIY_MICRODISTRICT_ENTITIES } from './navoiy-microdistricts.js';
import { ALMALYK_MICRODISTRICT_ENTITIES } from './almalyk-microdistricts.js';
import { ANGREN_QUARTER_ENTITIES } from './angren-quarters.js';
import { ANGREN_STREET_ENTITIES } from './angren-streets.js';

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
  ...CHIRCHIQ_POI_ANCHORS,
  ...UZ_OFFICIAL_INSTITUTION_ANCHORS,
  ...NAVOIY_MICRODISTRICT_ENTITIES,
  ...ALMALYK_MICRODISTRICT_ENTITIES,
  ...ANGREN_QUARTER_ENTITIES,
  ...ANGREN_STREET_ENTITIES,
]);
