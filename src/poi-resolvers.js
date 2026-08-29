import { GEO_ENTITIES } from './catalog.js';
import { nearestGeoEntity, isValidCoordinate } from './spatial.js';
import { resolveLexiconGeoEntity } from './lexicon-bridge.js';

const DEFAULT_MAX_DISTANCE_KM = 3;

function nearestOfType(point, entities, country, type, maxDistanceKm) {
  const nearest = nearestGeoEntity(point, entities, { country, type });
  if (!nearest || nearest.distanceKm > maxDistanceKm) return null;
  return nearest;
}

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
 *
 * `entities` defaults to the static GEO_ENTITIES catalog; pass your own array
 * (e.g. address rows loaded from Postgres, shaped as { center: {lat, lng},
 * ...} ) to search a caller-supplied candidate set instead — this is how
 * addresses are meant to be resolved, since they are not part of the static
 * catalog.
 */
export function nearestGeoEntityToMetro(
  { country, city, canonical },
  { type = 'poi', maxDistanceKm = DEFAULT_MAX_DISTANCE_KM, entities = GEO_ENTITIES } = {},
) {
  const station = resolveLexiconGeoEntity({ country, city, type: 'metro', canonical });
  if (!station) return null;

  const nearest = nearestOfType(station.center, entities, country, type, maxDistanceKm);
  if (!nearest) return null;

  return Object.freeze({ station, entity: nearest.entity, distanceKm: nearest.distanceKm });
}

/**
 * The reverse direction: resolve the nearest metro station to a catalogued
 * entity (a park, mahalla, microdistrict, local area, ...), by lexicon
 * canonical name and type. Returns null when the entity is unknown or no
 * metro station is catalogued within maxDistanceKm. Metro stations are
 * always looked up in the static GEO_ENTITIES catalog, since they don't come
 * from Postgres.
 */
export function nearestMetroToGeoEntity(
  { country, city, canonical, type = 'poi' },
  { maxDistanceKm = DEFAULT_MAX_DISTANCE_KM } = {},
) {
  const entity = resolveLexiconGeoEntity({ country, city, type, canonical });
  if (!entity) return null;

  const nearest = nearestOfType(entity.center, GEO_ENTITIES, country, 'metro', maxDistanceKm);
  if (!nearest) return null;

  return Object.freeze({ entity, station: nearest.entity, distanceKm: nearest.distanceKm });
}

/**
 * Point-based reverse resolution: nearest metro station to an arbitrary
 * coordinate, e.g. a geocoded address row loaded from Postgres. Use this
 * (rather than nearestMetroToGeoEntity) whenever the source record isn't in
 * the static lexicon-backed catalog — addresses in particular, since they
 * are stored and loaded separately.
 */
export function nearestMetroToPoint(point, { country, maxDistanceKm = DEFAULT_MAX_DISTANCE_KM } = {}) {
  if (!isValidCoordinate(point)) return null;
  const nearest = nearestOfType(point, GEO_ENTITIES, country, 'metro', maxDistanceKm);
  return nearest && Object.freeze({ station: nearest.entity, distanceKm: nearest.distanceKm });
}

/** Convenience wrapper: nearest park (poi.park) to a metro station. */
export function nearestParkToMetro(input, options) {
  const result = nearestGeoEntityToMetro(input, { ...options, type: 'poi.park' });
  return result && Object.freeze({ station: result.station, park: result.entity, distanceKm: result.distanceKm });
}

/** Reverse of nearestParkToMetro: nearest metro station to a named park. */
export function nearestMetroToPark(input, options) {
  const result = nearestMetroToGeoEntity({ ...input, type: 'poi.park' }, options);
  return result && Object.freeze({ park: result.entity, station: result.station, distanceKm: result.distanceKm });
}

/** Convenience wrapper: nearest POI of any kind (bazaar, mall, mosque, park, ...) to a metro station. */
export function nearestPoiToMetro(input, options) {
  return nearestGeoEntityToMetro(input, { ...options, type: 'poi' });
}

/** Reverse of nearestPoiToMetro: nearest metro station to a named POI of any kind. */
export function nearestMetroToPoi(input, options) {
  return nearestMetroToGeoEntity({ ...input, type: 'poi' }, options);
}

/** Convenience wrapper: nearest mahalla to a metro station. */
export function nearestMahallaToMetro(input, options) {
  return nearestGeoEntityToMetro(input, { ...options, type: 'mahalla' });
}

/** Reverse of nearestMahallaToMetro: nearest metro station to a named mahalla. */
export function nearestMetroToMahalla(input, options) {
  return nearestMetroToGeoEntity({ ...input, type: 'mahalla' }, options);
}

/**
 * Convenience wrapper: nearest microdistrict to a metro station. Covers
 * "mavze" mentions too — mavze is the Uzbek term parsing-lexicon treats as a
 * microdistrict/quarter marker, not a distinct geo-catalog type.
 */
export function nearestMicrodistrictToMetro(input, options) {
  return nearestGeoEntityToMetro(input, { ...options, type: 'microdistrict' });
}

/** Reverse of nearestMicrodistrictToMetro: nearest metro station to a named microdistrict (or "mavze"). */
export function nearestMetroToMicrodistrict(input, options) {
  return nearestMetroToGeoEntity({ ...input, type: 'microdistrict' }, options);
}

/** Convenience wrapper: nearest local area to a metro station. */
export function nearestLocalAreaToMetro(input, options) {
  return nearestGeoEntityToMetro(input, { ...options, type: 'local_area' });
}

/** Reverse of nearestLocalAreaToMetro: nearest metro station to a named local area. */
export function nearestMetroToLocalArea(input, options) {
  return nearestMetroToGeoEntity({ ...input, type: 'local_area' }, options);
}

/**
 * Nearest metro station to an address row loaded from Postgres (or any other
 * external store) — not the static catalog, since addresses live in the
 * database, not in geo-catalog's lexicon-backed data. Pass the address's
 * coordinates as { lat, lng }.
 */
export function nearestMetroToAddress(addressPoint, options) {
  return nearestMetroToPoint(addressPoint, options);
}

/**
 * Nearest address to a metro station, searching a caller-supplied list of
 * address rows (e.g. fetched from Postgres for the relevant city/country)
 * rather than the static catalog. Each row must be shaped like a GeoEntity —
 * at minimum { center: {lat, lng}, country, type: 'address' } — since the
 * underlying matcher filters by both country and type; map your query
 * result to that shape before calling.
 */
export function nearestAddressToMetro(input, addresses, options) {
  return nearestGeoEntityToMetro(input, { ...options, type: 'address', entities: addresses });
}
