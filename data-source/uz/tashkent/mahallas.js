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

const manualMahalla = (slug, canonicalName, parentId, lat, lng, accuracyM, sourceUrl) => ({
  id: `uz:tashkent:mahalla:${slug}`,
  type: 'mahalla',
  country: 'UZ',
  canonicalName,
  parentId,
  center: { lat, lng },
  source: 'manual',
  accuracy: 'approximate',
  accuracyM,
  ...(sourceUrl ? { sourceUrl } : {}),
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
  // Current address maps expose these as standalone mahalla fuqarolar yig'ini geo objects. Keep them manual/approximate so same-name mavze/local-area OSM objects retain separate ownership.
  manualMahalla('ahmad-yugnakiy', 'Ahmad Yugnakiy', 'uz:tashkent:mirzo-ulugbek', 41.348643, 69.384426, 850, 'https://yandex.uz/maps/10335/tashkent/geo/1947233521/'),
  manualMahalla('traktorsozlar', 'Traktorsozlar', 'uz:tashkent:mirzo-ulugbek', 41.356488, 69.389268, 1000, 'https://yandex.uz/maps/10335/tashkent/geo/traktorsozlar_mahalla_fuqarolar_yig_ini/1947296221/'),
  manualMahalla('yangi-choshtepa', 'Yangi Choshtepa', 'uz:tashkent:yangihayot', 41.23134, 69.192322, 900, 'https://yandex.uz/maps/10335/tashkent/geo/4051602778/'),
  manualMahalla('olimpiya', 'Olimpiya', 'uz:tashkent:almazar', 41.362553, 69.196256, 800, 'https://yandex.uz/maps/10335/tashkent/geo/1946086741/'),
  manualMahalla('gulobod', 'Gulobod', 'uz:tashkent:shaykhantahur', 41.327208, 69.22538, 800, 'https://yandex.uz/maps/10335/tashkent/geo/gulobod_mahalla_fuqarolar_yig_ini/1944750071/'),
  manualMahalla('sebzor', 'Sebzor', 'uz:tashkent:almazar', 41.333979, 69.248781, 800, 'https://yandex.uz/maps/10335/tashkent/geo/1945849471/'),
  manualMahalla('qalqon', 'Qalqon', 'uz:tashkent:yashnobod', 41.280806, 69.371535, 800, 'https://yandex.uz/maps/10335/tashkent/geo/6108686495/'),
  manualMahalla('humoyun', 'Humoyun', 'uz:tashkent:mirzo-ulugbek', 41.343891, 69.388055, 900, 'https://yandex.com/maps/org/makhallinskiy_komitet_khumayun/207044096096/'),
  manualMahalla('asalobod', 'Asalobod', 'uz:tashkent:yashnobod', 41.2818125, 69.3364375, 900, 'https://www.waze.com/live-map/directions/uz/tashkent/tashkent/asalobod-mahalla-fuqarolar-yigin?to=place.ChIJTTJOMgD1rjgRyo47q8sSICo'),
  // User-verified against Yandex Maps. Keep the mahalla center separate from the same-name local-area OSM way.
  manualMahalla('bogbon', "Bog'bon", 'uz:tashkent:yashnobod', 41.282304, 69.384642, 800),

  // Direct city-scoped OSM residential owners from the geo-enrichment report.
  // Keep them as mahallas only when the OSM object is not already the physical
  // owner of a same-name mavze/local-area entity.
  mahalla('bogkocha', "Bog'ko'cha", 'uz:tashkent:shaykhantahur', 41.3277799, 69.2191542, 'relation', 2336787, 650),
  mahalla('shifokorlar', 'Shifokorlar', 'uz:tashkent:almazar', 41.3552738, 69.1742802, 'way', 1123281625, 700),
  // Nominatim matches the same residential way used by local-area:chamanbog.
  // Preserve the official mahalla semantic owner without duplicating physical OSM ownership.
  manualMahalla('chamanbog', "Chamanbog'", 'uz:tashkent:almazar', 41.3690631, 69.1942643, 800),

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