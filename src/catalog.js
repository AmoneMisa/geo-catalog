import { CITY_ENTITIES } from './data/cities.js';
import { TASHKENT_ENTITIES } from './data/tashkent.js';
import { TASHKENT_METRO_ENTITIES } from './data/tashkent-metro.js';

const entities = [
  ...CITY_ENTITIES,
  ...TASHKENT_ENTITIES,
  ...TASHKENT_METRO_ENTITIES,
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
