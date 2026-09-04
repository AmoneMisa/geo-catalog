const residential = (slug, canonicalName, lat, lng, sourceUrl, parentId = 'uz:tashkent', accuracyM = 160) => Object.freeze({
  id: `uz:tashkent:residential:${slug}`,
  type: 'residential_complex',
  country: 'UZ',
  canonicalName,
  parentId,
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: 'building',
  accuracyM,
});

/**
 * Strong city-proper anchors promoted from the cleaned page-scrape batch.
 * Generic unnamed search results and entities without a stable complex identity
 * remain excluded.
 */
export const TASHKENT_CLEANED_RESIDENTIAL_ENTITIES = Object.freeze([
  residential(
    'eco-dream',
    'Eco Dream',
    41.357179,
    69.339519,
    'https://urbo.uz/new-buildings/ecodream',
    'uz:tashkent:yunusabad',
  ),
  residential(
    'bobur-residence',
    'Bobur Residence',
    41.277548,
    69.258956,
    'https://www.greenpark.uz/uz',
    'uz:tashkent:yakkasaray',
  ),
  residential(
    'riverside',
    'Riverside',
    41.351855,
    69.388546,
    'https://yandex.com/maps/org/zhk_riverside/69961349111/',
  ),
  residential(
    'minor-river',
    'Minor River',
    41.336464,
    69.271466,
    'https://immo.uz/novostroyki/zhk-minor-river__225',
    'uz:tashkent:shaykhantahur',
  ),
  residential(
    'obi-hayot',
    'Obi Hayot',
    41.269456,
    69.320460,
    'https://immo.uz/novostroyki/zhk-obi-hayot__165',
    'uz:tashkent:yashnobod',
  ),
  residential(
    'askiya-city',
    'Askiya City',
    41.286716,
    69.246871,
    'https://yandex.com/maps/org/zhk_askiya_city/100249722806/',
  ),
  residential(
    'wiston',
    'Wiston',
    41.322714,
    69.292758,
    'https://yandex.com/maps/org/zhk_wiston/7574275381/',
  ),
  residential(
    'zaytunli',
    'Zaytunli',
    41.289808,
    69.313140,
    'https://yandex.com/maps/org/zhk_zaytunli/30971278405/',
  ),
]);
