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
  osmArea('takhtapul', 'Takhtapul', 'uz:tashkent:almazar', 41.33968, 69.26428, 'node', 9687947537, 550),
  osmArea('chimbay', 'Chimbay', 'uz:tashkent:almazar', 41.36257, 69.20025, 'node', 1866058485, 650),
  osmArea('yalangach', 'Yalangach', 'uz:tashkent:mirzo-ulugbek', 41.35013, 69.34254, 'node', 1867002807, 800),
  osmArea('feruza', 'Feruza', 'uz:tashkent:mirzo-ulugbek', 41.35561, 69.36388, 'node', 10938027477, 750),
  osmArea('tashgres', 'TashGRES', 'uz:tashkent:yunusabad', 41.35547, 69.33673, 'node', 1866983396, 700),
  osmArea('beshagach', 'Beshagach', 'uz:tashkent:shaykhantahur', 41.30476, 69.25076, 'node', 11559407267, 650),
  osmArea('beltepa', 'Beltepa', 'uz:tashkent:shaykhantahur', 41.34614, 69.17206, 'way', 149989887, 700),
  osmArea('medgorodok', 'Medgorodok', 'uz:tashkent:almazar', 41.35527, 69.17428, 'node', 10704411976, 700),
  osmArea('olympia', 'Olympia', 'uz:tashkent:almazar', 41.36188, 69.19401, 'node', 1866058437, 700),
  osmArea('dustlik-1', 'Dustlik-1', 'uz:tashkent:yangihayot', 41.19324, 69.21269, 'way', 169301463, 650),
  osmArea('dustlik-2', 'Dustlik-2', 'uz:tashkent:yangihayot', 41.19341, 69.20803, 'node', 2206297964, 650),
  osmArea('vuzgorodok', 'Vuzgorodok', 'uz:tashkent:almazar', 41.35155, 69.20564, 'node', 1866061222, 650),
  osmArea('hospitalny', 'Hospitalny', 'uz:tashkent:mirobod', 41.29375, 69.27413, 'node', 3907644432, 550),
]);
