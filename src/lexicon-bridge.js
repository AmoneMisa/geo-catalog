import { GEO_ENTITIES } from './catalog.js';

function normalize(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/[’ʻʼ‘`´]/g, "'")
    .replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '');
}

export function geoEntityKey({ country, city, type, canonical }) {
  return [country, city, type, canonical].map(normalize).join('|');
}

function entityCity(entity) {
  return entity.type === 'city' ? undefined : entity.parentId?.split(':')[1];
}

function isPoiType(type) {
  return type === 'poi' || (typeof type === 'string' && type.startsWith('poi.'));
}

const lexiconIndex = new Map();
const canonicalIndex = new Map();
const entityById = new Map(GEO_ENTITIES.map((entity) => [entity.id, entity]));
for (const entity of GEO_ENTITIES) {
  const city = entityCity(entity);
  lexiconIndex.set(geoEntityKey({
    country: entity.country,
    city,
    type: entity.type,
    canonical: entity.canonicalName,
  }), entity);

  const canonicalKey = [entity.country, city, entity.canonicalName].map(normalize).join('|');
  const canonicalMatches = canonicalIndex.get(canonicalKey) ?? [];
  canonicalMatches.push(entity);
  canonicalIndex.set(canonicalKey, canonicalMatches);

  if (entity.type === 'city') {
    lexiconIndex.set(geoEntityKey({ country: entity.country, type: 'city', canonical: entity.canonicalName }), entity);
  }
}

// Parser canonicals can evolve independently from OSM/source naming. Keep narrowly
// verified spelling aliases here instead of duplicating physical geo entities.
const lexiconAliases = new Map([
  [geoEntityKey({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'TashGRES' }), 'uz:tashkent:local-area:tashgres'],
  [geoEntityKey({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Takhtapul' }), 'uz:tashkent:local-area:taxtapul'],
]);

const compatibleTypes = Object.freeze({
  local_area: new Set(['microdistrict', 'mahalla', 'suburb', 'settlement', 'poi', 'street']),
});

function matchesCompatibleType(entityType, allowedTypes) {
  if (allowedTypes.has(entityType)) return true;
  return allowedTypes.has('poi') && isPoiType(entityType);
}

export function resolveLexiconGeoEntityExact(input) {
  if (!input?.country || !input?.canonical) return null;
  const type = input.type || 'city';
  const key = geoEntityKey({ ...input, type });
  const direct = lexiconIndex.get(key);
  if (direct) return direct;

  const aliasId = lexiconAliases.get(key);
  if (aliasId) return entityById.get(aliasId) ?? null;

  if (type === 'city') {
    return lexiconIndex.get(geoEntityKey({ country: input.country, type, canonical: input.canonical })) ?? null;
  }

  if (type === 'poi') {
    const canonicalKey = [input.country, input.city, input.canonical].map(normalize).join('|');
    const poiMatches = (canonicalIndex.get(canonicalKey) ?? []).filter((entity) => isPoiType(entity.type));
    return poiMatches.length === 1 ? poiMatches[0] : null;
  }

  return null;
}

export function resolveLexiconGeoEntity(input) {
  const exact = resolveLexiconGeoEntityExact(input);
  if (exact) return exact;
  if (!input?.country || !input?.canonical) return null;

  const type = input.type || 'city';
  if (type === 'city' || type === 'poi') return null;

  const canonicalKey = [input.country, input.city, input.canonical].map(normalize).join('|');
  const matches = canonicalIndex.get(canonicalKey) ?? [];
  const allowedFallbackTypes = compatibleTypes[type];
  if (!allowedFallbackTypes) return null;
  const compatibleMatches = matches.filter((entity) => matchesCompatibleType(entity.type, allowedFallbackTypes));
  return compatibleMatches.length === 1 ? compatibleMatches[0] : null;
}

export function geoIdForLexiconEntity(input) {
  return resolveLexiconGeoEntity(input)?.id ?? null;
}

export function hasLexiconGeoEntity(input) {
  return resolveLexiconGeoEntity(input) !== null;
}
