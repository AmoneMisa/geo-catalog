import { getGeoEntity } from '../catalog.js';

const stop = (slug, canonicalName, lat, lng, osmType, osmId, extra = {}) => Object.freeze({
  id: `uz:tashkent:stop:bus:${slug}`,
  type: 'stop',
  mode: 'bus',
  country: 'UZ',
  cityId: 'uz:tashkent',
  canonicalName,
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'poi',
  accuracyM: extra.accuracyM ?? 180,
  osm: Object.freeze({ type: osmType, id: osmId }),
  ...(extra.geoEntityId ? { geoEntityId: extra.geoEntityId } : {}),
  ...(extra.wikidataId ? { wikidataId: extra.wikidataId } : {}),
});

const stopFromGeo = (slug, canonicalName, geoEntityId) => {
  const entity = getGeoEntity(geoEntityId);
  if (!entity) throw new Error(`Missing geo entity for transport stop: ${geoEntityId}`);
  return Object.freeze({
    id: `uz:tashkent:stop:bus:${slug}`,
    type: 'stop',
    mode: 'bus',
    country: 'UZ',
    cityId: 'uz:tashkent',
    canonicalName,
    center: Object.freeze({ ...entity.center }),
    geoEntityId: entity.id,
    source: entity.source,
    accuracy: entity.accuracy,
    accuracyM: entity.accuracyM,
    ...(entity.osm ? { osm: Object.freeze({ ...entity.osm }) } : {}),
    ...(entity.wikidataId ? { wikidataId: entity.wikidataId } : {}),
  });
};

const TASHKENT_BUS_REGISTRY_SOURCE = 'https://tashtrans.uz/avtobusnye-marshruty-tashkenta/';

export const TASHKENT_BUS_STOPS = Object.freeze([
  stop('ttz-bus-station', 'TTZ Bus Station', 41.36823, 69.39480, 'way', 98599092, { accuracyM: 220 }),
  stop('tashkent-international-airport', 'Tashkent International Airport', 41.26375, 69.29577, 'relation', 12345328, {
    accuracyM: 500,
    wikidataId: 'Q860952',
  }),
  stop('tashkent-tsum', 'TSUM Tashkent', 41.30825, 69.26919, 'way', 31953937, { accuracyM: 140 }),
  stop('food-city', 'Food City Bazaar', 41.20492, 69.32138, 'way', 825133525, { accuracyM: 280 }),
  stopFromGeo('yunusabad-17', 'Yunusabad-17', 'uz:tashkent:microdistrict:yunusabad-17'),
  stopFromGeo('yunusabad-19', 'Yunusabad-19', 'uz:tashkent:microdistrict:yunusabad-19'),
  stopFromGeo('yunusabad-9', 'Yunusabad-9', 'uz:tashkent:microdistrict:yunusabad-9'),
  stopFromGeo('yunusabad-6', 'Yunusabad-6', 'uz:tashkent:microdistrict:yunusabad-6'),
  stopFromGeo('tashkent-railway-station', 'Tashkent Railway Station', 'uz:tashkent:poi:tashkent-north-railway-station'),
  stopFromGeo('kuyluk-bazaar', 'Kuyluk Bazaar', 'uz:tashkent:poi:kuyluk-bazaar'),
  stopFromGeo('farhod-bazaar', 'Farhod Bazaar', 'uz:tashkent:poi:farhod-bazaar'),
  stopFromGeo('geofizika', 'Geofizika', 'uz:tashkent:local-area:geofizika'),
  stopFromGeo('medgorodok', 'Medgorodok', 'uz:tashkent:local-area:medgorodok'),
]);

export const TASHKENT_BUS_ROUTE_REFS_2026_08_18 = Object.freeze([
  '1','2','3','5','6','7','8','8T','9T','10','11','12','13','13T','14','15','16','17','17T','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','91','93','94','95','96','97','98','99','100','101','103','104','105','106','109','110','112','113','114','115','116','117','118','119','120','121','122','123','124','125','126','127','128','129','130','131','132','133','134','135','136','137','138','139','140','141','142','143','144','145','146','147','148','149','150','151','152','153','154','156','157','159','161','169','170','171','174','175','177','181','183','184','185','188','190','194','196','197','198','199',
]);

const metadataRoute = (ref) => Object.freeze({
  id: `uz:tashkent:route:bus:${String(ref).toLowerCase()}`,
  type: 'route',
  mode: 'bus',
  country: 'UZ',
  cityId: 'uz:tashkent',
  canonicalName: `Route ${ref}`,
  ref,
  source: 'manual',
  sourceUrl: TASHKENT_BUS_REGISTRY_SOURCE,
  sourceUpdatedAt: '2026-08-18',
  coverage: 'metadata_only',
  stopIds: Object.freeze([]),
});

