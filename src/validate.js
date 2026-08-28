import { isValidCoordinate } from './spatial.js';

const ENTITY_TYPES = new Set([
  'country', 'region', 'city', 'district', 'microdistrict', 'mahalla', 'local_area', 'suburb',
  'settlement', 'street', 'address', 'residential_complex', 'metro', 'poi', 'development_area',
]);

const POI_TYPES = new Set([
  'park', 'recreation_area', 'island', 'square', 'street', 'landmark', 'monument', 'fortress',
  'embankment', 'lake', 'cathedral', 'stadium', 'cultural_venue', 'exhibition_center', 'zoo',
  'shopping_mall', 'market', 'beach', 'memorial', 'university', 'botanical_garden',
]);

const SOURCES = new Set(['osm', 'wikidata', 'official', 'manual', 'geonames']);
const ACCURACY = new Set(['country', 'region', 'city', 'district', 'neighborhood', 'street', 'building', 'poi', 'entrance', 'approximate']);

function isSupportedEntityType(type) {
  if (ENTITY_TYPES.has(type)) return true;
  if (typeof type !== 'string' || !type.startsWith('poi.')) return false;
  return POI_TYPES.has(type.slice(4));
}

function semanticKey(entity) {
  if (!entity?.canonicalName || !entity?.type || !entity?.country) return null;
  return [
    entity.country,
    entity.parentId ?? '',
    entity.type,
    entity.canonicalName.normalize('NFKC').trim().toLocaleLowerCase(),
  ].join('|');
}

function osmKey(entity) {
  if (!entity?.osm || !['node', 'way', 'relation'].includes(entity.osm.type) || !Number.isInteger(entity.osm.id) || entity.osm.id <= 0) return null;
  return `${entity.osm.type}:${entity.osm.id}`;
}

