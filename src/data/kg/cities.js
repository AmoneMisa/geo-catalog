const city = (id, canonicalName, lat, lng, sourceUrl, accuracyM = 10000, osm = null) => Object.freeze({
  id,
  type: 'city',
  country: 'KG',
  canonicalName,
  center: Object.freeze({ lat, lng }),
  source: 'geonames',
  sourceUrl,
  accuracy: 'city',
  accuracyM,
  ...(osm ? { osm: Object.freeze(osm) } : {}),
});

const geonames = (name) => `https://www.geonames.org/advanced-search.html?country=KG&q=${encodeURIComponent(name)}`;

export const KG_CITY_ENTITIES = Object.freeze([
  city('kg:bishkek', 'Bishkek', 42.87, 74.59, geonames('Bishkek')),
  city('kg:osh', 'Osh', 40.53, 72.80, geonames('Osh')),
  city('kg:jalal-abad', 'Jalal-Abad', 40.93, 73.00, geonames('Jalal-Abad')),
  city('kg:karakol', 'Karakol', 42.49, 78.39, geonames('Karakol')),
  city('kg:tokmok', 'Tokmok', 42.84, 75.30, geonames('Tokmok')),
  city('kg:naryn', 'Naryn', 41.43, 75.99, geonames('Naryn')),
  city('kg:talas', 'Talas', 42.52, 72.24, geonames('Talas')),
  city('kg:batken', 'Batken', 40.06, 70.82, geonames('Batken')),
  city('kg:kara-balta', 'Kara-Balta', 42.81, 73.85, geonames('Kara-Balta')),
  city('kg:balykchy', 'Balykchy', 42.46, 76.19, geonames('Balykchy'), 10000, { type: 'relation', id: 15586036 }),
  city('kg:kant', 'Kant', 42.89, 74.85, geonames('Kant')),
  city('kg:uzgen', 'Uzgen', 40.77, 73.30, geonames('Uzgen')),
  city('kg:kyzyl-kiya', 'Kyzyl-Kiya', 40.26, 72.13, geonames('Kyzyl-Kiya')),
]);
