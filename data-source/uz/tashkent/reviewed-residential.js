const osmResidential = (slug, canonicalName, lat, lng, osmId, accuracyM = 120, osmType = 'way') => Object.freeze({
  id: `uz:tashkent:residential:${slug}`,
  type: 'residential_complex',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/${osmType}/${osmId}`,
  accuracy: 'building',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
});

/**
 * Reviewed single-source residential complexes with explicit OSM building/complex identity.
 * Ambiguous cross-city and non-OSM candidates remain outside the promoted catalog.
 */
export const TASHKENT_REVIEWED_RESIDENTIAL_ENTITIES = Object.freeze([
  osmResidential('aktepa-sohil-buyi', 'ЖК "Актепа Сохил буйи"', 41.2993234, 69.2043403, 15651367, 120, 'relation'),
  osmResidential('btgi-shamol', 'ЖК "Бтги Шамол"', 41.3541233, 69.3358364, 1104602117),
  osmResidential('elegant', 'Жилой комплекс Elegant', 41.2827449, 69.2628378, 180910482),
  osmResidential('green-city-drovoseki', 'ЖК "Грин Сити" (Дровосеки)', 41.286188, 69.2142619, 407533014),
  osmResidential('gulsaray', 'жилой комплекс Гульсарай', 41.3622476, 69.2329138, 141919402),
  osmResidential('khuvaydo', 'Хувайдо жилой комплекс', 41.3437217, 69.2010282, 595298393),
  osmResidential('lotus-7', 'Жилой комплекс LOTUS 7', 41.3111877, 69.3286562, 450627592),
  osmResidential('milliy-house-ness', 'жилой комплекс "Milliy House" от NESS', 41.3401092, 69.3942995, 1015249792),
  osmResidential('ness-city', 'ЖК "Ness City"', 41.2424103, 69.2206278, 1028396345),
  osmResidential('ness-one', 'жилой комплекс "Ness One" от Ness', 41.2945371, 69.1823913, 1009602345),
  osmResidential('ness-sebzar', 'ЖК "Ness Sebzar"', 41.3388372, 69.2562378, 340229091),
  osmResidential('oazis', "Жилой комплекс 'Оазис'", 41.3646933, 69.2781875, 265903250),
  osmResidential('perspektiva', 'Переспектива жилой комплекс', 41.2815745, 69.3050023, 98681697),
  osmResidential('sultania', 'Sultania ЖК', 41.3121445, 69.3148833, 87498688),
  osmResidential('uchtepa-avenue', 'ЖК Учтепа Авению', 41.2754583, 69.1850373, 1478622713),
  osmResidential('yangibakht', 'ЖК Янгибахт', 41.2636079, 69.3751627, 1476565024),
  osmResidential('zamok-schastya', 'Жилой комплекс “Замок счастья”', 41.3666989, 69.3097562, 265923511),
]);
