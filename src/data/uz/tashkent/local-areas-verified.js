import { TASHKENT_LOCAL_AREA_BOUNDARIES } from './local-area-boundaries.js';

const osmArea = (slug, canonicalName, parentId, lat, lng, osmType, osmId, accuracyM = 650) => ({
  id: `uz:tashkent:local-area:${slug}`,
  type: 'local_area',
  country: 'UZ',
  canonicalName,
  parentId,
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

const derivedArea = (slug, canonicalName, parentId, lat, lng, accuracyM) => ({
  id: `uz:tashkent:local-area:${slug}`,
  type: 'local_area',
  country: 'UZ',
  canonicalName,
  parentId,
  center: { lat, lng },
  source: 'manual',
  accuracy: 'approximate',
  accuracyM,
});

const boundaryArea = (slug, canonicalName, parentId, accuracyM = 650) => {
  const { osmType, osmId, center, geometry } = TASHKENT_LOCAL_AREA_BOUNDARIES[slug];
  return {
    id: `uz:tashkent:local-area:${slug}`,
    type: 'local_area',
    country: 'UZ',
    canonicalName,
    parentId,
    center,
    source: 'osm',
    accuracy: 'neighborhood',
    accuracyM,
    osm: { type: osmType, id: osmId },
    boundary: geometry,
  };
};

export const TASHKENT_VERIFIED_AREA_ENTITIES = Object.freeze([
  // User-supplied point reverse-geocoded to Al-Horazmiy 1 dahasi in Chilonzor Tumani.
  derivedArea('al-khorezmi-1', 'Al-Khorezmi-1', 'uz:tashkent:chilanzar', 41.259301, 69.154431, 650),
  boundaryArea('chorsu', 'Chorsu', 'uz:tashkent:shaykhantahur', 550),
  // Midpoint of the verified Russian Embassy stops and Mirobod bazaar relation.
  derivedArea('dehqonobod', 'Dehqonobod', 'uz:tashkent:mirobod', 41.2889708, 69.2731022, 750),
  // University-area usage centered on the verified Geology Sciences University campus.
  // The separate same-name residential polygon in Yashnobod is not this lexical area.
  derivedArea('geofizika', 'Geofizika', 'uz:tashkent:mirzo-ulugbek', 41.3413252, 69.3403061, 1000),
  // User-verified Qo'yliq markaz residential-area center near the Yashnobod/Bektemir border.
  derivedArea('kuylyuk-center', 'Kuylyuk Center', 'uz:tashkent:yashnobod', 41.240623, 69.332279, 750),
  // User-supplied point on Lolazor Street inside Bog'ichinor Mahallah.
  derivedArea('lolazor', 'Lolazor', 'uz:tashkent:uchtepa', 41.325387, 69.176835, 500),
  // Address anchor on Oltinko'l Passage 1 inside the Karasu mahallah.
  derivedArea('oltinkul', 'Oltinkul', 'uz:tashkent:mirobod', 41.2665, 69.298745, 650),
  // Representative center for the residential area around Shohimardon Street.
  derivedArea('shohimardon', 'Shohimardon', 'uz:tashkent:yashnobod', 41.2736, 69.3522, 750),
  // OSM locality retains the area's historical Maksim Gorkiy name; distinct from the metro station.
  osmArea('buyuk-ipak-yuli', 'Buyuk Ipak Yuli', 'uz:tashkent:mirzo-ulugbek', 41.3263381, 69.3256346, 'node', 5267587643, 900),
  osmArea('chimbay', 'Chimbay', 'uz:tashkent:almazar', 41.36257, 69.20025, 'node', 1866058485, 650),
  osmArea('yalangach', 'Yalangach', 'uz:tashkent:mirzo-ulugbek', 41.35013, 69.34254, 'node', 1867002807, 800),
  osmArea('feruza', 'Feruza', 'uz:tashkent:mirzo-ulugbek', 41.35561, 69.36388, 'node', 10938027477, 750),
  osmArea('tashgres', 'TashGRES', 'uz:tashkent:yunusabad', 41.35547, 69.33673, 'node', 1866983396, 700),
  osmArea('beshagach', 'Beshagach', 'uz:tashkent:chilanzar', 41.3047615, 69.2507561, 'node', 11559407267, 650),
  osmArea('beltepa', 'Beltepa', 'uz:tashkent:shaykhantahur', 41.3459531, 69.1724087, 'way', 149989887, 700),
  osmArea('medgorodok', 'Medgorodok', 'uz:tashkent:almazar', 41.35527, 69.17428, 'node', 10704411976, 700),
  osmArea('vuzgorodok', 'Vuzgorodok', 'uz:tashkent:almazar', 41.35155, 69.20564, 'node', 1866061222, 650),
  osmArea('hospitalny', 'Hospitalny', 'uz:tashkent:mirobod', 41.29375, 69.27413, 'node', 3907644432, 550),
  osmArea('movarounnahr', 'Movarounnahr', 'uz:tashkent:mirobod', 41.29999, 69.28658, 'way', 1057801683, 520),
  osmArea('nakkoshlik', 'Nakkoshlik', 'uz:tashkent:chilanzar', 41.2674213, 69.202444, 'way', 1180079691, 520),
  osmArea('alimkent', 'Alimkent', 'uz:tashkent:yashnobod', 41.29546, 69.33720, 'node', 12144738032, 520),
]);
