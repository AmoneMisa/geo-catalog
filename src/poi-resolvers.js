import { GEO_ENTITIES } from './catalog.js';
import { nearestGeoEntity } from './spatial.js';
import { resolveLexiconGeoEntity } from './lexicon-bridge.js';

const DEFAULT_MAX_DISTANCE_KM = 3;

/**
 * Resolve the nearest catalogued entity of a given type/subtype to a metro
 * station, by lexicon canonical name. Returns null when the station is
 * unknown or nothing of that type is catalogued within maxDistanceKm —
 * callers should keep whatever generic text match they already have in that
 * case rather than guessing.
 *
 * `type` accepts anything nearestGeoEntity does: a broad type ('poi',
 * 'mahalla', 'microdistrict', 'local_area', 'address', 'street', ...) or a
 * 'poi.<category>' subtype (e.g. 'poi.park') to narrow within POIs. Bare
 * 'poi' matches any poi.* subtype too, so it also serves as "nearest POI of
 * any kind" when no more specific category applies.
 */
export function nearestGeoEntityToMetro(
  { country, city, canonical },
  { type = 'poi', maxDistanceKm = DEFAULT_MAX_DISTANCE_KM } = {},
) {
  const station = resolveLexiconGeoEntity({ country, city, type: 'metro', canonical });
  if (!station) return null;

  const nearest = nearestGeoEntity(station.center, GEO_ENTITIES, { country, type });
  if (!nearest || nearest.distanceKm > maxDistanceKm) return null;

  return Object.freeze({
    station,
    entity: nearest.entity,
    distanceKm: nearest.distanceKm,
  });
}

/** Convenience wrapper: nearest park (poi.park) to a metro station. */
export function nearestParkToMetro(input, options) {
  const result = nearestGeoEntityToMetro(input, { ...options, type: 'poi.park' });
  return result && Object.freeze({ station: result.station, park: result.entity, distanceKm: result.distanceKm });
}

/** Convenience wrapper: nearest POI of any kind (bazaar, mall, mosque, park, ...) to a metro station. */
export function nearestPoiToMetro(input, options) {
  return nearestGeoEntityToMetro(input, { ...options, type: 'poi' });
}

/** Convenience wrapper: nearest mahalla to a metro station. */
export function nearestMahallaToMetro(input, options) {
  return nearestGeoEntityToMetro(input, { ...options, type: 'mahalla' });
}

/**
 * Convenience wrapper: nearest microdistrict to a metro station. Covers
 * "mavze" mentions too — mavze is the Uzbek term parsing-lexicon treats as a
 * microdistrict/quarter marker, not a distinct geo-catalog type.
 */
export function nearestMicrodistrictToMetro(input, options) {
  return nearestGeoEntityToMetro(input, { ...options, type: 'microdistrict' });
}

/** Convenience wrapper: nearest local area to a metro station. */
export function nearestLocalAreaToMetro(input, options) {
  return nearestGeoEntityToMetro(input, { ...options, type: 'local_area' });
}

/** Convenience wrapper: nearest catalogued address/street to a metro station. */
export function nearestAddressToMetro(input, options) {
  return nearestGeoEntityToMetro(input, { ...options, type: 'address' });
}
