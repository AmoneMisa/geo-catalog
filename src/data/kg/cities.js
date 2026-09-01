const city = (id, canonicalName, lat, lng, sourceUrl, accuracyM = 10000) => Object.freeze({
  id,
  type: 'city',
  country: 'KG',
  canonicalName,
  center: Object.freeze({ lat, lng }),
  source: 'geonames',
  sourceUrl,
  accuracy: 'city',
  accuracyM,
});

export const KG_CITY_ENTITIES = Object.freeze([
  city('kg:bishkek', 'Bishkek', 42.87, 74.59, 'https://www.geonames.org/advanced-search.html?country=KG&q=Bishkek'),
  city('kg:osh', 'Osh', 40.53, 72.80, 'https://www.geonames.org/advanced-search.html?country=KG&q=Osh'),
  city('kg:karakol', 'Karakol', 42.49, 78.39, 'https://www.geonames.org/advanced-search.html?country=KG&q=Karakol'),
]);
