import { KG_BISHKEK_DISTRICT_ENTITIES } from './districts.js';
import { KG_BISHKEK_MICRODISTRICT_ENTITIES } from './microdistricts.js';
import { KG_BISHKEK_LOCAL_AREA_ENTITIES } from './local-areas.js';
import { KG_BISHKEK_RESIDENTIAL_COMPLEX_ENTITIES } from './residential-complexes.js';

export const KG_BISHKEK_ENTITIES = Object.freeze([
  ...KG_BISHKEK_DISTRICT_ENTITIES,
  ...KG_BISHKEK_MICRODISTRICT_ENTITIES,
  ...KG_BISHKEK_LOCAL_AREA_ENTITIES,
  ...KG_BISHKEK_RESIDENTIAL_COMPLEX_ENTITIES,
]);
