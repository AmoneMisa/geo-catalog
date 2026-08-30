import { TASHKENT_LOCAL_AREA_BOUNDARIES } from './local-area-boundaries.js';

const osmArea = (slug, canonicalName, parentId, lat, lng, osmType, osmId, accuracyM = 650) => ({
  id: `uz:tashkent:local-area:${slug}`,
  type: 'local_area',
  country: 'UZ',
  canonicalName,
  parentId,
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

const derivedArea = (slug, canonicalName, parentId, lat, lng, accuracyM) => ({
  id: `uz:tashkent:local-area:${slug}`,
  type: 'local_area',
  country: 'UZ',
  canonicalName,
  parentId,
  center: { lat, lng },
  source: 'manual',
  accuracy: 'approximate',
  accuracyM,
});

const boundaryArea = (slug, canonicalName, parentId, accuracyM = 650) => {
  const { osmType, osmId, center, geometry } = TASHKENT_LOCAL_AREA_BOUNDARIES[slug];
  return {
    id: `uz:tashkent:local-area:${slug}`,
    type: 'local_area',
    country: 'UZ',
    canonicalName,
    parentId,
    center,
    source: 'osm',
    accuracy: 'neighborhood',
    accuracyM,
    osm: { type: osmType, id: osmId },
    boundary: geometry,
  };
};

export const TASHKENT_VERIFIED_AREA_ENTITIES = Object.freeze([
  osmArea('ahmad-yugnakiy', 'Ahmad Yugnakiy', 'uz:tashkent:mirzo-ulugbek', 41.3480578, 69.3863569, 'node', 1867262863, 700),
  boundaryArea('akademgorodok', 'Akademgorodok', 'uz:tashkent:mirzo-ulugbek', 850),
  osmArea('bogkocha', "Bog'ko'cha", 'uz:tashkent:shaykhantahur', 41.3275906, 69.2190401, 'node', 1223133760, 650),
  boundaryArea('c-7', 'C-7', 'uz:tashkent:mirobod', 650),
  boundaryArea('chuqursoy', 'Chuqursoy', 'uz:tashkent:almazar', 500),
  // User-supplied point reverse-geocoded to Al-Horazmiy 1 dahasi in Chilonzor Tumani.
  derivedArea('al-khorezmi-1', 'Al-Khorezmi-1', 'uz:tashkent:chilanzar', 41.259301, 69.154431, 650),
  boundaryArea('chorsu', 'Chorsu', 'uz:tashkent:shaykhantahur', 550),
  // Midpoint of the verified Russian Embassy stops and Mirobod bazaar relation.
  derivedArea('dehqonobod', 'Dehqonobod', 'uz:tashkent:mirobod', 41.2889708, 69.2731022, 750),
  // University-area usage centered on the verified Geology Sciences University campus.
  // The separate same-name residential polygon in Yashnobod is not this lexical area.
  derivedArea('geofizika', 'Geofizika', 'uz:tashkent:mirzo-ulugbek', 41.3413252, 69.3403061, 1000),
  // User-verified Qo'yliq markaz residential-area center near the Yashnobod/Bektemir border.
  derivedArea('kuylyuk-center', 'Kuylyuk Center', 'uz:tashkent:yashnobod', 41.240623, 69.332279, 750),
  // User-supplied point on Lolazor Street inside Bog'ichinor Mahallah.
  derivedArea('lolazor', 'Lolazor', 'uz:tashkent:uchtepa', 41.325387, 69.176835, 500),
  // Address anchor on Oltinko'l Passage 1 inside the Karasu mahallah.
  derivedArea('oltinkul', 'Oltinkul', 'uz:tashkent:mirobod', 41.2665, 69.298745, 650),
  // Representative center for the residential area around Shohimardon Street.
  derivedArea('shohimardon', 'Shohimardon', 'uz:tashkent:yashnobod', 41.2736, 69.3522, 750),
  // OSM locality retains the area's historical Maksim Gorkiy name; distinct from the metro station.
  osmArea('buyuk-ipak-yuli', 'Buyuk Ipak Yuli', 'uz:tashkent:mirzo-ulugbek', 41.3263381, 69.3256346, 'node', 5267587643, 900),
  osmArea('chimbay', 'Chimbay', 'uz:tashkent:almazar', 41.36257, 69.20025, 'node', 1866058485, 650),
  osmArea('yalangach', 'Yalangach', 'uz:tashkent:mirzo-ulugbek', 41.35013, 69.34254, 'node', 1867002807, 800),
  osmArea('feruza', 'Feruza', 'uz:tashkent:mirzo-ulugbek', 41.35561, 69.36388, 'node', 10938027477, 750),
  osmArea('feruza-2', 'Feruza-2', 'uz:tashkent:mirzo-ulugbek', 41.35352, 69.35867, 'node', 1868216236, 650),
  osmArea('feruza-3', 'Feruza-3', 'uz:tashkent:mirzo-ulugbek', 41.35815, 69.36978, 'way', 151576922, 650),
  osmArea('tashgres', 'ToshGRES', 'uz:tashkent:yunusabad', 41.35547, 69.33673, 'node', 1866983396, 700),
  osmArea('beshagach', 'Beshagach', 'uz:tashkent:chilanzar', 41.3047615, 69.2507561, 'node', 11559407267, 650),
  osmArea('beltepa', 'Beltepa', 'uz:tashkent:shaykhantahur', 41.3459531, 69.1724087, 'way', 149989887, 700),
  osmArea('medgorodok', 'Medgorodok', 'uz:tashkent:almazar', 41.35527, 69.17428, 'node', 10704411976, 700),
  osmArea('vuzgorodok', 'Vuzgorodok', 'uz:tashkent:almazar', 41.35155, 69.20564, 'node', 1866061222, 650),
  osmArea('hospitalny', 'Hospitalny', 'uz:tashkent:mirobod', 41.29375, 69.27413, 'node', 3907644432, 550),
  osmArea('irrigator', 'Irrigator', 'uz:tashkent:mirzo-ulugbek', 41.3200798, 69.2966893, 'node', 4730061324, 650),
  osmArea('parkent', 'Parkent', 'uz:tashkent:mirzo-ulugbek', 41.3173278, 69.3215531, 'node', 13264841185, 800),
  osmArea('parkent-riyoziy', 'Parkent-Riyoziy', 'uz:tashkent:yashnobod', 41.31217, 69.32614, 'node', 1867099585, 650),
  boundaryArea('shimoliy-olmazor', 'Shimoliy Olmazor', 'uz:tashkent:almazar', 450),
  osmArea('suvsoz-1', 'Suvsoz-1', 'uz:tashkent:bektemir', 41.247201, 69.3706561, 'relation', 19801804, 700),
  osmArea('suvsoz-2', 'Suvsoz-2', 'uz:tashkent:bektemir', 41.2518266, 69.3756741, 'way', 153528330, 650),
  osmArea('movarounnahr', 'Movarounnahr', 'uz:tashkent:mirobod', 41.29999, 69.28658, 'way', 1057801683, 520),
  osmArea('nakkoshlik', 'Nakkoshlik', 'uz:tashkent:chilanzar', 41.2674213, 69.202444, 'way', 1180079691, 520),
  osmArea('alimkent', 'Alimkent', 'uz:tashkent:yashnobod', 41.29546, 69.33720, 'node', 12144738032, 520),
  osmArea('gulobod', 'Gulobod', 'uz:tashkent:shaykhantahur', 41.32507, 69.22454, 'way', 144061796, 650),
  osmArea('sebzor', 'Sebzor', 'uz:tashkent:almazar', 41.3348, 69.24967, 'way', 32593826, 650),
  osmArea('olimpiya', 'Olimpiya', 'uz:tashkent:almazar', 41.3628, 69.19735, 'way', 1146998118, 650),
  osmArea('chamanbog', "Chamanbog'", 'uz:tashkent:almazar', 41.36902, 69.19369, 'way', 1150374391, 650),
  osmArea('beshqorgon-1', "Beshqo'rg'on-1", 'uz:tashkent:almazar', 41.36916, 69.2022, 'node', 1866058465, 650),
  osmArea('beshqorgon-2', "Beshqo'rg'on-2", 'uz:tashkent:almazar', 41.36501, 69.20054, 'node', 1866058473, 650),
  osmArea('beshqorgon-3', "Beshqo'rg'on-3", 'uz:tashkent:almazar', 41.36818, 69.19595, 'node', 1866058478, 650),
  osmArea('beshqorgon-4', "Beshqo'rg'on-4", 'uz:tashkent:almazar', 41.36672, 69.20181, 'way', 149508411, 650),
  osmArea('quruvchi', 'Quruvchi', 'uz:tashkent:sergeli', 41.21712, 69.26387, 'way', 141913622, 800),
  osmArea('boz-1', "Bo'z-1", 'uz:tashkent:mirzo-ulugbek', 41.33267, 69.33053, 'node', 1867214210, 650),
  osmArea('boz-2', "Bo'z-2", 'uz:tashkent:mirzo-ulugbek', 41.3474, 69.35094, 'node', 1867214215, 650),
  osmArea('asalobod-1', 'Asalobod-1', 'uz:tashkent:yashnobod', 41.2806, 69.33903, 'way', 165626940, 650),
  osmArea('asalobod-2', 'Asalobod-2', 'uz:tashkent:yashnobod', 41.28204, 69.33594, 'way', 165626941, 650),
  osmArea('ibn-sino-1', 'Ibn Sino-1', 'uz:tashkent:shaykhantahur', 41.33426, 69.16822, 'way', 103249732, 700),
  osmArea('ibn-sino-2', 'Ibn Sino-2', 'uz:tashkent:shaykhantahur', 41.33847, 69.17059, 'way', 149989839, 700),
  osmArea('shifokorlar-1', 'Shifokorlar-1', 'uz:tashkent:almazar', 41.361, 69.18198, 'way', 149513658, 700),
  osmArea('shifokorlar-4', 'Shifokorlar-4', 'uz:tashkent:almazar', 41.35963, 69.18595, 'way', 142245652, 650),
  osmArea('markaz-12', 'Markaz-12', 'uz:tashkent:shaykhantahur', 41.32974, 69.26738, 'node', 4984463379, 650),
  osmArea('qoyliq-1', "Qo'yliq-1", 'uz:tashkent:mirobod', 41.24728, 69.31556, 'node', 3991877003, 650),
  osmArea('qoyliq-2', "Qo'yliq-2", 'uz:tashkent:mirobod', 41.25094, 69.30599, 'node', 3991877004, 650),
  osmArea('qoyliq-3', "Qo'yliq-3", 'uz:tashkent:mirobod', 41.25036, 69.31066, 'node', 3991877005, 650),
  osmArea('qoyliq-4', "Qo'yliq-4", 'uz:tashkent:mirobod', 41.24694, 69.30656, 'node', 3991877006, 650),
  osmArea('qoyliq-5', "Qo'yliq-5", 'uz:tashkent:sergeli', 41.24772, 69.29794, 'node', 3991877007, 650),
  osmArea('qoyliq-6', "Qo'yliq-6", 'uz:tashkent:sergeli', 41.24693, 69.28985, 'node', 4750071797, 650),
  osmArea('qoyliq-7', "Qo'yliq-7", 'uz:tashkent:sergeli', 41.24646, 69.2845, 'node', 5637605369, 650),
]);
