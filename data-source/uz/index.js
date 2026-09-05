import { UZ_CITY_ENTITIES } from './cities.js';
import { UZ_TASHKENT_ENTITIES } from './tashkent/index.js';
import { UZ_SAMARKAND_ENTITIES } from './samarkand/index.js';
import { NAMANGAN_ENTITIES } from './cities/namangan.js';
import { NAMANGAN_REVIEWED_STREET_ENTITIES } from './cities/namangan-reviewed-streets.js';
import { ANDIJAN_ENTITIES } from './cities/andijan.js';
import { ANDIJAN_REVIEWED_STREET_ENTITIES } from './cities/andijan-reviewed-streets.js';
import { FERGANA_ENTITIES } from './cities/fergana.js';
import { FERGANA_REVIEWED_STREET_ENTITIES } from './cities/fergana-reviewed-streets.js';
import { BUKHARA_ENTITIES } from './cities/bukhara.js';
import { QARSHI_ENTITIES } from './cities/qarshi.js';
import { QARSHI_REVIEWED_STREET_ENTITIES } from './cities/qarshi-reviewed-streets.js';
import { NUKUS_ENTITIES } from './cities/nukus.js';
import { NUKUS_REVIEWED_STREET_ENTITIES } from './cities/nukus-reviewed-streets.js';
import { URGENCH_ENTITIES } from './cities/urgench.js';
import { TURTKUL_ENTITIES } from './cities/turtkul.js';
import { UZ_SECONDARY_CITY_ANCHORS } from './secondary-city-anchors.js';
import { UZ_SECONDARY_AREA_ADDITIONS } from './secondary-area-additions.js';
import { UZ_TAIL_TRANSPORT_ADDITIONS } from './tail-transport-additions.js';
import { UZ_HERITAGE_ANCHORS } from './heritage-anchors.js';
import { UZ_HERITAGE_TRANSPORT_ENTITIES } from './heritage-transport.js';
import { UZ_TASHKENT_REGION_CITY_ANCHORS } from './tashkent-region-city-anchors.js';

export const UZ_ENTITIES = Object.freeze([
  ...UZ_CITY_ENTITIES,
  ...UZ_TASHKENT_ENTITIES,
  ...UZ_SAMARKAND_ENTITIES,
  ...NAMANGAN_ENTITIES,
  ...NAMANGAN_REVIEWED_STREET_ENTITIES,
  ...ANDIJAN_ENTITIES,
  ...ANDIJAN_REVIEWED_STREET_ENTITIES,
  ...FERGANA_ENTITIES,
  ...FERGANA_REVIEWED_STREET_ENTITIES,
  ...BUKHARA_ENTITIES,
  ...QARSHI_ENTITIES,
  ...QARSHI_REVIEWED_STREET_ENTITIES,
  ...NUKUS_ENTITIES,
  ...NUKUS_REVIEWED_STREET_ENTITIES,
  ...URGENCH_ENTITIES,
  ...TURTKUL_ENTITIES,
  ...UZ_SECONDARY_CITY_ANCHORS,
  ...UZ_SECONDARY_AREA_ADDITIONS,
  ...UZ_TAIL_TRANSPORT_ADDITIONS,
  ...UZ_HERITAGE_ANCHORS,
  ...UZ_HERITAGE_TRANSPORT_ENTITIES,
  ...UZ_TASHKENT_REGION_CITY_ANCHORS,
]);
