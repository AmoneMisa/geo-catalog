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
  stopFromGeo('yunusabad-17', 'Yunusabad-17', 'uz:tashkent:microdistrict:yunusabad-17'),
  stopFromGeo('yunusabad-6', 'Yunusabad-6', 'uz:tashkent:microdistrict:yunusabad-6'),
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
  ['79', terminalRoute('79', '2026-08-18', ['Beruniy Metro', 'TTZ Bus Station'], [
    'uz:tashkent:stop:metro:beruniy',
    'uz:tashkent:stop:bus:ttz-bus-station',
  ])],
]);

export const TASHKENT_BUS_ROUTES = Object.freeze(
  TASHKENT_BUS_ROUTE_REFS_2026_08_18.map((ref) => enrichedRoutes.get(ref) ?? metadataRoute(ref)),
);
