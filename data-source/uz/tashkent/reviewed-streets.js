const mappedStreet = (slug, canonicalName, lat, lng, providerId, accuracyM = 600) => Object.freeze({
  id: `uz:tashkent:street:${slug}`,
  type: 'street',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl: `https://2gis.uz/tashkent/geo/${providerId}`,
  accuracy: 'street',
  accuracyM,
});

/**
 * Reviewed 2GIS records whose provider subtype is explicitly `street`.
 * Generic `place` results remain excluded even when their labels contain street wording.
 */
export const TASHKENT_REVIEWED_STREET_ENTITIES = Object.freeze([
  mappedStreet('tarakkiyot-4-mavze', 'Тараккиёт 4-мавзе улица', 41.35283, 69.23956, '70030076188807919'),
  mappedStreet('tashkent', 'Улица Ташкент', 41.327, 69.26615, '70030076412670965'),
]);
