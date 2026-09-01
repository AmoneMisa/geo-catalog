const district = (slug, canonicalName, lat, lng, accuracyM, sourceUrl) => Object.freeze({
  id: `ua:zhytomyr:district:${slug}`,
  type: 'district',
  country: 'UA',
  canonicalName,
  parentId: 'ua:zhytomyr',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  accuracy: 'district',
  accuracyM,
  sourceUrl,
});

// Zhytomyr City Council documents exactly two current administrative districts:
// Bohunskyi and Korolovskyi. The points below are conservative representative
// locality centers and deliberately do not pretend to be polygon boundaries.
export const UA_ZHYTOMYR_DISTRICT_ENTITIES = Object.freeze([
  district('bohunskyi', 'Bohunskyi', 50.276911, 28.609624, 7500, 'https://mapcarta.com/13769426'),
  district('korolovskyi', 'Korolovskyi', 50.2494, 28.7009, 7500, 'https://mapcarta.com/13755514'),
]);
