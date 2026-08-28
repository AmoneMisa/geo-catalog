import { UZ_ENTITIES } from './data/uz/index.js';
import { KZ_ENTITIES } from './data/kz/index.js';
import { UA_ENTITIES } from './data/ua/index.js';
import { LEARNED_ADDRESS_ENTITIES } from './data/learned-addresses.js';
import { validateGeoCatalog } from './validate.js';

const entities = [
  ...UZ_ENTITIES,
  ...KZ_ENTITIES,
  ...UA_ENTITIES,
  ...LEARNED_ADDRESS_ENTITIES,
];

const validation = validateGeoCatalog(entities);
if (!validation.valid) {
  throw new Error(`Invalid geo catalog:\n${validation.errors.join('\n')}`);
}

function freezeBoundaryCoordinates(value) {
  if (!Array.isArray(value)) return value;
  return Object.freeze(value.map(freezeBoundaryCoordinates));
}

function freezeBoundary(boundary) {
  return Object.freeze({
    ...boundary,
    coordinates: freezeBoundaryCoordinates(boundary.coordinates),
  });
}

export const GEO_ENTITIES = Object.freeze(entities.map((entity) => Object.freeze({
  ...entity,
  center: Object.freeze({ ...entity.center }),
  ...(entity.bbox ? { bbox: Object.freeze({ ...entity.bbox }) } : {}),
  ...(entity.boundary ? { boundary: freezeBoundary(entity.boundary) } : {}),
  ...(entity.osm ? { osm: Object.freeze({ ...entity.osm }) } : {})
})));

const byId = new Map(GEO_ENTITIES.map((entity) => [entity.id, entity]));
const byLookupKey = new Map(
  GEO_ENTITIES
    .filter((entity) => entity.lookupKey)
    .map((entity) => [entity.lookupKey, entity]),
);

function matchesType(entityType, requestedType) {
  if (!requestedType) return true;
  if (entityType === requestedType) return true;
  return requestedType === 'poi' && typeof entityType === 'string' && entityType.startsWith('poi.');
}

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
    matchesType(entity.type, type) &&
    (parentId === undefined || entity.parentId === parentId)
  );
}

export function getGeoChildren(parentId) {
  return findGeoEntities({ parentId });
}
