import { UA_CITY_ENTITIES } from './cities.js';
import { UA_SECONDARY_CITY_ANCHORS } from './secondary-city-anchors.js';
import { UA_KYIV_ENTITIES } from './kyiv/index.js';
import { UA_ODESA_ENTITIES } from './odesa/index.js';
import { UA_CHERNIVTSI_ENTITIES } from './chernivtsi/index.js';
import { UA_KHMELNYTSKYI_ENTITIES } from './khmelnytskyi/index.js';

export const UA_ENTITIES = Object.freeze([
  ...UA_CITY_ENTITIES,
  ...UA_SECONDARY_CITY_ANCHORS,
  ...UA_KYIV_ENTITIES,
  ...UA_ODESA_ENTITIES,
  ...UA_CHERNIVTSI_ENTITIES,
  ...UA_KHMELNYTSKYI_ENTITIES,
]);
