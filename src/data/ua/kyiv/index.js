import { UA_KYIV_ANCHORS } from './anchors.js';
import { UA_KYIV_EXTRA_ANCHORS } from './anchors-extra.js';
import { UA_KYIV_NEIGHBORHOODS } from './neighborhoods.js';
import { UA_KYIV_RESIDENTIAL_COMPLEX_ENTITIES } from './residential-complexes.js';

export const UA_KYIV_ENTITIES = Object.freeze([
  ...UA_KYIV_ANCHORS,
  ...UA_KYIV_EXTRA_ANCHORS,
  ...UA_KYIV_NEIGHBORHOODS,
  ...UA_KYIV_RESIDENTIAL_COMPLEX_ENTITIES,
]);
