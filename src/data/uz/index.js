import { UZ_TASHKENT_ENTITIES } from './tashkent/index.js';
import { UZ_SAMARKAND_ENTITIES } from './samarkand/index.js';
import { NAMANGAN_ENTITIES } from '../namangan.js';
import { ANDIJAN_ENTITIES } from '../andijan.js';
import { FERGANA_ENTITIES } from '../fergana.js';
import { BUKHARA_ENTITIES } from '../bukhara.js';
import { QARSHI_ENTITIES } from '../qarshi.js';
import { NUKUS_ENTITIES } from '../nukus.js';
import { URGENCH_ENTITIES } from '../urgench.js';
import { UZ_SECONDARY_CITY_ANCHORS } from '../uz-secondary-city-anchors.js';
import { UZ_HERITAGE_ANCHORS } from '../uz-heritage-anchors.js';
import { UZ_HERITAGE_TRANSPORT_ENTITIES } from '../uz-heritage-transport.js';
import { UZ_TASHKENT_REGION_CITY_ANCHORS } from '../uz-tashkent-region-city-anchors.js';

export const UZ_ENTITIES = Object.freeze([
  ...UZ_TASHKENT_ENTITIES,
  ...UZ_SAMARKAND_ENTITIES,
  ...NAMANGAN_ENTITIES,
  ...ANDIJAN_ENTITIES,
  ...FERGANA_ENTITIES,
  ...BUKHARA_ENTITIES,
  ...QARSHI_ENTITIES,
  ...NUKUS_ENTITIES,
  ...URGENCH_ENTITIES,
  ...UZ_SECONDARY_CITY_ANCHORS,
  ...UZ_HERITAGE_ANCHORS,
  ...UZ_HERITAGE_TRANSPORT_ENTITIES,
  ...UZ_TASHKENT_REGION_CITY_ANCHORS,
]);
