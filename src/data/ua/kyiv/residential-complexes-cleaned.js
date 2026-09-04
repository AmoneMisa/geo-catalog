const residential = (slug, canonicalName, lat, lng, sourceUrl, accuracyM = 240) => Object.freeze({
  id: `ua:kyiv:residential:${slug}`,
  type: 'residential_complex',
  country: 'UA',
  canonicalName,
  parentId: 'ua:kyiv',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: 'building',
  accuracyM,
});

/**
 * City-proper residential anchors promoted from the cleaned page-scrape batch.
 * Search results resolving to Sofiivska/Petropavlivska Borshchahivka, Irpin,
 * Vyshneve, Vyshhorod, Brovary, Hostomel, Hatne and other surrounding
 * settlements are intentionally excluded instead of being force-parented to Kyiv.
 */
export const UA_KYIV_CLEANED_RESIDENTIAL_COMPLEX_ENTITIES = Object.freeze([
  residential('krister-hrad', 'Krister Hrad', 50.498764, 30.427008, 'https://korter.ua/ru/new/kyiv/krister-hrad', 280),
  residential('edelweiss-house', 'Edelweiss House', 50.404430, 30.555826, 'https://edelweiss.house/', 220),
  residential('nyvky-plaza', 'Nyvky Plaza', 50.490699, 30.405259, 'https://dom.ria.com/novostroyka-zhk-nyvky-plaza-5798/', 240),
  residential('stolychni-kashtany', 'Stolychni Kashtany', 50.433667, 30.373369, 'https://nerukhomi.ua/ukr/n-zhk-stolichni-kashtani-kiiv/', 240),
  residential('smart-house', 'SmartHouse', 50.449636, 30.421611, 'https://yandex.com/maps/org/zhk_smarthouse/86764276720/', 220),
  residential('parkova-vezha', 'Parkova Vezha', 50.510519, 30.444775, 'https://dom.ria.com/uk/novostroyka-zhk-parkova-vezha-3498/', 240),
  residential('hillside', 'HillSide', 50.464933, 30.505386, 'https://korter.ua/uk/%D0%BA%D0%BB%D1%83%D0%B1%D0%BD%D0%B8%D0%B9-%D0%B1%D1%83%D0%B4%D0%B8%D0%BD%D0%BE%D0%BA-hillside-%D0%BA%D0%B8%D1%97%D0%B2', 220),
  residential('struetinsky', 'Struetinsky', 50.419338, 30.552858, 'https://meget.kiev.ua/novostroyki/2068-zk-struetinsky', 220),
]);
