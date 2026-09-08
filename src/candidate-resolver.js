import { findGeoEntitiesByName, getGeoDescendants } from './catalog.js';

function matchesType(entityType, allowedTypes) {
  return !allowedTypes?.length || allowedTypes.some((type) => type === entityType || type === 'poi' && entityType.startsWith('poi.'));
}

function reference(entity) {
  return Object.freeze({
    id: entity.id,
    canonicalName: entity.canonicalName,
    type: entity.type,
    country: entity.country,
    ...(entity.parentId ? { parentId: entity.parentId } : {}),
  });
}

/**
 * Exact, country/city/type-scoped bridge for parsing-lexicon's injected
 * resolveGeoCandidates callback. It deliberately exposes no coordinates and
 * performs neither alias nor fuzzy matching.
 */
export function resolveGeoCatalogCandidates({ country, city, query, types = [] } = {}) {
  if (!country || !query) return Object.freeze([]);
  const normalizedCountry = String(country).toUpperCase();
  const cityEntity = city ? findGeoEntitiesByName(city, { country: normalizedCountry, type: 'city' })[0] : null;
  const candidates = findGeoEntitiesByName(query, { country: normalizedCountry });
  const scoped = cityEntity
    ? new Set([cityEntity.id, ...getGeoDescendants(cityEntity.id).map((entity) => entity.id)])
    : null;
  return Object.freeze(candidates
    .filter((entity) => (!scoped || scoped.has(entity.id)) && matchesType(entity.type, types))
    .map(reference)
    .sort((a, b) => a.id.localeCompare(b.id)));
}
