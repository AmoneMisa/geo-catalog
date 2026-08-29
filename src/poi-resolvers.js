import { GEO_ENTITIES } from './catalog.js';
import { nearestGeoEntity } from './spatial.js';
import { resolveLexiconGeoEntity } from './lexicon-bridge.js';

const DEFAULT_MAX_DISTANCE_KM = 3;

/**
 * Resolve the nearest catalogued park to a metro station, by lexicon canonical
 * name. Returns null when the station is unknown or no park is catalogued
 * within maxDistanceKm — callers should keep whatever generic ("Park") match
 * they already have in that case rather than guessing.
 */
export function nearestParkToMetro(
  { country, city, canonical },
  { maxDistanceKm = DEFAULT_MAX_DISTANCE_KM } = {},
) {
  const station = resolveLexiconGeoEntity({ country, city, type: 'metro', canonical });
  if (!station) return null;

  const nearest = nearestGeoEntity(station.center, GEO_ENTITIES, { country, type: 'poi.park' });
  if (!nearest || nearest.distanceKm > maxDistanceKm) return null;

  return Object.freeze({
    station,
    park: nearest.entity,
    distanceKm: nearest.distanceKm,
  });
}
