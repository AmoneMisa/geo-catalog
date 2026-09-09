import { extractOsmPoiCandidates, mergeOsmPoiCandidates } from '../src/osm-poi-import.js';

function normalizedName(value) {
  return String(value ?? '').normalize('NFKD').replace(/\p{M}/gu, '').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableValue(value[key])]));
}

function sortedEntities(entities) {
  return [...entities]
    .sort((left, right) => left.type.localeCompare(right.type)
      || normalizedName(left.canonicalName).localeCompare(normalizedName(right.canonicalName))
      || left.id.localeCompare(right.id))
    .map(stableValue);
}

/**
 * Builds the editable, deterministic review artifact between raw OSM GeoJSON
 * and the generated catalog module. It is deliberately not runtime catalog
 * data: reviewers decide which candidates become canonical entities.
 */
export function createOsmPoiReview({ collection, country, city, parentId, reviewed = [], extraction = null } = {}) {
  if (collection?.type !== 'FeatureCollection' || !Array.isArray(collection.features)) {
    throw new Error('Geo enrichment review requires a GeoJSON FeatureCollection');
  }
  if (!country || !city || !parentId) throw new Error('Geo enrichment review requires country, city and parentId');
  const candidates = extractOsmPoiCandidates(collection.features, { country, city, parentId });
  const merged = mergeOsmPoiCandidates(candidates, reviewed);
  const existingIds = new Set(reviewed.map((entity) => entity.id));
  const existingOsm = new Set(reviewed.filter((entity) => entity.osm).map((entity) => `${entity.osm.type}:${entity.osm.id}`));
  const entities = merged.filter((entity) => !existingIds.has(entity.id)
    && (!entity.osm || !existingOsm.has(`${entity.osm.type}:${entity.osm.id}`)));
  const sorted = sortedEntities(entities);
  const byType = Object.fromEntries([...new Set(sorted.map((entity) => entity.type))]
    .sort().map((type) => [type, sorted.filter((entity) => entity.type === type).length]));
  return stableValue({
    schemaVersion: 1,
    type: 'GeoCatalogOsmPoiReview',
    source: 'OpenStreetMap',
    scope: {
      country: country.toUpperCase(),
      city,
      parentId,
      ...(extraction ? { extraction } : {}),
    },
    summary: { sourceFeatures: collection.features.length, candidates: candidates.length, additions: sorted.length, byType },
    entities: sorted,
  });
}

export function isOsmPoiReview(value) {
  return value?.type === 'GeoCatalogOsmPoiReview' && Array.isArray(value.entities) && value.scope;
}