function positionsEqual(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

function isValidPosition(position) {
  return Array.isArray(position)
    && position.length === 2
    && position.every(Number.isFinite)
    && Math.abs(position[0]) <= 180
    && Math.abs(position[1]) <= 90;
}

function ringArea(ring) {
  let twiceArea = 0;
  for (let index = 1; index < ring.length; index += 1) {
    twiceArea += ring[index - 1][0] * ring[index][1] - ring[index][0] * ring[index - 1][1];
  }
  return twiceArea / 2;
}

function isValidLinearRing(ring) {
  return Array.isArray(ring)
    && ring.length >= 4
    && ring.every(isValidPosition)
    && positionsEqual(ring[0], ring.at(-1))
    && ringArea(ring) !== 0;
}

function isValidPolygonCoordinates(coordinates) {
  return Array.isArray(coordinates) && coordinates.length > 0 && coordinates.every(isValidLinearRing);
}

function pointOnSegment([lng, lat], a, b) {
  const cross = (lat - a[1]) * (b[0] - a[0]) - (lng - a[0]) * (b[1] - a[1]);
  if (Math.abs(cross) > 1e-10) return false;
  return lng >= Math.min(a[0], b[0]) && lng <= Math.max(a[0], b[0])
    && lat >= Math.min(a[1], b[1]) && lat <= Math.max(a[1], b[1]);
}

function pointInRing(position, ring) {
  let inside = false;
  for (let index = 0, previous = ring.length - 1; index < ring.length; previous = index, index += 1) {
    const a = ring[previous];
    const b = ring[index];
    if (pointOnSegment(position, a, b)) return true;
    if ((a[1] > position[1]) !== (b[1] > position[1])
      && position[0] < ((b[0] - a[0]) * (position[1] - a[1])) / (b[1] - a[1]) + a[0]) {
      inside = !inside;
    }
  }
  return inside;
}

function pointInPolygon(position, polygon) {
  return pointInRing(position, polygon[0]) && !polygon.slice(1).some((hole) => pointInRing(position, hole));
}

function boundaryContainsCenter(boundary, center) {
  const position = [center.lng, center.lat];
  const polygons = boundary.type === 'Polygon' ? [boundary.coordinates] : boundary.coordinates;
  return polygons.some((polygon) => pointInPolygon(position, polygon));
}

export function validateGeoCatalog(entities) {
  const errors = [];
  const ids = new Set();
  const entitiesById = new Map();
  const lookupKeys = new Set();
  const semanticKeys = new Map();
  const osmOwners = new Map();

  for (const entity of entities) {
    if (!entity?.id || typeof entity.id !== 'string') errors.push('Entity without a valid id');
    else if (ids.has(entity.id)) errors.push(`Duplicate id: ${entity.id}`);
    else {
      ids.add(entity.id);
      entitiesById.set(entity.id, entity);
    }

    if (entity.lookupKey) {
      if (typeof entity.lookupKey !== 'string') errors.push(`${entity.id}: lookupKey must be a string`);
      else if (lookupKeys.has(entity.lookupKey)) errors.push(`${entity.id}: duplicate lookupKey ${entity.lookupKey}`);
      else lookupKeys.add(entity.lookupKey);
    }

    const key = semanticKey(entity);
    if (key) {
      const existingId = semanticKeys.get(key);
      if (existingId && existingId !== entity.id) errors.push(`${entity.id}: duplicate semantic entity ${key} (already ${existingId})`);
      else semanticKeys.set(key, entity.id);
    }

    if (!isSupportedEntityType(entity.type)) errors.push(`${entity.id}: unsupported type ${entity.type}`);
    if (!/^[A-Z]{2}$/.test(entity.country ?? '')) errors.push(`${entity.id}: country must be ISO 3166-1 alpha-2`);
    if (!entity.canonicalName) errors.push(`${entity.id}: canonicalName is required`);
    if (!isValidCoordinate(entity.center)) errors.push(`${entity.id}: invalid center`);
    if (entity.source && !SOURCES.has(entity.source)) errors.push(`${entity.id}: unsupported source ${entity.source}`);
    if (entity.accuracy && !ACCURACY.has(entity.accuracy)) errors.push(`${entity.id}: unsupported accuracy ${entity.accuracy}`);
    if (entity.wikidataId && !/^Q\d+$/.test(entity.wikidataId)) errors.push(`${entity.id}: invalid Wikidata id`);

    if (entity.bbox) {
      const { south, west, north, east } = entity.bbox;
      if (![south, west, north, east].every(Number.isFinite) || south > north || west > east || south < -90 || north > 90 || west < -180 || east > 180) {
        errors.push(`${entity.id}: invalid bbox`);
      } else if (isValidCoordinate(entity.center) && !(entity.center.lat >= south && entity.center.lat <= north && entity.center.lng >= west && entity.center.lng <= east)) {
        errors.push(`${entity.id}: center must be inside bbox`);
      }
    }

    if (entity.osm && (!['node', 'way', 'relation'].includes(entity.osm.type) || !Number.isInteger(entity.osm.id) || entity.osm.id <= 0)) {
      errors.push(`${entity.id}: invalid OSM metadata`);
    }

    if (entity.boundary !== undefined) {
      const { type, coordinates } = entity.boundary ?? {};
      const isPolygon = type === 'Polygon' && isValidPolygonCoordinates(coordinates);
      const isMultiPolygon = type === 'MultiPolygon'
        && Array.isArray(coordinates)
        && coordinates.length > 0
        && coordinates.every(isValidPolygonCoordinates);
      if (!isPolygon && !isMultiPolygon) errors.push(`${entity.id}: boundary must be a GeoJSON Polygon or MultiPolygon`);
      else if (isValidCoordinate(entity.center) && !boundaryContainsCenter(entity.boundary, entity.center)) {
        errors.push(`${entity.id}: center must be inside boundary`);
      }
    }

    const physicalKey = osmKey(entity);
    if (physicalKey) {
      const existingId = osmOwners.get(physicalKey);
      if (existingId && existingId !== entity.id) errors.push(`${entity.id}: duplicate physical OSM entity ${physicalKey} (already ${existingId})`);
      else osmOwners.set(physicalKey, entity.id);
    }
  }

  for (const entity of entities) {
    if (entity.parentId && !ids.has(entity.parentId)) errors.push(`${entity.id}: unknown parentId ${entity.parentId}`);
    const parent = entitiesById.get(entity.parentId);
    if (parent?.boundary && isValidCoordinate(entity.center) && !boundaryContainsCenter(parent.boundary, entity.center)) {
      errors.push(`${entity.id}: center must be inside parent boundary ${entity.parentId}`);
    }
  }

  return { valid: errors.length === 0, errors };
}
