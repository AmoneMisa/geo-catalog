import { UZ_ENTITIES } from './data/uz/index.js';
import { KZ_ENTITIES } from './data/kz/index.js';
import { KG_ENTITIES } from './data/kg/index.js';
import { RO_ENTITIES } from './data/ro/index.js';
import { UA_ENTITIES } from './data/ua/index.js';
import { LEARNED_ADDRESS_ENTITIES } from './data/learned-addresses.js';
import { validateGeoCatalog } from './validate.js';

const entities = [
  ...UZ_ENTITIES,
  ...KZ_ENTITIES,
  ...KG_ENTITIES,
  ...RO_ENTITIES,
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
const childrenByParent = new Map();
for (const entity of GEO_ENTITIES) {
  if (!entity.parentId) continue;
  const siblings = childrenByParent.get(entity.parentId);
  if (siblings) siblings.push(entity);
  else childrenByParent.set(entity.parentId, [entity]);
}
for (const [parentId, children] of childrenByParent) {
  childrenByParent.set(parentId, Object.freeze(children));
}

function matchesType(entityType, requestedType) {
  if (!requestedType) return true;
  if (entityType === requestedType) return true;
  return requestedType === 'poi' && typeof entityType === 'string' && entityType.startsWith('poi.');
}

function matchesFilters(entity, filters) {
  const { country, type } = filters;
  return (!country || entity.country === country) && matchesType(entity.type, type);
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
  const { parentId } = filters;
  return GEO_ENTITIES.filter((entity) =>
    matchesFilters(entity, filters) &&
    (parentId === undefined || entity.parentId === parentId)
  );
}

export function getGeoChildren(parentId, filters = {}) {
  const children = childrenByParent.get(String(parentId || '')) ?? [];
  if (!filters.country && !filters.type) return children;
  return children.filter((entity) => matchesFilters(entity, filters));
}

export function getGeoDescendants(parentId, filters = {}) {
  const rootId = String(parentId || '');
  if (!rootId) return [];

  const descendants = [];
  const queue = [...(childrenByParent.get(rootId) ?? [])];
  const seen = new Set([rootId]);

  for (let index = 0; index < queue.length; index += 1) {
    const entity = queue[index];
    if (!entity || seen.has(entity.id)) continue;
    seen.add(entity.id);

    if (matchesFilters(entity, filters)) descendants.push(entity);

    const children = childrenByParent.get(entity.id);
    if (children) queue.push(...children);
  }

  return descendants;
}
