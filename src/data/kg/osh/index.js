import { KG_OSH_DISTRICT_ENTITIES } from './districts.js';
import { KG_OSH_MICRODISTRICT_ENTITIES } from './microdistricts.js';
import { KG_OSH_RESIDENTIAL_COMPLEX_ENTITIES } from './residential-complexes.js';
import { KG_OSH_SETTLEMENT_ENTITIES } from './settlements.js';

export const KG_OSH_ENTITIES = Object.freeze([
  ...KG_OSH_DISTRICT_ENTITIES,
  ...KG_OSH_MICRODISTRICT_ENTITIES,
  ...KG_OSH_RESIDENTIAL_COMPLEX_ENTITIES,
  ...KG_OSH_SETTLEMENT_ENTITIES,
]);
