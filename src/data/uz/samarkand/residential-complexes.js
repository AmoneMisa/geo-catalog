const residential = (slug, canonicalName, lat, lng, sourceUrl, accuracyM = 500) => Object.freeze({
  id: `uz:samarkand:residential:${slug}`,
  type: 'residential_complex',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:samarkand',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  accuracy: 'building',
  accuracyM,
  sourceUrl,
});

export const SAMARKAND_RESIDENTIAL_COMPLEX_ENTITIES = Object.freeze([
  residential('samarkand-city', 'Samarkand City', 39.647175, 66.943030, 'https://yandex.com/maps/10334/samarkand/geo/4220993069/', 700),
]);
