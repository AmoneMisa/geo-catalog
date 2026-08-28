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
  return Array.isArray(a) && Array.isArray(b) && a.length === 2 && b.length === 2 && a[0] === b[0] && a[1] === b[1];
}

function validatePosition(position, path, errors) {
  if (!Array.isArray(position) || position.length !== 2) {
    errors.push(`${path}: position must be [lng, lat]`);
    return;
  }

  const [lng, lat] = position;
  if (!Number.isFinite(lng) || lng < -180 || lng > 180) errors.push(`${path}: longitude out of range`);
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) errors.push(`${path}: latitude out of range`);
}

function validateLinearRing(ring, path, errors) {
  if (!Array.isArray(ring)) {
    errors.push(`${path}: linear ring must be an array`);
    return;
  }

  if (ring.length < 4) errors.push(`${path}: linear ring must contain at least 4 positions`);
  ring.forEach((position, index) => validatePosition(position, `${path}[${index}]`, errors));

  if (ring.length > 0 && !positionsEqual(ring[0], ring[ring.length - 1])) {
    errors.push(`${path}: linear ring must be closed`);
  }
}

function validatePolygonCoordinates(coordinates, path, errors) {
  if (!Array.isArray(coordinates) || coordinates.length === 0) {
    errors.push(`${path}: polygon must contain at least one linear ring`);
    return;
  }

  coordinates.forEach((ring, index) => validateLinearRing(ring, `${path}[${index}]`, errors));
}

function validateBoundary(boundary, entityId, errors) {
  if (boundary === undefined) return;

  const path = `${entityId}: boundary`;
  if (!boundary || typeof boundary !== 'object' || Array.isArray(boundary)) {
    errors.push(`${path} must be a GeoJSON geometry object`);
    return;
  }

  if (boundary.type !== 'Polygon' && boundary.type !== 'MultiPolygon') {
    errors.push(`${path}.type must be Polygon or MultiPolygon`);
    return;
  }

  if (!Array.isArray(boundary.coordinates)) {
    errors.push(`${path}.coordinates must be an array`);
    return;
  }

  if (boundary.type === 'Polygon') {
    validatePolygonCoordinates(boundary.coordinates, `${path}.coordinates`, errors);
    return;
  }

  if (boundary.coordinates.length === 0) {
    errors.push(`${path}.coordinates: MultiPolygon must contain at least one polygon`);
    return;
  }

  boundary.coordinates.forEach((polygon, index) => {
    validatePolygonCoordinates(polygon, `${path}.coordinates[${index}]`, errors);
  });
}

export function validateGeoCatalog(entities) {
  const errors = [];
  const ids = new Set();
  const lookupKeys = new Set();
  const semanticKeys = new Map();
  const osmOwners = new Map();

  for (const entity of entities) {
    if (!entity?.id || typeof entity.id !== 'string') errors.push('Entity without a valid id');
    else if (ids.has(entity.id)) errors.push(`Duplicate id: ${entity.id}`);
    else ids.add(entity.id);

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

    validateBoundary(entity.boundary, entity.id, errors);

    if (entity.osm && (!['node', 'way', 'relation'].includes(entity.osm.type) || !Number.isInteger(entity.osm.id) || entity.osm.id <= 0)) {
      errors.push(`${entity.id}: invalid OSM metadata`);
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
  }

  return { valid: errors.length === 0, errors };
}
