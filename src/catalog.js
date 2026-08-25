const entities = [
  {
    id: 'uz:tashkent', type: 'city', country: 'UZ', canonicalName: 'Tashkent',
    center: { lat: 41.2995, lng: 69.2401 },
    bbox: { south: 41.1666, west: 69.1282, north: 41.3988, east: 69.4122 },
    source: 'osm', accuracy: 'city'
  },
  {
    id: 'uz:samarkand', type: 'city', country: 'UZ', canonicalName: 'Samarkand',
    center: { lat: 39.6542, lng: 66.9597 }, source: 'osm', accuracy: 'city'
  },
  {
    id: 'kz:almaty', type: 'city', country: 'KZ', canonicalName: 'Almaty',
    center: { lat: 43.2389, lng: 76.8897 }, source: 'osm', accuracy: 'city'
  },
  {
    id: 'kz:astana', type: 'city', country: 'KZ', canonicalName: 'Astana',
    center: { lat: 51.1694, lng: 71.4491 }, source: 'osm', accuracy: 'city'
  },
  {
    id: 'ua:kyiv', type: 'city', country: 'UA', canonicalName: 'Kyiv',
    center: { lat: 50.4501, lng: 30.5234 }, source: 'osm', accuracy: 'city'
  },
  {
    id: 'ua:odesa', type: 'city', country: 'UA', canonicalName: 'Odesa',
    center: { lat: 46.4825, lng: 30.7233 }, source: 'osm', accuracy: 'city'
  },
  {
    id: 'ua:kharkiv', type: 'city', country: 'UA', canonicalName: 'Kharkiv',
    center: { lat: 49.9935, lng: 36.2304 }, source: 'osm', accuracy: 'city'
  }
];

export const GEO_ENTITIES = Object.freeze(entities.map((entity) => Object.freeze({
  ...entity,
  center: Object.freeze({ ...entity.center }),
  ...(entity.bbox ? { bbox: Object.freeze({ ...entity.bbox }) } : {}),
  ...(entity.osm ? { osm: Object.freeze({ ...entity.osm }) } : {})
})));

const byId = new Map(GEO_ENTITIES.map((entity) => [entity.id, entity]));

export function getGeoEntity(id) {
  return byId.get(id) ?? null;
}

export function hasGeoEntity(id) {
  return byId.has(id);
}

export function findGeoEntities(filters = {}) {
  const { country, type, parentId } = filters;
  return GEO_ENTITIES.filter((entity) =>
    (!country || entity.country === country) &&
    (!type || entity.type === type) &&
    (parentId === undefined || entity.parentId === parentId)
  );
}

export function getGeoChildren(parentId) {
  return findGeoEntities({ parentId });
}
