const mahalla = (slug, canonicalName, parentId, lat, lng, osmType, osmId, accuracyM = 420) => ({
  id: `uz:tashkent:mahalla:${slug}`,
  type: 'mahalla',
  country: 'UZ',
  canonicalName,
  parentId,
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

export const TASHKENT_MAHALLA_ENTITIES = Object.freeze([
  mahalla('khastimam', 'Khastimam', 'uz:tashkent:almazar', 41.33303, 69.24287, 'way', 1137236407, 420),
  mahalla('yangi-tashkent', 'Yangi Tashkent', 'uz:tashkent:almazar', 41.36743, 69.22415, 'node', 1866058486, 520),
  mahalla('umid', 'Umid', 'uz:tashkent:almazar', 41.36899, 69.21901, 'way', 1137777682, 520),
  mahalla('kashgar', 'Kashgar', 'uz:tashkent:yunusabad', 41.31619, 69.27087, 'way', 1006384228, 420),
  mahalla('buyuk-turan', 'Buyuk Turan', 'uz:tashkent:yunusabad', 41.32097, 69.28708, 'way', 1008828995, 460),
  mahalla('minor', 'Minor', 'uz:tashkent:yunusabad', 41.33725, 69.27972, 'way', 1012743631, 460),
  mahalla('labzak', 'Labzak', 'uz:tashkent:shaykhantahur', 41.33221, 69.26828, 'node', 11185280560, 420),
  mahalla('rakat', 'Rakat', 'uz:tashkent:yakkasaray', 41.28337, 69.24247, 'node', 5267423765, 380),
  mahalla('belaryk', 'Belaryk', 'uz:tashkent:yakkasaray', 41.29013, 69.24338, 'way', 1078174899, 420),
  mahalla('shahjahan', 'Shahjahan', 'uz:tashkent:yakkasaray', 41.28542, 69.24894, 'way', 1078458314, 420),
  mahalla('mukimiy', 'Mukimiy', 'uz:tashkent:yakkasaray', 41.27945, 69.23655, 'node', 1869638304, 380),
  mahalla('birlashgan', 'Birlashgan', 'uz:tashkent:yashnobod', 41.29138, 69.35184, 'node', 12253307757, 380),
  mahalla('nadyra', 'Nadyra', 'uz:tashkent:yashnobod', 41.27749, 69.35085, 'node', 12154016425, 380),
  mahalla('makhmur', 'Makhmur', 'uz:tashkent:yashnobod', 41.28905, 69.33510, 'node', 12144738031, 380),
]);
