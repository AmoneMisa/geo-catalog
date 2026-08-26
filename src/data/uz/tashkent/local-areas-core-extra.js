const localArea = (slug, canonicalName, parentId, lat, lng, osmType, osmId, accuracyM = 320) => ({
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

export const TASHKENT_CORE_EXTRA_LOCAL_AREA_ENTITIES = Object.freeze([
  localArea('hadra', 'Khadra', 'uz:tashkent:shaykhantahur', 41.32409, 69.24911, 'node', 1868488533, 280),
  localArea('jangoh', 'Jangoh', 'uz:tashkent:shaykhantahur', 41.32882, 69.25248, 'node', 1866901280, 280),
  localArea('karatash', 'Karatash', 'uz:tashkent:shaykhantahur', 41.31722, 69.23683, 'node', 4706446883, 320),
  localArea('kashgar', 'Kashgar', 'uz:tashkent:yunusabad', 41.32022, 69.27649, 'node', 1866932729, 320),
  localArea('kiyot', 'Kiyot', 'uz:tashkent:yunusabad', 41.32538, 69.27791, 'node', 4778058865, 320),
  localArea('minor', 'Minor', 'uz:tashkent:yunusabad', 41.33725, 69.27972, 'way', 1012743631, 360),
  localArea('alay', 'Alay', 'uz:tashkent:mirzo-ulugbek', 41.31732, 69.28738, 'node', 1866932727, 300),
  localArea('bashlyk', 'Bashlyk', 'uz:tashkent:yakkasaray', 41.26974, 69.25247, 'node', 1865344348, 360),
  localArea('kushbegi', 'Kushbegi', 'uz:tashkent:yakkasaray', 41.26763, 69.24132, 'way', 1117398513, 420),
]);
