const osmMicrodistrict = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 500) => ({
  id: `kz:aktau:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'KZ',
  canonicalName,
  parentId: 'kz:aktau',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

const osmPoi = (slug, canonicalName, type, lat, lng, osmType, osmId, accuracyM = 140) => ({
  id: `kz:aktau:poi:${slug}`,
  type,
  country: 'KZ',
  canonicalName,
  parentId: 'kz:aktau',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

export const KZ_AKTAU_ANCHORS = Object.freeze([
  // Prefer the explicit OSM neighbourhood objects over similarly named
  // service/residential ways returned earlier by Nominatim.
  osmMicrodistrict('1', '1 microdistrict', 43.6312032, 51.1822583, 'way', 327570454, 480),
  osmMicrodistrict('2', '2 microdistrict', 43.6393501, 51.1687659, 'way', 231187787, 480),
  osmMicrodistrict('3', '3 microdistrict', 43.6377254, 51.1798622, 'way', 327570293, 480),

  // Direct OSM POIs from the same enrichment report. TRK Aktau is the
  // physical owner also surfaced by the lexical alias “Aktau Mall”.
  osmPoi('trk-aktau', 'TRK Aktau', 'poi.shopping_mall', 43.6673099, 51.1526431, 'way', 326728530, 150),
  osmPoi('halyk-arena', 'Halyk Arena', 'poi', 43.6746333, 51.1397054, 'way', 798221754, 150),
  osmPoi('botanical-garden', 'Botanical Garden', 'poi.botanical_garden', 43.6511351, 51.1607491, 'way', 416714261, 180),
]);
