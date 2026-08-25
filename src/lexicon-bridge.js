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

const lexiconIndex = new Map();
for (const entity of GEO_ENTITIES) {
  lexiconIndex.set(geoEntityKey({
    country: entity.country,
    city: entity.parentId?.split(':').length >= 2 ? entity.parentId.split(':')[1] : undefined,
    type: entity.type,
    canonical: entity.canonicalName,
  }), entity);

  // City entities have no city parent in the parser tuple.
  if (entity.type === 'city') {
    lexiconIndex.set(geoEntityKey({ country: entity.country, type: 'city', canonical: entity.canonicalName }), entity);
  }
}

export function resolveLexiconGeoEntity(input) {
  if (!input?.country || !input?.canonical) return null;
  const type = input.type || 'city';
  const direct = lexiconIndex.get(geoEntityKey({ ...input, type }));
  if (direct) return direct;

  // Parser structures sometimes expose city separately while the geo entity is the city itself.
  if (type === 'city') {
    return lexiconIndex.get(geoEntityKey({ country: input.country, type, canonical: input.canonical })) ?? null;
  }
  return null;
}

export function geoIdForLexiconEntity(input) {
  return resolveLexiconGeoEntity(input)?.id ?? null;
}

export function hasLexiconGeoEntity(input) {
  return resolveLexiconGeoEntity(input) !== null;
}
