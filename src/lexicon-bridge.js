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

const alias = (country, city, type, canonical, id) => [
  geoEntityKey({ country, city, type, canonical }),
  id,
];

// Parser canonicals can evolve independently from OSM/source naming. Keep narrowly
// verified aliases here instead of duplicating physical geo entities. Kharkiv also
// has listing-area canonicals based on metro stations and major POIs; those resolve
// to the existing physical owner rather than creating fake microdistrict geometry.
const lexiconAliases = new Map([
  alias('UZ', 'Tashkent', 'local_area', 'TashGRES', 'uz:tashkent:local-area:tashgres'),

  alias('UA', 'Kharkiv', 'microdistrict', 'Saltivka', 'ua:kharkiv:microdistrict:saltivka'),
  alias('UA', 'Kharkiv', 'microdistrict', 'North Saltivka', 'ua:kharkiv:microdistrict:pivnichna-saltivka'),
  alias('UA', 'Kharkiv', 'microdistrict', 'North Saltivka-1', 'ua:kharkiv:microdistrict:pivnichna-saltivka-1'),
  alias('UA', 'Kharkiv', 'microdistrict', 'North Saltivka-2', 'ua:kharkiv:microdistrict:pivnichna-saltivka-2'),
  alias('UA', 'Kharkiv', 'microdistrict', 'North Saltivka-3', 'ua:kharkiv:microdistrict:pivnichna-saltivka-3'),
  alias('UA', 'Kharkiv', 'microdistrict', 'North Saltivka-4', 'ua:kharkiv:microdistrict:pivnichna-saltivka-4'),
  alias('UA', 'Kharkiv', 'microdistrict', 'North Saltivka-5', 'ua:kharkiv:microdistrict:pivnichna-saltivka-5'),
  alias('UA', 'Kharkiv', 'microdistrict', '524 microdistrict', 'ua:kharkiv:microdistrict:524-mikroraion'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Pavlove Pole', 'ua:kharkiv:microdistrict:pavlove-pole'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Oleksiivka', 'ua:kharkiv:microdistrict:oleksiivka'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Shatylivka', 'ua:kharkiv:microdistrict:shatylivka'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Center', 'ua:kharkiv:microdistrict:nahirnyi'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Zhuravlivka', 'ua:kharkiv:microdistrict:zhuravlivka'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Velyka Danylivka', 'ua:kharkiv:microdistrict:velyka-danylivka'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Piatykhatky', 'ua:kharkiv:microdistrict:piatykhatky'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Pomerky', 'ua:kharkiv:microdistrict:pomerky'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Sokolnyky', 'ua:kharkiv:microdistrict:sokilnyky'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Barabashovo', 'ua:kharkiv:microdistrict:barabashovo'),
  alias('UA', 'Kharkiv', 'microdistrict', 'HTZ', 'ua:kharkiv:microdistrict:khtz'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Novi Budynky', 'ua:kharkiv:microdistrict:novi-budynky'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Kholodna Hora', 'ua:kharkiv:microdistrict:kholodna-hora'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Zaliutyne', 'ua:kharkiv:microdistrict:zaliutyne'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Osnova', 'ua:kharkiv:microdistrict:osnova'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Levada', 'ua:kharkiv:microdistrict:levada'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Rohan', 'ua:kharkiv:microdistrict:rohan'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Zhykhar', 'ua:kharkiv:microdistrict:zhykhar'),

  alias('UA', 'Kharkiv', 'microdistrict', 'Botanical Garden', 'ua:kharkiv:metro:botanichnyi-sad'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Derzhprom', 'ua:kharkiv:metro:derzhprom'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Heroiv Pratsi', 'ua:kharkiv:metro:heroiv-pratsi'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Studentska', 'ua:kharkiv:metro:studentska'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Akademika Pavlova', 'ua:kharkiv:metro:akademika-pavlova'),
  alias('UA', 'Kharkiv', 'microdistrict', '23 Serpnia', 'ua:kharkiv:metro:23-serpnia'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Pivdennyi Vokzal', 'ua:kharkiv:metro:pivdennyi-vokzal'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Haharina', 'ua:kharkiv:metro:levada'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Sportyvna', 'ua:kharkiv:metro:sportyvna'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Zakhysnykiv Ukrainy', 'ua:kharkiv:metro:zakhysnykiv-ukrainy'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Industrialna', 'ua:kharkiv:metro:industrialna'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Metalist', 'ua:kharkiv:poi:metalist'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Karavan', 'ua:kharkiv:poi:karavan'),
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
