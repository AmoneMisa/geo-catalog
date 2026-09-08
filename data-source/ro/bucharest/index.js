import { RO_BUCHAREST_DISTRICT_ENTITIES } from './districts.js';
import { RO_BUCHAREST_OSM_POI_ENTITIES } from './osm-poi.js';

export const RO_BUCHAREST_ENTITIES = Object.freeze([
  ...RO_BUCHAREST_DISTRICT_ENTITIES,
  ...RO_BUCHAREST_OSM_POI_ENTITIES,
]);
