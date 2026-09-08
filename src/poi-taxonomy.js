const CATEGORY_BY_SUBTYPE = Object.freeze({
  university: 'education', college: 'education', school: 'education', kindergarten: 'education', madrasa: 'education',
  hospital: 'healthcare', clinic: 'healthcare', medical_center: 'healthcare', sanatorium: 'healthcare',
  airport: 'transport', airport_terminal: 'transport', railway_station: 'transport', railway_halt: 'transport',
  bus_station: 'transport', transport_hub: 'transport',
  parking: 'parking', parking_structure: 'parking', park_and_ride: 'parking',
  shopping_mall: 'retail', market: 'retail', supermarket: 'retail', hardware_store: 'retail',
  park: 'recreation', recreation_area: 'recreation', beach: 'recreation', botanical_garden: 'recreation', amusement_park: 'recreation',
});

export const GEO_POI_CATEGORIES = Object.freeze([...new Set(Object.values(CATEGORY_BY_SUBTYPE))]);
export const GEO_POI_SUBTYPES = Object.freeze(Object.keys(CATEGORY_BY_SUBTYPE));

/** Returns a derived category so entity records do not duplicate taxonomy data. */
export function geoPoiCategory(type) {
  if (typeof type !== 'string' || !type.startsWith('poi.')) return null;
  return CATEGORY_BY_SUBTYPE[type.slice(4)] ?? 'other';
}
