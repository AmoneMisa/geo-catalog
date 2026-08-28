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

export const TASHKENT_VERIFIED_AREA_ENTITIES = Object.freeze([
  osmArea('takhtapul', 'Takhtapul', 'uz:tashkent:shaykhantahur', 41.339682, 69.2642825, 'node', 9687947537, 550),
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
