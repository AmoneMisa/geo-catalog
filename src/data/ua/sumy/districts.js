const district = (slug, canonicalName, lat, lng, accuracyM, sourceUrl) => Object.freeze({
  id: `ua:sumy:district:${slug}`,
  type: 'district',
  country: 'UA',
  canonicalName,
  parentId: 'ua:sumy',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  accuracy: 'district',
  accuracyM,
  sourceUrl,
});

// Sumy is currently divided into exactly two city districts: Kovpakivskyi and Zarichnyi.
// These are representative GeoNames locality centers; no synthetic boundary is asserted.
export const UA_SUMY_DISTRICT_ENTITIES = Object.freeze([
  district('kovpakivskyi', 'Kovpakivskyi', 50.92508, 34.79484, 7000, 'https://www.geonames.org/13607717/kovpakivskyi.html'),
  district('zarichnyi', 'Zarichnyi', 50.90376, 34.80933, 7000, 'https://www.geonames.org/13607718/zarichnyi.html'),
]);
