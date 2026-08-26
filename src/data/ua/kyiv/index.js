import { UA_KYIV_ANCHORS } from '../../ua-kyiv-anchors.js';
import { UA_KYIV_EXTRA_ANCHORS } from '../../ua-kyiv-anchors-extra.js';
import { UA_KYIV_NEIGHBORHOODS } from './neighborhoods.js';

export const UA_KYIV_ENTITIES = Object.freeze([
  ...UA_KYIV_ANCHORS,
  ...UA_KYIV_EXTRA_ANCHORS,
  ...UA_KYIV_NEIGHBORHOODS,
]);
