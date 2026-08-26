import { UA_SECONDARY_CITY_ANCHORS } from './secondary-city-anchors.js';
import { UA_KYIV_ENTITIES } from './kyiv/index.js';
import { UA_ODESA_ENTITIES } from './odesa/index.js';

export const UA_ENTITIES = Object.freeze([
  ...UA_SECONDARY_CITY_ANCHORS,
  ...UA_KYIV_ENTITIES,
  ...UA_ODESA_ENTITIES,
]);
