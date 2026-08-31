import { UA_ODESA_DISTRICT_ENTITIES } from './districts.js';
import { UA_ODESA_MICRODISTRICT_ENTITIES } from './microdistricts.js';
import { UA_ODESA_CORE_ENTITIES } from './anchors.js';
import { UA_ODESA_VERIFIED_AREA_ENTITIES } from './verified-areas.js';

export const UA_ODESA_ENTITIES = Object.freeze([
  ...UA_ODESA_DISTRICT_ENTITIES,
  ...UA_ODESA_MICRODISTRICT_ENTITIES,
  ...UA_ODESA_CORE_ENTITIES,
  ...UA_ODESA_VERIFIED_AREA_ENTITIES,
]);
