const area = (slug, canonicalName, parentDistrict, lat, lng, osmType, osmId, accuracyM = 450) => ({
  id: `kz:almaty:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'KZ',
  canonicalName,
  parentId: `kz:almaty:${parentDistrict}`,
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

export const ALMATY_CORE_MICRODISTRICT_ENTITIES = Object.freeze([
  area('samal-1', 'Samal-1', 'medeu', 43.23599, 76.95375, 'way', 444483691),
  area('samal-2', 'Samal-2', 'medeu', 43.23132, 76.95496, 'way', 439077639),
  area('samal-3', 'Samal-3', 'medeu', 43.22647, 76.95599, 'way', 908471882),
  area('orbita-1', 'Orbita-1', 'bostandyk', 43.20104, 76.88309, 'way', 265600414),
  area('orbita-2', 'Orbita-2', 'bostandyk', 43.19723, 76.88433, 'way', 1085112698),
  area('orbita-4', 'Orbita-4', 'bostandyk', 43.19662, 76.87672, 'way', 265600413),
  area('koktem', 'Koktem', 'bostandyk', 43.22982, 76.92172, 'node', 9933338257, 650),
  area('koktem-1', 'Koktem-1', 'bostandyk', 43.23090, 76.92637, 'way', 445143934),
  area('koktem-2', 'Koktem-2', 'bostandyk', 43.22923, 76.91976, 'way', 908429661),
  area('koktem-3', 'Koktem-3', 'bostandyk', 43.23411, 76.91738, 'way', 908432536),
]);
