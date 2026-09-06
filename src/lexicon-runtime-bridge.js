import {
  geoEntityKey as rawGeoEntityKey,
  resolveLexiconGeoEntityExact as rawResolveLexiconGeoEntityExact,
  resolveLexiconGeoEntity as rawResolveLexiconGeoEntity,
} from './lexicon-bridge.js';

const LEXICON_BUCKET_TYPES = Object.freeze({
  districts: 'district',
  microdistricts: 'microdistrict',
  mahallas: 'mahalla',
  localAreas: 'local_area',
  suburbs: 'suburb',
  settlements: 'settlement',
  developmentAreas: 'development_area',
  metro: 'metro',
  residentialComplexes: 'residential_complex',
  streets: 'street',
  landmarks: 'poi',
  pois: 'poi',
});

function normalizeLexiconRuntimeInput(input) {
  if (!input || typeof input !== 'object') return input;

  const type = LEXICON_BUCKET_TYPES[input.type] ?? input.type;
  const canonical = input.canonical ?? input.name;

  if (type === input.type && canonical === input.canonical) return input;
  return { ...input, type, canonical };
}

/**
 * Public adapter for @whiteslove/parsing-lexicon runtime matches.
 * matchDictionaryLocation() returns bucket names such as `streets`,
 * `residentialComplexes` and `microdistricts`, plus `name` instead of
 * `canonical`. Normalize only that transport shape; the underlying bridge
 * still owns all semantic compatibility and physical-entity decisions.
 */
export function geoEntityKey(input) {
  return rawGeoEntityKey(normalizeLexiconRuntimeInput(input));
}

export function resolveLexiconGeoEntityExact(input) {
  return rawResolveLexiconGeoEntityExact(normalizeLexiconRuntimeInput(input));
}

export function resolveLexiconGeoEntity(input) {
  return rawResolveLexiconGeoEntity(normalizeLexiconRuntimeInput(input));
}

export function geoIdForLexiconEntity(input) {
  return resolveLexiconGeoEntity(input)?.id ?? null;
}

export function hasLexiconGeoEntity(input) {
  return resolveLexiconGeoEntity(input) !== null;
}
