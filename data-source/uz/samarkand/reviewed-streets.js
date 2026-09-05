const mappedStreet = (slug, canonicalName, lat, lng, providerId, accuracyM = 650) => Object.freeze({
  id: `uz:samarkand:street:${slug}`,
  type: 'street',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:samarkand',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl: `https://2gis.uz/samarkand/geo/${providerId}`,
  accuracy: 'street',
  accuracyM,
});

/**
 * Reviewed 2GIS records whose provider subtype is explicitly `street`.
 * Ambiguous same-name and branch/place results remain outside the promoted catalog.
 */
export const SAMARKAND_REVIEWED_STREET_ENTITIES = Object.freeze([
  mappedStreet('kyzylkumskaya-2', '2-я Кызылкумская', 39.68878, 66.86003, '70030077139880938'),
  mappedStreet('samarkand-1', '1-я Самарканд улица', 39.6349, 66.8899, '70030076904323057'),
  mappedStreet('samarkand-2', '2-я Самарканд улица', 39.63389, 66.89212, '70030076905356729'),
  mappedStreet('khalila-sultana', 'Халила Султана улица', 39.62315, 67.00051, '70030076949380154'),
  mappedStreet('makhorat', 'Улица Махорат', 39.6244, 66.9534, '70030076701317064'),
  mappedStreet('namazgokh', 'Намазгох переулок', 39.63594, 66.96949, '70030077184747326'),
  mappedStreet('rasadkhona', 'Улица Расадхона', 39.67319, 67.01935, '70030077190597079'),
  mappedStreet('shakhmurada', 'Улица Шахмурада', 39.66883, 66.97523, '70030076601841497'),
  mappedStreet('ustozlar', 'Улица Устозлар', 39.66469, 66.9172, '70030076645590632'),
]);
