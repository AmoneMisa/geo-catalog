import { isValidCoordinate } from './spatial.js';

const ENTITY_TYPES = new Set([
  'country', 'region', 'city', 'district', 'microdistrict', 'mahalla', 'local_area', 'suburb',
  'settlement', 'street', 'address', 'residential_complex', 'metro', 'poi'
]);

const SOURCES = new Set(['osm', 'wikidata', 'official', 'manual']);
const ACCURACY = new Set(['country', 'region', 'city', 'district', 'neighborhood', 'street', 'building', 'poi', 'entrance', 'approximate']);

export function validateGeoCatalog(entities) {
  const errors = [];
  const ids = new Set();
  const lookupKeys = new Set();

  for (const entity of entities) {
    if (!entity?.id || typeof entity.id !== 'string') errors.push('Entity without a valid id');
    else if (ids.has(entity.id)) errors.push(`Duplicate id: ${entity.id}`);
    else ids.add(entity.id);

    if (entity.lookupKey) {
      if (typeof entity.lookupKey !== 'string') errors.push(`${entity.id}: lookupKey must be a string`);
      else if (lookupKeys.has(entity.lookupKey)) errors.push(`${entity.id}: duplicate lookupKey ${entity.lookupKey}`);
      else lookupKeys.add(entity.lookupKey);
    }

    if (!ENTITY_TYPES.has(entity.type)) errors.push(`${entity.id}: unsupported type ${entity.type}`);
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
  }

  for (const entity of entities) {
    if (entity.parentId && !ids.has(entity.parentId)) errors.push(`${entity.id}: unknown parentId ${entity.parentId}`);
  }

  return { valid: errors.length === 0, errors };
}
