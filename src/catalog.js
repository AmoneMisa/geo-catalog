import { CITY_ENTITIES } from './data/cities.js';
import { TASHKENT_ENTITIES } from './data/tashkent.js';
import { TASHKENT_METRO_ENTITIES } from './data/tashkent-metro.js';
import { TASHKENT_METRO_EXTRA_ENTITIES } from './data/tashkent-metro-extra.js';
import { TASHKENT_METRO_CIRCLE_EXTRA_ENTITIES } from './data/tashkent-metro-circle-extra.js';
import { TASHKENT_MICRODISTRICT_ENTITIES } from './data/tashkent-microdistricts.js';
import { TASHKENT_MICRODISTRICT_EXTRA_ENTITIES } from './data/tashkent-microdistricts-extra.js';
import { TASHKENT_CHILANZAR_11_14_ENTITIES } from './data/tashkent-microdistricts-chilanzar-11-14.js';
import { TASHKENT_CHILANZAR_15_20_ENTITIES } from './data/tashkent-microdistricts-chilanzar-15-20.js';
import { TASHKENT_YUNUSABAD_4_9_ENTITIES } from './data/tashkent-microdistricts-yunusabad-4-9.js';
import { TASHKENT_YUNUSABAD_11_16_ENTITIES } from './data/tashkent-microdistricts-yunusabad-11-16.js';
import { TASHKENT_YUNUSABAD_17_19_ENTITIES } from './data/tashkent-microdistricts-yunusabad-17-19.js';
import { TASHKENT_NAMED_MICRODISTRICT_ENTITIES } from './data/tashkent-microdistricts-named.js';
import { TASHKENT_LOCAL_AREA_ENTITIES } from './data/tashkent-local-areas.js';
import { TASHKENT_ALMAZAR_LOCAL_AREA_ENTITIES } from './data/tashkent-local-areas-almazar.js';
import { TASHKENT_SHAYKHANTAHUR_LOCAL_AREA_ENTITIES } from './data/tashkent-local-areas-shaykhantahur.js';
import { TASHKENT_CORE_EXTRA_LOCAL_AREA_ENTITIES } from './data/tashkent-local-areas-core-extra.js';
import { TASHKENT_MIRZO_ULUGBEK_LOCAL_AREA_ENTITIES } from './data/tashkent-local-areas-mirzo-ulugbek.js';
import { TASHKENT_YASHNOBOD_LOCAL_AREA_ENTITIES } from './data/tashkent-local-areas-yashnobod.js';
import { TASHKENT_MAHALLA_ENTITIES } from './data/tashkent-mahallas.js';
import { TASHKENT_POI_ENTITIES } from './data/tashkent-poi.js';
import { TASHKENT_POI_EXTRA_ENTITIES } from './data/tashkent-poi-extra.js';
import { TASHKENT_RESIDENTIAL_ENTITIES } from './data/tashkent-residential.js';
import { TASHKENT_RESIDENTIAL_EXTRA_ENTITIES } from './data/tashkent-residential-extra.js';

const entities = [
  ...CITY_ENTITIES,
  ...TASHKENT_ENTITIES,
  ...TASHKENT_METRO_ENTITIES,
  ...TASHKENT_METRO_EXTRA_ENTITIES,
  ...TASHKENT_METRO_CIRCLE_EXTRA_ENTITIES,
  ...TASHKENT_MICRODISTRICT_ENTITIES,
  ...TASHKENT_MICRODISTRICT_EXTRA_ENTITIES,
  ...TASHKENT_CHILANZAR_11_14_ENTITIES,
  ...TASHKENT_CHILANZAR_15_20_ENTITIES,
  ...TASHKENT_YUNUSABAD_4_9_ENTITIES,
  ...TASHKENT_YUNUSABAD_11_16_ENTITIES,
  ...TASHKENT_YUNUSABAD_17_19_ENTITIES,
  ...TASHKENT_NAMED_MICRODISTRICT_ENTITIES,
  ...TASHKENT_LOCAL_AREA_ENTITIES,
  ...TASHKENT_ALMAZAR_LOCAL_AREA_ENTITIES,
  ...TASHKENT_SHAYKHANTAHUR_LOCAL_AREA_ENTITIES,
  ...TASHKENT_CORE_EXTRA_LOCAL_AREA_ENTITIES,
  ...TASHKENT_MIRZO_ULUGBEK_LOCAL_AREA_ENTITIES,
  ...TASHKENT_YASHNOBOD_LOCAL_AREA_ENTITIES,
  ...TASHKENT_MAHALLA_ENTITIES,
  ...TASHKENT_POI_ENTITIES,
  ...TASHKENT_POI_EXTRA_ENTITIES,
  ...TASHKENT_RESIDENTIAL_ENTITIES,
  ...TASHKENT_RESIDENTIAL_EXTRA_ENTITIES,
];

export const GEO_ENTITIES = Object.freeze(entities.map((entity) => Object.freeze({
  ...entity,
  center: Object.freeze({ ...entity.center }),
  ...(entity.bbox ? { bbox: Object.freeze({ ...entity.bbox }) } : {}),
  ...(entity.osm ? { osm: Object.freeze({ ...entity.osm }) } : {})
})));

const byId = new Map(GEO_ENTITIES.map((entity) => [entity.id, entity]));

export function getGeoEntity(id) {
  return byId.get(id) ?? null;
}

export function hasGeoEntity(id) {
  return byId.has(id);
}

export function findGeoEntities(filters = {}) {
  const { country, type, parentId } = filters;
  return GEO_ENTITIES.filter((entity) =>
    (!country || entity.country === country) &&
    (!type || entity.type === type) &&
    (parentId === undefined || entity.parentId === parentId)
  );
}

export function getGeoChildren(parentId) {
  return findGeoEntities({ parentId });
}
