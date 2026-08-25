const EARTH_RADIUS_KM = 6371.0088;

function toRadians(value) {
  return value * Math.PI / 180;
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

export function nearestGeoEntity(point, entities, filters = {}) {
  if (!isValidCoordinate(point)) return null;
  const { country, type } = filters;
  let nearest = null;
  let nearestDistance = Infinity;
  for (const entity of entities) {
    if (country && entity.country !== country) continue;
    if (type && entity.type !== type) continue;
    const distance = distanceKm(point, entity.center);
    if (distance < nearestDistance) {
      nearest = entity;
      nearestDistance = distance;
    }
  }
  return nearest ? { entity: nearest, distanceKm: nearestDistance } : null;
}
