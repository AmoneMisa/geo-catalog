import { GEO_ENTITIES } from './catalog.js';
import { LEXICON_GEO_LINKS } from './data/lexicon-geo-links.js';

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

const linkedGeoIndex = new Map(LEXICON_GEO_LINKS.map((link) => [geoEntityKey(link), link.geoId]));

const compatibleTypes = Object.freeze({
  local_area: new Set(['microdistrict', 'mahalla', 'suburb', 'settlement', 'poi', 'street']),
});

export function resolveLexiconGeoEntity(input) {
  if (!input?.country || !input?.canonical) return null;
  const type = input.type || 'city';
  const direct = lexiconIndex.get(geoEntityKey({ ...input, type }));
  if (direct) return direct;

  const linkedGeoId = linkedGeoIndex.get(geoEntityKey({ ...input, type }));
  if (linkedGeoId) return entityById.get(linkedGeoId) ?? null;

  if (type === 'city') {
    return lexiconIndex.get(geoEntityKey({ country: input.country, type, canonical: input.canonical })) ?? null;
  }

  const allowedFallbackTypes = compatibleTypes[type];
  if (!allowedFallbackTypes) return null;
  const canonicalKey = [input.country, input.city, input.canonical].map(normalize).join('|');
  const matches = (canonicalIndex.get(canonicalKey) ?? []).filter((entity) => allowedFallbackTypes.has(entity.type));
  return matches.length === 1 ? matches[0] : null;
}

export function geoIdForLexiconEntity(input) {
  return resolveLexiconGeoEntity(input)?.id ?? null;
}

export function hasLexiconGeoEntity(input) {
  return resolveLexiconGeoEntity(input) !== null;
}
