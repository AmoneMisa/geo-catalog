const mahalla = (slug, canonicalName, parentId, lat, lng, osmType, osmId, accuracyM = 420) => ({
  id: `uz:tashkent:mahalla:${slug}`,
  type: 'mahalla',
  country: 'UZ',
  canonicalName,
  parentId,
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

const IBN_SINO_MAHALLA_BOUNDARY = {
  type: 'Polygon',
  coordinates: [[
    [69.1606758, 41.3286194], [69.1653859, 41.3313943], [69.1672986, 41.3304856],
    [69.1675966, 41.328062], [69.1938123, 41.3265901], [69.1968595, 41.3294228],
    [69.1937966, 41.3311775], [69.1828854, 41.3313154], [69.1829621, 41.3360955],
    [69.1728287, 41.335726], [69.1699856, 41.3319236], [69.1633301, 41.3334167],
    [69.1606758, 41.3286194],
  ]],
};

const TARAQQIYOT_MAHALLA_BOUNDARY = {
  type: 'Polygon',
  coordinates: [[
    [69.2382654, 41.3487207], [69.2462675, 41.3480587], [69.246356, 41.3488643],
    [69.2442593, 41.3486633], [69.2451292, 41.3510711], [69.2443306, 41.3511394],
    [69.24501, 41.3547364], [69.2444462, 41.354774], [69.2446771, 41.3564063],
    [69.2423423, 41.3570038], [69.2418732, 41.3616148], [69.2392255, 41.3610343],
    [69.2382654, 41.3487207],
  ]],
};

export const TASHKENT_MAHALLA_ENTITIES = Object.freeze([
  Object.freeze({
    ...mahalla('ibn-sino', 'Ibn Sino', 'uz:tashkent:shaykhantahur', 41.3313297, 69.1742038, 'way', 149991108, 650),
    boundary: IBN_SINO_MAHALLA_BOUNDARY,
  }),
  Object.freeze({
    ...mahalla('taraqqiyot', 'Taraqqiyot', 'uz:tashkent:almazar', 41.3543465, 69.2411171, 'way', 1134501657, 720),
    boundary: TARAQQIYOT_MAHALLA_BOUNDARY,
  }),
  Object.freeze({
    id: 'uz:tashkent:mahalla:sugdiyona',
    type: 'mahalla',
    country: 'UZ',
    canonicalName: "Sug'diyona",
    parentId: 'uz:tashkent:sergeli',
    center: Object.freeze({ lat: 41.223284, lng: 69.235013 }),
    source: 'manual',
    accuracy: 'approximate',
    accuracyM: 1400,
    sourceUrl: 'https://opendata-back.tashkent.uz/upload/data/file/%D0%9F%D0%A4-29_5-%D0%B8%D0%BB%D0%BE%D0%B2%D0%B0%D1%81%D0%B8_%D1%82%D0%B0%D0%B9%D1%91%D1%80_%D0%BE%D1%85%D0%B8%D1%80%D0%B3%D0%B8_27.03.pdf',
  }),
  mahalla('taxtapul', 'Taxtapul', 'uz:tashkent:shaykhantahur', 41.339682, 69.2642825, 'node', 9687947537, 650),
  mahalla('khastimam', 'Khastimam', 'uz:tashkent:almazar', 41.33303, 69.24287, 'way', 1137236407, 420),
  mahalla('yangi-tashkent', 'Yangi Tashkent', 'uz:tashkent:almazar', 41.36743, 69.22415, 'node', 1866058486, 520),
  mahalla('umid', 'Umid', 'uz:tashkent:almazar', 41.36899, 69.21901, 'way', 1137777682, 520),
  mahalla('kashgar', 'Kashgar', 'uz:tashkent:yunusabad', 41.31619, 69.27087, 'way', 1006384228, 420),
  mahalla('buyuk-turan', 'Buyuk Turan', 'uz:tashkent:yunusabad', 41.32097, 69.28708, 'way', 1008828995, 460),
  mahalla('minor', 'Minor', 'uz:tashkent:yunusabad', 41.33725, 69.27972, 'way', 1012743631, 460),
  mahalla('labzak', 'Labzak', 'uz:tashkent:shaykhantahur', 41.33221, 69.26828, 'node', 11185280560, 420),
  mahalla('rakat', 'Rakat', 'uz:tashkent:yakkasaray', 41.28337, 69.24247, 'node', 5267423765, 380),
  mahalla('belaryk', 'Belaryk', 'uz:tashkent:yakkasaray', 41.29013, 69.24338, 'way', 1078174899, 420),
  mahalla('shahjahan', 'Shahjahan', 'uz:tashkent:yakkasaray', 41.28542, 69.24894, 'way', 1078458314, 420),
  mahalla('mukimiy', 'Mukimiy', 'uz:tashkent:yakkasaray', 41.27945, 69.23655, 'node', 1869638304, 380),
  mahalla('birlashgan', 'Birlashgan', 'uz:tashkent:yashnobod', 41.29138, 69.35184, 'node', 12253307757, 380),
  mahalla('nadyra', 'Nadyra', 'uz:tashkent:yashnobod', 41.27749, 69.35085, 'node', 12154016425, 380),
  mahalla('makhmur', 'Makhmur', 'uz:tashkent:yashnobod', 41.28905, 69.33510, 'node', 12144738031, 380),
]);
