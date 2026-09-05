import { TASHKENT_NAMED_MICRODISTRICT_BOUNDARIES } from './microdistrict-boundaries.js';

const osmMicrodistrict = (slug, canonicalName, parentId, lat, lng, osmType, osmId, accuracyM = 800) => ({
  id: `uz:tashkent:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UZ',
  canonicalName,
  parentId,
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

const manualMicrodistrict = (slug, canonicalName, parentId, lat, lng, accuracyM = 1800) => ({
  id: `uz:tashkent:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UZ',
  canonicalName,
  parentId,
  center: { lat, lng },
  source: 'manual',
  accuracy: 'approximate',
  accuracyM,
});

const boundaryMicrodistrict = (slug, boundarySlug, canonicalName, parentId, accuracyM = 650) => {
  const { relId, center, geometry } = TASHKENT_NAMED_MICRODISTRICT_BOUNDARIES[boundarySlug];
  return {
    id: `uz:tashkent:microdistrict:${slug}`,
    type: 'microdistrict',
    country: 'UZ',
    canonicalName,
    parentId,
    center,
    source: 'osm',
    accuracy: 'neighborhood',
    accuracyM,
    osm: { type: 'relation', id: relId },
    boundary: geometry,
  };
};

export const TASHKENT_NAMED_MICRODISTRICT_ENTITIES = Object.freeze([
  osmMicrodistrict('tashselmash', 'Tashselmash', 'uz:tashkent:yashnobod', 41.30804, 69.30694, 'node', 4750099124, 800),
  osmMicrodistrict('aviasozlar', 'Aviasozlar', 'uz:tashkent:yashnobod', 41.30222, 69.31107, 'node', 1867099580, 850),
  osmMicrodistrict('kuylyuk', 'Kuylyuk', 'uz:tashkent:sergeli', 41.2485954, 69.3009584, 'node', 10122671692, 1300),
  osmMicrodistrict('yangi-choshtepa', 'Yangi Choshtepa', 'uz:tashkent:yangihayot', 41.23265, 69.19364, 'node', 11548947032, 850),

  osmMicrodistrict('olympia', 'Olympia', 'uz:tashkent:almazar', 41.36188, 69.19401, 'node', 1866058437, 700),
  osmMicrodistrict('dustlik-1', 'Dustlik-1', 'uz:tashkent:yangihayot', 41.19324, 69.21269, 'way', 169301463, 650),
  osmMicrodistrict('dustlik-2', 'Dustlik-2', 'uz:tashkent:yangihayot', 41.19341, 69.20803, 'node', 2206297964, 650),
  // Representative centroid from verified numbered Yo'ldosh/Sputnik mavze points.
  manualMicrodistrict('sputnik', 'Sputnik', 'uz:tashkent:yangihayot', 41.198542, 69.218634, 2200),

  osmMicrodistrict('karasu-1', 'Karasu-1', 'uz:tashkent:mirzo-ulugbek', 41.33717, 69.37403, 'node', 1868229636, 650),
  osmMicrodistrict('karasu-2', 'Karasu-2', 'uz:tashkent:mirzo-ulugbek', 41.33194, 69.36380, 'node', 1868229637, 650),
  osmMicrodistrict('karasu-3', 'Karasu-3', 'uz:tashkent:mirzo-ulugbek', 41.33252, 69.36891, 'node', 1868229638, 650),
  osmMicrodistrict('karasu-4', 'Karasu-4', 'uz:tashkent:mirzo-ulugbek', 41.33160, 69.37323, 'node', 1868229639, 650),
  osmMicrodistrict('karasu-6', 'Karasu-6', 'uz:tashkent:mirzo-ulugbek', 41.31961, 69.35460, 'node', 1868229640, 650),
  boundaryMicrodistrict('ttz-1', 'traktorsozlar-1', 'Traktorsozlar-1', 'uz:tashkent:mirzo-ulugbek'),
  boundaryMicrodistrict('ttz-2', 'traktorsozlar-2', 'Traktorsozlar-2', 'uz:tashkent:mirzo-ulugbek'),
  // Representative center around the TTZ cultural/transport hub. No OSM object is claimed for the massif itself.
  manualMicrodistrict('ttz-3', 'TTZ-3', 'uz:tashkent:mirzo-ulugbek', 41.3537, 69.3831, 900),
  boundaryMicrodistrict('ttz-4', 'traktorsozlar-4', 'Traktorsozlar-4', 'uz:tashkent:mirzo-ulugbek', 620),
  boundaryMicrodistrict('qiyot', 'qiyot', 'Qiyot', 'uz:tashkent:yunusabad', 600),

  osmMicrodistrict('sergeli-3a', 'Sergeli-3A', 'uz:tashkent:yangihayot', 41.21801, 69.20280, 'node', 9672641058, 520),
  osmMicrodistrict('sergeli-5a', 'Sergeli-5A', 'uz:tashkent:yangihayot', 41.22330, 69.20291, 'node', 6602145049, 520),
  osmMicrodistrict('sergeli-7a', 'Sergeli-7A', 'uz:tashkent:yangihayot', 41.21670, 69.20923, 'node', 7485070799, 520),
]);
