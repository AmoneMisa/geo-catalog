import { CITY_ENTITIES } from './data/cities.js';
import { UZ_ENTITIES } from './data/uz/index.js';
import { UA_ENTITIES } from './data/ua/index.js';
import { LEARNED_ADDRESS_ENTITIES } from './data/learned-addresses.js';
import { validateGeoCatalog } from './validate.js';

const entities = [
  ...CITY_ENTITIES,
  ...UZ_ENTITIES,
  ...UA_ENTITIES,
  ...LEARNED_ADDRESS_ENTITIES,
];

const validation = validateGeoCatalog(entities);
if (!validation.valid) {
  throw new Error(`Invalid geo catalog:\n${validation.errors.join('\n')}`);
}

export const GEO_ENTITIES = Object.freeze(entities.map((entity) => Object.freeze({
  ...entity,
  center: Object.freeze({ ...entity.center }),
  ...(entity.bbox ? { bbox: Object.freeze({ ...entity.bbox }) } : {}),
  ...(entity.osm ? { osm: Object.freeze({ ...entity.osm }) } : {})
})));

const byId = new Map(GEO_ENTITIES.map((entity) => [entity.id, entity]));
const byLookupKey = new Map(
  GEO_ENTITIES
    .filter((entity) => entity.lookupKey)
    .map((entity) => [entity.lookupKey, entity]),
);

export function getGeoEntity(id) {
  return byId.get(id) ?? null;
}

export function getGeoEntityByLookupKey(lookupKey) {
  return byLookupKey.get(String(lookupKey || '')) ?? null;
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
