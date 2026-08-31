import { KG_CITY_ENTITIES } from './cities.js';
import { KG_BISHKEK_ENTITIES } from './bishkek/index.js';

export const KG_ENTITIES = Object.freeze([
  ...KG_CITY_ENTITIES,
  ...KG_BISHKEK_ENTITIES,
]);
