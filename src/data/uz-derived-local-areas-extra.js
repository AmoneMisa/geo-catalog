const area = (citySlug, slug, canonicalName, lat, lng, accuracyM) => ({
  id: `uz:${citySlug}:local-area:${slug}`,
  type: 'local_area',
  country: 'UZ',
  canonicalName,
  parentId: `uz:${citySlug}`,
  center: { lat, lng },
  source: 'manual',
  accuracy: 'approximate',
  accuracyM,
});

export const UZ_DERIVED_LOCAL_AREA_EXTRA_ENTITIES = Object.freeze([
  area('gulistan', 'university-area', 'University area', 40.50611, 68.78324, 900),
  area('margilan', 'kumtepa', 'Kumtepa', 40.45504, 71.66594, 1100),
  area('termez', 'old-termez', 'Old Termez', 37.2780, 67.1900, 2200),
  area('shakhrisabz', 'old-city', 'Old City', 39.0515, 66.8290, 1700),
  area('shakhrisabz', 'amir-temur', 'Amir Temur', 39.058242, 66.829292, 850),
]);
