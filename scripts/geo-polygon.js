// Dependency-free polygon utilities used to compute a representative point
// ("point on surface") for OSM ways/relations instead of Overpass's bbox-based
// `out center`, which can land outside concave (e.g. L-shaped, crescent) boundaries.

function ringArea(ring) {
  let area = 0;
  for (let i = 0; i < ring.length; i += 1) {
    const a = ring[i];
    const b = ring[(i + 1) % ring.length];
    area += a.lng * b.lat - b.lng * a.lat;
  }
  return area / 2;
}

function ringCentroid(ring) {
  let cx = 0;
  let cy = 0;
  let area = 0;
  for (let i = 0; i < ring.length; i += 1) {
    const a = ring[i];
    const b = ring[(i + 1) % ring.length];
    const cross = a.lng * b.lat - b.lng * a.lat;
    area += cross;
    cx += (a.lng + b.lng) * cross;
    cy += (a.lat + b.lat) * cross;
  }
  area /= 2;
  if (Math.abs(area) < 1e-12) {
    const lat = ring.reduce((sum, p) => sum + p.lat, 0) / ring.length;
    const lng = ring.reduce((sum, p) => sum + p.lng, 0) / ring.length;
    return { lat, lng };
  }
  return { lat: cy / (6 * area), lng: cx / (6 * area) };
}

function ringBounds(ring) {
  let west = Infinity;
  let east = -Infinity;
  let south = Infinity;
  let north = -Infinity;
  for (const p of ring) {
    if (p.lng < west) west = p.lng;
    if (p.lng > east) east = p.lng;
    if (p.lat < south) south = p.lat;
    if (p.lat > north) north = p.lat;
  }
  return { west, east, south, north };
}

function pointInRing(point, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const xi = ring[i].lng;
    const yi = ring[i].lat;
    const xj = ring[j].lng;
    const yj = ring[j].lat;
    const intersects = ((yi > point.lat) !== (yj > point.lat))
      && (point.lng < ((xj - xi) * (point.lat - yi)) / (yj - yi) + xi);
    if (intersects) inside = !inside;
  }
  return inside;
}

function pointInPolygon(point, outerRings, innerRings = []) {
  if (!outerRings.some((ring) => pointInRing(point, ring))) return false;
  return !innerRings.some((ring) => pointInRing(point, ring));
}

function scanlineInsideIntervals(y, outerRings, innerRings) {
  const crossingsAt = (rings) => {
    const xs = [];
    for (const ring of rings) {
      for (let i = 0; i < ring.length; i += 1) {
        const a = ring[i];
        const b = ring[(i + 1) % ring.length];
        if ((a.lat > y) === (b.lat > y)) continue;
        const t = (y - a.lat) / (b.lat - a.lat);
        xs.push(a.lng + t * (b.lng - a.lng));
      }
    }
    return xs.sort((left, right) => left - right);
  };

  const outerXs = crossingsAt(outerRings);
  let intervals = [];
  for (let i = 0; i + 1 < outerXs.length; i += 2) intervals.push([outerXs[i], outerXs[i + 1]]);
  if (!intervals.length || !innerRings.length) return intervals;

  const holeXs = crossingsAt(innerRings);
  const holeIntervals = [];
  for (let i = 0; i + 1 < holeXs.length; i += 2) holeIntervals.push([holeXs[i], holeXs[i + 1]]);
  for (const [holeStart, holeEnd] of holeIntervals) {
    const next = [];
    for (const [start, end] of intervals) {
      if (holeEnd <= start || holeStart >= end) { next.push([start, end]); continue; }
      if (holeStart > start) next.push([start, holeStart]);
      if (holeEnd < end) next.push([holeEnd, end]);
    }
    intervals = next;
  }
  return intervals;
}

/**
 * Returns a point guaranteed to sit inside the outer ring (minus any holes)
 * for simple polygons, falling back gracefully for degenerate input.
 */
export function polygonPointOnSurface({ outer, inner = [] } = {}) {
  const outerRings = (outer || []).filter((ring) => ring.length >= 3);
  if (!outerRings.length) return null;
  const innerRings = (inner || []).filter((ring) => ring.length >= 3);

  const biggest = outerRings.reduce(
    (best, ring) => (Math.abs(ringArea(ring)) > Math.abs(ringArea(best)) ? ring : best),
    outerRings[0],
  );

  const centroid = ringCentroid(biggest);
  if (pointInPolygon(centroid, [biggest], innerRings)) return centroid;

  const intervals = scanlineInsideIntervals(centroid.lat, [biggest], innerRings);
  if (intervals.length) {
    const longest = intervals.reduce(
      (best, interval) => ((interval[1] - interval[0]) > (best[1] - best[0]) ? interval : best),
      intervals[0],
    );
    return { lat: centroid.lat, lng: (longest[0] + longest[1]) / 2 };
  }

  const bounds = ringBounds(biggest);
  return { lat: (bounds.south + bounds.north) / 2, lng: (bounds.west + bounds.east) / 2 };
}

function haversineM(a, b) {
  const rad = (deg) => (deg * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const lat1 = rad(a.lat);
  const lat2 = rad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/** Midpoint by arc length along an (open) line — used for streets and transit routes. */
export function lineMidpoint(coords) {
  const points = (coords || []).filter((p) => Number.isFinite(p?.lat) && Number.isFinite(p?.lng));
  if (!points.length) return null;
  if (points.length === 1) return points[0];

  const lengths = [];
  let total = 0;
  for (let i = 0; i + 1 < points.length; i += 1) {
    const length = haversineM(points[i], points[i + 1]);
    lengths.push(length);
    total += length;
  }
  if (total <= 0) return points[Math.floor(points.length / 2)];

  let target = total / 2;
  for (let i = 0; i < lengths.length; i += 1) {
    if (target <= lengths[i]) {
      const t = lengths[i] === 0 ? 0 : target / lengths[i];
      const a = points[i];
      const b = points[i + 1];
      return { lat: a.lat + (b.lat - a.lat) * t, lng: a.lng + (b.lng - a.lng) * t };
    }
    target -= lengths[i];
  }
  return points[points.length - 1];
}

/**
 * Stitches way-member coordinate segments that share endpoints into closed
 * (or best-effort) rings/lines. Used to rebuild relation multipolygons and
 * route relations from Overpass `out geom` member geometries.
 */
export function assembleRings(segments) {
  const remaining = (segments || []).map((segment) => segment.slice()).filter((segment) => segment.length >= 2);
  const rings = [];
  const EPS = 1e-7;
  const sameNode = (a, b) => Math.abs(a.lat - b.lat) < EPS && Math.abs(a.lng - b.lng) < EPS;

  while (remaining.length) {
    let current = remaining.shift();
    let progressed = true;
    while (progressed && !sameNode(current[0], current[current.length - 1])) {
      progressed = false;
      for (let i = 0; i < remaining.length; i += 1) {
        const segment = remaining[i];
        if (sameNode(current[current.length - 1], segment[0])) {
          current = current.concat(segment.slice(1));
        } else if (sameNode(current[current.length - 1], segment[segment.length - 1])) {
          current = current.concat(segment.slice(0, -1).reverse());
        } else if (sameNode(current[0], segment[segment.length - 1])) {
          current = segment.slice(0, -1).concat(current);
        } else if (sameNode(current[0], segment[0])) {
          current = segment.slice(1).reverse().concat(current);
        } else {
          continue;
        }
        remaining.splice(i, 1);
        progressed = true;
        break;
      }
    }
    rings.push(current);
  }
  return rings;
}
