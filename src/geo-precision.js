import { distanceKm, isValidCoordinate, containsPoint } from './spatial.js';

/** How precisely a coordinate locates something, and how far it might be off.
 *
 * A rooftop fix and a city centroid are both "lat/lng", and code that treats
 * them alike will happily report a listing as 40 m from a metro station when
 * all it really knows is which city the listing is in. Precision and
 * uncertainty travel with the coordinate so a caller can refuse to answer
 * questions the data cannot support. */

/** Ordered most precise first. */
export const GEO_PRECISIONS = Object.freeze(['rooftop', 'building', 'street', 'neighbourhood', 'district', 'city']);

/** Typical radius, in km, that a coordinate at each precision could be off by.
 * These are deliberately conservative: overstating precision is the failure
 * that produces confidently wrong distances. */
export const PRECISION_UNCERTAINTY_KM = Object.freeze({
  rooftop: 0.02,
  building: 0.05,
  street: 0.3,
  neighbourhood: 1.2,
  district: 4,
  city: 15,
});

/** Entity type to the best precision a centroid for it can claim. */
const TYPE_PRECISION = Object.freeze({
  city: 'city', region: 'city', country: 'city',
  district: 'district', suburb: 'district',
  microdistrict: 'neighbourhood', local_area: 'neighbourhood', development_area: 'neighbourhood',
  mahalla: 'neighbourhood', settlement: 'neighbourhood',
  street: 'street',
  metro: 'building', residential_complex: 'building', poi: 'building',
});

const precisionRank = (precision) => GEO_PRECISIONS.indexOf(precision);
const normalizeType = (type) => (typeof type === 'string' && type.startsWith('poi.') ? 'poi' : type);

export function precisionForEntityType(type) {
  return TYPE_PRECISION[normalizeType(type)] ?? 'district';
}

/**
 * A coordinate with its precision, uncertainty and where it came from.
 *
 * `uncertaintyKm` may be supplied when the source knows better than the
 * precision default, but never below that default -- a city centroid does not
 * become accurate because a provider reported six decimal places.
 */
export function createGeoPoint(input) {
  const { lat, lng, precision, source, bbox, uncertaintyKm } = input ?? {};
  if (!isValidCoordinate({ lat, lng })) throw new TypeError('A geo point requires a valid lat/lng');
  if (!GEO_PRECISIONS.includes(precision)) throw new TypeError(`Unknown geo precision: ${String(precision)}`);
  const floor = PRECISION_UNCERTAINTY_KM[precision];
  const resolved = Number.isFinite(uncertaintyKm) ? Math.max(uncertaintyKm, floor) : floor;
  return Object.freeze({
    lat, lng, precision, uncertaintyKm: resolved,
    ...(source === undefined ? {} : { source }),
    ...(bbox ? { bbox: Object.freeze({ ...bbox }) } : {}),
  });
}

/** Builds a point from a catalog entity, taking precision from its type. */
export function geoPointForEntity(entity, options = {}) {
  const center = entity?.center ?? entity?.coordinates;
  if (!isValidCoordinate(center)) return null;
  return createGeoPoint({
    lat: center.lat, lng: center.lng,
    precision: options.precision ?? precisionForEntityType(entity.type),
    source: options.source ?? entity?.provenance ?? 'catalog',
    bbox: entity?.bbox,
    uncertaintyKm: options.uncertaintyKm,
  });
}

/** The coarser of two precisions. A chain of reasoning is only as precise as
 * its weakest link. */
export function coarsestPrecision(...precisions) {
  let worst = null;
  for (const precision of precisions) {
    if (!GEO_PRECISIONS.includes(precision)) continue;
    if (worst === null || precisionRank(precision) > precisionRank(worst)) worst = precision;
  }
  return worst;
}

/**
 * Checks a coordinate against the hierarchy it claims to sit in.
 *
 * A point inside its container's bbox is `consistent`. A point outside it but
 * within the container's own uncertainty is `uncertain` -- near the edge of a
 * coarse boundary, which is not evidence of an error. A point well outside is
 * `inconsistent`, and that is worth acting on: it usually means the coordinate
 * belongs to a different place with the same name.
 */
export function validateAgainstContainer(point, container) {
  if (!point || !container) return Object.freeze({ status: 'unknown', reason: 'missing' });
  const containerPoint = container.center ?? container.coordinates ?? container;
  if (!isValidCoordinate(containerPoint)) return Object.freeze({ status: 'unknown', reason: 'container-has-no-coordinate' });
  const bbox = container.bbox;
  if (bbox && containsPoint(point, bbox)) return Object.freeze({ status: 'consistent', reason: 'inside-bbox' });
  const km = distanceKm(point, containerPoint);
  if (!Number.isFinite(km)) return Object.freeze({ status: 'unknown', reason: 'undistanceable' });
  const allowance = (container.uncertaintyKm ?? PRECISION_UNCERTAINTY_KM[container.precision ?? precisionForEntityType(container.type)]) + (point.uncertaintyKm ?? 0);
  if (bbox) {
    return km <= allowance
      ? Object.freeze({ status: 'uncertain', reason: 'outside-bbox-within-uncertainty', km })
      : Object.freeze({ status: 'inconsistent', reason: 'outside-bbox', km });
  }
  if (km <= allowance) return Object.freeze({ status: 'consistent', reason: 'within-uncertainty', km });
  if (km <= allowance * 2) return Object.freeze({ status: 'uncertain', reason: 'near-uncertainty-bound', km });
  return Object.freeze({ status: 'inconsistent', reason: 'too-far', km });
}

/**
 * Distance between two points, refusing to be more precise than its inputs.
 * Returns the distance plus the margin it is good to; a caller showing "200 m
 * from the metro" should check that the margin makes that claim meaningful.
 */
export function measuredDistanceKm(from, to) {
  const km = distanceKm(from, to);
  if (!Number.isFinite(km)) return null;
  const marginKm = (from.uncertaintyKm ?? 0) + (to.uncertaintyKm ?? 0);
  return Object.freeze({
    km,
    marginKm,
    precision: coarsestPrecision(from.precision, to.precision),
    /** False when the margin swamps the measurement, i.e. the number is not
     * worth showing. */
    meaningful: km > marginKm,
  });
}
