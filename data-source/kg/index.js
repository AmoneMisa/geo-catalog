import { KG_CITY_ENTITIES } from './cities.js';
import { KG_BISHKEK_ENTITIES } from './bishkek/index.js';
import { KG_OSH_ENTITIES } from './osh/index.js';
import { KG_KARAKOL_ENTITIES } from './karakol/index.js';
import { KG_JALAL_ABAD_ENTITIES } from './jalal-abad/index.js';

export const KG_ENTITIES = Object.freeze([
  ...KG_CITY_ENTITIES,
  ...KG_BISHKEK_ENTITIES,
  ...KG_OSH_ENTITIES,
  ...KG_KARAKOL_ENTITIES,
  ...KG_JALAL_ABAD_ENTITIES,
]);