const terminalRoute = (ref, sourceUpdatedAt, terminalNames, stopIds) => Object.freeze({
  id: `uz:tashkent:route:bus:${String(ref).toLowerCase()}`,
  type: 'route',
  mode: 'bus',
  country: 'UZ',
  cityId: 'uz:tashkent',
  canonicalName: `Route ${ref}`,
  ref,
  source: 'manual',
  sourceUrl: TASHKENT_BUS_REGISTRY_SOURCE,
  sourceUpdatedAt,
  coverage: 'terminals_only',
  terminalNames: Object.freeze(terminalNames),
  stopIds: Object.freeze(stopIds),
});

const enrichedRoutes = new Map([
  ['6', terminalRoute('6', '2026-08-08', ['Yunusabad-17', 'Yunusabad-6'], [
    'uz:tashkent:stop:bus:yunusabad-17',
    'uz:tashkent:stop:bus:yunusabad-6',
  ])],
  ['12', terminalRoute('12', '2026-08-08', ['Kuyluk Bazaar', 'Tashkent International Airport'], [
    'uz:tashkent:stop:bus:kuyluk-bazaar',
    'uz:tashkent:stop:bus:tashkent-international-airport',
  ])],
  ['14', terminalRoute('14', '2026-08-08', ['Tashkent Railway Station', 'TTZ Bus Station'], [
    'uz:tashkent:stop:bus:tashkent-railway-station',
    'uz:tashkent:stop:bus:ttz-bus-station',
  ])],
  ['16', terminalRoute('16', '2026-08-08', ['Tashkent Railway Station', 'TTZ Bus Station'], [
    'uz:tashkent:stop:bus:tashkent-railway-station',
    'uz:tashkent:stop:bus:ttz-bus-station',
  ])],
  ['17', terminalRoute('17', '2026-08-18', ['Geofizika', 'Chorsu Metro'], [
    'uz:tashkent:stop:bus:geofizika',
    'uz:tashkent:stop:metro:chorsu',
  ])],
  ['22', terminalRoute('22', '2026-08-18', ['TSUM Tashkent', 'Dostlik Metro'], [
    'uz:tashkent:stop:bus:tashkent-tsum',
    'uz:tashkent:stop:metro:dostlik',
  ])],
  ['23', terminalRoute('23', '2026-08-18', ['Farhod Bazaar', 'Chorsu Metro'], [
    'uz:tashkent:stop:bus:farhod-bazaar',
    'uz:tashkent:stop:metro:chorsu',
  ])],
  ['34', terminalRoute('34', '2026-08-18', ['Chilanzar Metro', 'Medgorodok'], [
    'uz:tashkent:stop:metro:chilonzor',
    'uz:tashkent:stop:bus:medgorodok',
  ])],
  ['39', terminalRoute('39', '2026-08-18', ['Tuzel Metro', 'Food City Bazaar'], [
    'uz:tashkent:stop:metro:tuzel',
    'uz:tashkent:stop:bus:food-city',
  ])],
  ['67', terminalRoute('67', '2026-08-08', ['Yunusabad-19', 'Tashkent International Airport'], [
    'uz:tashkent:stop:bus:yunusabad-19',
    'uz:tashkent:stop:bus:tashkent-international-airport',
  ])],
  ['79', terminalRoute('79', '2026-08-18', ['Beruniy Metro', 'TTZ Bus Station'], [
    'uz:tashkent:stop:metro:beruniy',
    'uz:tashkent:stop:bus:ttz-bus-station',
  ])],
  ['93', terminalRoute('93', '2026-08-18', ['Food City Bazaar', 'Yunusabad-9'], [
    'uz:tashkent:stop:bus:food-city',
    'uz:tashkent:stop:bus:yunusabad-9',
  ])],
  ['110', terminalRoute('110', '2026-08-18', ['Food City Bazaar', 'TTZ Bus Station'], [
    'uz:tashkent:stop:bus:food-city',
    'uz:tashkent:stop:bus:ttz-bus-station',
  ])],
  ['133', terminalRoute('133', '2026-08-18', ['Chinor Metro', 'Food City Bazaar'], [
    'uz:tashkent:stop:metro:chinor',
    'uz:tashkent:stop:bus:food-city',
  ])],
]);

export const TASHKENT_BUS_ROUTES = Object.freeze(
  TASHKENT_BUS_ROUTE_REFS_2026_08_18.map((ref) => enrichedRoutes.get(ref) ?? metadataRoute(ref)),
);
