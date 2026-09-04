import { KG_KARAKOL_MICRODISTRICT_ENTITIES } from './microdistricts.js';
import { KG_KARAKOL_STREET_ENTITIES } from './streets.js';

export const KG_KARAKOL_ENTITIES = Object.freeze([
  ...KG_KARAKOL_MICRODISTRICT_ENTITIES,
  ...KG_KARAKOL_STREET_ENTITIES,
]);
