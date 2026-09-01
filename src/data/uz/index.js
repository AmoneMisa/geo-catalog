import { UZ_CITY_ENTITIES } from './cities.js';
import { UZ_TASHKENT_ENTITIES } from './tashkent/index.js';
import { UZ_SAMARKAND_ENTITIES } from './samarkand/index.js';
import { NAMANGAN_ENTITIES } from './cities/namangan.js';
import { ANDIJAN_ENTITIES } from './cities/andijan.js';
import { FERGANA_ENTITIES } from './cities/fergana.js';
import { BUKHARA_ENTITIES } from './cities/bukhara.js';
import { QARSHI_ENTITIES } from './cities/qarshi.js';
import { NUKUS_ENTITIES } from './cities/nukus.js';
import { URGENCH_ENTITIES } from './cities/urgench.js';
import { TURTKUL_ENTITIES } from './cities/turtkul.js';
import { UZ_SECONDARY_CITY_ANCHORS } from './secondary-city-anchors.js';
import { UZ_SECONDARY_AREA_ADDITIONS } from './secondary-area-additions.js';
import { UZ_SECONDARY_LOCALITY_ENTITIES } from './secondary-localities.js';
import { UZ_SECONDARY_POI_ANCHORS } from './secondary-poi-anchors.js';
import { UZ_TAIL_POI_ANCHORS } from './tail-poi-anchors.js';
import { CHIRCHIQ_MICRODISTRICT_ENTITIES } from './chirchiq-microdistricts.js';
import { CHIRCHIQ_POI_ANCHORS } from './chirchiq-poi-anchors.js';
import { UZ_TAIL_TRANSPORT_ADDITIONS } from './tail-transport-additions.js';
import { UZ_HERITAGE_ANCHORS } from './heritage-anchors.js';
import { UZ_HERITAGE_TRANSPORT_ENTITIES } from './heritage-transport.js';
import { UZ_TASHKENT_REGION_CITY_ANCHORS } from './tashkent-region-city-anchors.js';

export const UZ_ENTITIES = Object.freeze([
  ...UZ_CITY_ENTITIES,
  ...UZ_TASHKENT_ENTITIES,
  ...UZ_SAMARKAND_ENTITIES,
  ...NAMANGAN_ENTITIES,
  ...ANDIJAN_ENTITIES,
  ...FERGANA_ENTITIES,
  ...BUKHARA_ENTITIES,
  ...QARSHI_ENTITIES,
  ...NUKUS_ENTITIES,
  ...URGENCH_ENTITIES,
  ...TURTKUL_ENTITIES,
  ...UZ_SECONDARY_CITY_ANCHORS,
  ...UZ_SECONDARY_AREA_ADDITIONS,
  ...UZ_SECONDARY_LOCALITY_ENTITIES,
  ...UZ_SECONDARY_POI_ANCHORS,
  ...UZ_TAIL_POI_ANCHORS,
  ...CHIRCHIQ_MICRODISTRICT_ENTITIES,
  ...CHIRCHIQ_POI_ANCHORS,
  ...UZ_TAIL_TRANSPORT_ADDITIONS,
  ...UZ_HERITAGE_ANCHORS,
  ...UZ_HERITAGE_TRANSPORT_ENTITIES,
  ...UZ_TASHKENT_REGION_CITY_ANCHORS,
]);
