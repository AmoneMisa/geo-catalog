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

const compatibleTypes = Object.freeze({
  local_area: new Set(['microdistrict', 'mahalla', 'suburb', 'settlement', 'poi', 'street']),
});

function matchesCompatibleType(entityType, allowedTypes) {
  if (allowedTypes.has(entityType)) return true;
  return allowedTypes.has('poi') && isPoiType(entityType);
}

export function resolveLexiconGeoEntity(input) {
  if (!input?.country || !input?.canonical) return null;
  const type = input.type || 'city';
  const direct = lexiconIndex.get(geoEntityKey({ ...input, type }));
  if (direct) return direct;

  if (type === 'city') {
    return lexiconIndex.get(geoEntityKey({ country: input.country, type, canonical: input.canonical })) ?? null;
  }

  const canonicalKey = [input.country, input.city, input.canonical].map(normalize).join('|');
  const matches = canonicalIndex.get(canonicalKey) ?? [];

  if (type === 'poi') {
    const poiMatches = matches.filter((entity) => isPoiType(entity.type));
    return poiMatches.length === 1 ? poiMatches[0] : null;
  }

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
