const residential = (slug, canonicalName, lat, lng, osmId, accuracyM = 320) => Object.freeze({
  id: `ua:dnipro:residential-complex:${slug}`,
  type: 'residential_complex',
  country: 'UA',
  canonicalName,
  parentId: 'ua:dnipro',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'building',
  accuracyM,
  osm: Object.freeze({ type: 'way', id: osmId }),
});

const cleanedResidential = (slug, canonicalName, lat, lng, sourceUrl, accuracyM = 280) => Object.freeze({
  id: `ua:dnipro:residential-complex:${slug}`,
  type: 'residential_complex',
  country: 'UA',
  canonicalName,
  parentId: 'ua:dnipro',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: 'building',
  accuracyM,
});

const YANDEX_DNIPRO_RESIDENTIAL_SEARCH = 'https://yandex.com/maps/?text=%D0%96%D0%9A%2C%20Dnipro';

export const UA_DNIPRO_RESIDENTIAL_COMPLEX_ENTITIES = Object.freeze([
  residential('nebo', 'Nebo', 48.463601, 35.06225, 1225643418, 320),
  residential('west-hall', 'West Hall', 48.4285198, 35.0649704, 887478103, 320),

  // Strong single-source entities promoted from the cleaned page-scrape batch.
  cleanedResidential('pikhtovyi', 'Pikhtovyi', 48.442422, 35.008002, 'https://dom.ria.com/uk/novostroyka-zhk-pikhtovyi-3733/'),
  cleanedResidential('dom-na-tytova', 'Dom na Tytova', 48.430389, 35.008487, 'https://dom.ria.com/novostroyka-zhk-dom-na-tytova-5323/'),
  cleanedResidential('atlant', 'Atlant', 48.465165, 35.02172, 'https://lun.ua/new/dnipro/atlant'),
  cleanedResidential('krasnopolskyi', 'Krasnopolskyi', 48.418717, 34.937757, YANDEX_DNIPRO_RESIDENTIAL_SEARCH),
  cleanedResidential('lighthouse', 'Lighthouse', 48.45787, 35.074505, 'https://korter.ua/uk/%D0%B6%D0%BA-%D0%BB%D0%B0%D0%B9%D1%82%D1%85%D0%B0%D1%83%D1%81-%D0%B4%D0%BD%D1%96%D0%BF%D1%80%D0%BE'),
  cleanedResidential('palermo', 'Palermo', 48.464717, 35.046181, 'https://dom.ria.com/uk/prodazha-kvartir/dnepr-zhk-palermo-4969/'),
  cleanedResidential('salyut', 'Salyut', 48.415154, 35.068639, 'https://daytona.com.ua/ru/objects/zhk-saljut/'),
  cleanedResidential('ptakhy', 'Ptakhy', 48.429134, 35.038105, YANDEX_DNIPRO_RESIDENTIAL_SEARCH),
]);
