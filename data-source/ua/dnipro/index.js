import { UA_DNIPRO_DISTRICT_ENTITIES } from './districts.js';
import { UA_DNIPRO_NEIGHBORHOOD_ENTITIES } from './neighborhoods.js';
import { UA_DNIPRO_RESIDENTIAL_COMPLEX_ENTITIES } from './residential-complexes.js';
import { UA_DNIPRO_STREET_ENTITIES } from './streets.js';
import { UA_DNIPRO_REVIEWED_BOULEVARD_ENTITIES } from './reviewed-boulevards.js';

export const UA_DNIPRO_ENTITIES = Object.freeze([
  ...UA_DNIPRO_DISTRICT_ENTITIES,
  ...UA_DNIPRO_NEIGHBORHOOD_ENTITIES,
  ...UA_DNIPRO_RESIDENTIAL_COMPLEX_ENTITIES,
  ...UA_DNIPRO_STREET_ENTITIES,
  ...UA_DNIPRO_REVIEWED_BOULEVARD_ENTITIES,
]);
