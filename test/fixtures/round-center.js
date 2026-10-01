import { roundCoordinate } from '../../src/catalog-format.js';

/** Catalog centers are stored rounded to 7 decimals; tests that pin a source
 * coordinate compare against the same rounding of it. */
export function roundCenter(center) {
  return { ...center, lat: roundCoordinate(center.lat), lng: roundCoordinate(center.lng) };
}
