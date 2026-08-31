const EARTH_RADIUS_KM = 6371.0088;

function toRadians(value) {
  return value * Math.PI / 180;
}

function matchesType(entityType, requestedType) {
  if (!requestedType) return true;
  if (entityType === requestedType) return true;
  return requestedType === 'poi' && typeof entityType === 'string' && entityType.startsWith('poi.');
}

function cross(origin, a, b) {
  return (a[0] - origin[0]) * (b[1] - origin[1]) - (a[1] - origin[1]) * (b[0] - origin[0]);
}

export function isValidCoordinate(point) {
  if (!point || !Number.isFinite(point.lat) || !Number.isFinite(point.lng)) return false;
  return Math.abs(point.lat) <= 90 && Math.abs(point.lng) <= 180;
}

export function containsPoint(point, bbox) {
  if (!isValidCoordinate(point) || !bbox) return false;
  return point.lat >= bbox.south && point.lat <= bbox.north && point.lng >= bbox.west && point.lng <= bbox.east;
}

export function distanceKm(a, b) {
  if (!isValidCoordinate(a) || !isValidCoordinate(b)) return Number.NaN;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/**
 * Return the monotone-chain convex hull of GeoJSON positions ([lng, lat]).
 * The returned ring is open: callers that need Polygon coordinates should append
 * the first position once after checking that at least three vertices exist.
 */
export function convexHullPositions(positions) {
  if (!Array.isArray(positions) || positions.length === 0) return [];

  const unique = new Map();
  for (const position of positions) {
    if (!Array.isArray(position) || position.length < 2) continue;
    const lng = Number(position[0]);
    const lat = Number(position[1]);
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) continue;
    if (Math.abs(lat) > 90 || Math.abs(lng) > 180) continue;
    unique.set(`${lng},${lat}`, [lng, lat]);
  }

  const sorted = [...unique.values()].sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));
  if (sorted.length <= 2) return sorted;

  const buildHalf = (points) => {
    const half = [];
    for (const point of points) {
      while (half.length >= 2 && cross(half[half.length - 2], half[half.length - 1], point) <= 0) {
        half.pop();
      }
      half.push(point);
    }
    return half;
  };

  const lower = buildHalf(sorted);
  const upper = buildHalf([...sorted].reverse());
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

export function nearestGeoEntity(point, entities, filters = {}) {
  if (!isValidCoordinate(point)) return null;
  const { country, type } = filters;
  let nearest = null;
  let nearestDistance = Infinity;
  for (const entity of entities) {
    if (country && entity.country !== country) continue;
    if (!matchesType(entity.type, type)) continue;
    const distance = distanceKm(point, entity.center);
    if (distance < nearestDistance) {
      nearest = entity;
      nearestDistance = distance;
    }
  }
  return nearest ? { entity: nearest, distanceKm: nearestDistance } : null;
}
