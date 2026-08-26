import { CITY_ENTITIES } from './data/cities.js';
import { TASHKENT_ENTITIES } from './data/tashkent.js';
import { TASHKENT_METRO_ENTITIES } from './data/tashkent-metro.js';
import { TASHKENT_METRO_EXTRA_ENTITIES } from './data/tashkent-metro-extra.js';
import { TASHKENT_METRO_CIRCLE_EXTRA_ENTITIES } from './data/tashkent-metro-circle-extra.js';
import { TASHKENT_MICRODISTRICT_ENTITIES } from './data/tashkent-microdistricts.js';
import { TASHKENT_MICRODISTRICT_EXTRA_ENTITIES } from './data/tashkent-microdistricts-extra.js';
import { TASHKENT_CHILANZAR_11_14_ENTITIES } from './data/tashkent-microdistricts-chilanzar-11-14.js';
import { TASHKENT_CHILANZAR_15_20_ENTITIES } from './data/tashkent-microdistricts-chilanzar-15-20.js';
import { TASHKENT_YUNUSABAD_4_9_ENTITIES } from './data/tashkent-microdistricts-yunusabad-4-9.js';
import { TASHKENT_YUNUSABAD_11_16_ENTITIES } from './data/tashkent-microdistricts-yunusabad-11-16.js';
import { TASHKENT_YUNUSABAD_17_19_ENTITIES } from './data/tashkent-microdistricts-yunusabad-17-19.js';
import { TASHKENT_NAMED_MICRODISTRICT_ENTITIES } from './data/tashkent-microdistricts-named.js';
import { TASHKENT_LOCAL_AREA_ENTITIES } from './data/tashkent-local-areas.js';
import { TASHKENT_ALMAZAR_LOCAL_AREA_ENTITIES } from './data/tashkent-local-areas-almazar.js';
import { TASHKENT_SHAYKHANTAHUR_LOCAL_AREA_ENTITIES } from './data/tashkent-local-areas-shaykhantahur.js';
import { TASHKENT_CORE_EXTRA_LOCAL_AREA_ENTITIES } from './data/tashkent-local-areas-core-extra.js';
import { TASHKENT_MIRZO_ULUGBEK_LOCAL_AREA_ENTITIES } from './data/tashkent-local-areas-mirzo-ulugbek.js';
import { TASHKENT_TTZ_EXTRA_LOCAL_AREA_ENTITIES } from './data/tashkent-local-areas-ttz-extra.js';
import { TASHKENT_YASHNOBOD_LOCAL_AREA_ENTITIES } from './data/tashkent-local-areas-yashnobod.js';
import { TASHKENT_YASHNOBOD_TUZEL_LOCAL_AREA_ENTITIES } from './data/tashkent-local-areas-yashnobod-tuzel.js';
import { TASHKENT_SERGELI_YANGIHAYOT_LOCAL_AREA_ENTITIES } from './data/tashkent-local-areas-sergeli-yangihayot.js';
import { TASHKENT_SERGELI_BLOCK_LOCAL_AREA_ENTITIES } from './data/tashkent-local-areas-sergeli-blocks.js';
import { TASHKENT_YANGIDARHAN_LOCAL_AREA_ENTITIES } from './data/tashkent-local-areas-yangidarhan.js';
import { TASHKENT_VERIFIED_AREA_ENTITIES } from './data/tashkent-local-areas-verified.js';
import { TASHKENT_MAHALLA_ENTITIES } from './data/tashkent-mahallas.js';
import { TASHKENT_ALMAZAR_EXTRA_MAHALLA_ENTITIES } from './data/tashkent-mahallas-almazar-extra.js';
import { TASHKENT_MIRZO_ULUGBEK_MAHALLA_ENTITIES } from './data/tashkent-mahallas-mirzo-ulugbek.js';
import { TASHKENT_YANGIHAYOT_MAHALLA_ENTITIES } from './data/tashkent-mahallas-yangihayot.js';
import { TASHKENT_POI_ENTITIES } from './data/tashkent-poi.js';
import { TASHKENT_POI_EXTRA_ENTITIES } from './data/tashkent-poi-extra.js';
import { TASHKENT_RESIDENTIAL_ENTITIES } from './data/tashkent-residential.js';
import { TASHKENT_RESIDENTIAL_EXTRA_ENTITIES } from './data/tashkent-residential-extra.js';
import { SAMARKAND_POI_ENTITIES } from './data/samarkand-poi.js';
import { SAMARKAND_AREA_ENTITIES } from './data/samarkand-areas.js';
import { SAMARKAND_STREET_ENTITIES } from './data/samarkand-streets.js';
import { NAMANGAN_ENTITIES } from './data/namangan.js';
import { ANDIJAN_ENTITIES } from './data/andijan.js';
import { FERGANA_ENTITIES } from './data/fergana.js';
import { BUKHARA_ENTITIES } from './data/bukhara.js';
import { QARSHI_ENTITIES } from './data/qarshi.js';
import { NUKUS_ENTITIES } from './data/nukus.js';
import { URGENCH_ENTITIES } from './data/urgench.js';
import { UZ_SECONDARY_CITY_ANCHORS } from './data/uz-secondary-city-anchors.js';
import { UZ_HERITAGE_ANCHORS } from './data/uz-heritage-anchors.js';
import { UZ_HERITAGE_TRANSPORT_ENTITIES } from './data/uz-heritage-transport.js';
import { UZ_TASHKENT_REGION_CITY_ANCHORS } from './data/uz-tashkent-region-city-anchors.js';
import { UA_ENTITIES } from './data/ua/index.js';
import { LEARNED_ADDRESS_ENTITIES } from './data/learned-addresses.js';
import { validateGeoCatalog } from './validate.js';

const entities = [
  ...CITY_ENTITIES,
  ...TASHKENT_ENTITIES,
  ...TASHKENT_METRO_ENTITIES,
  ...TASHKENT_METRO_EXTRA_ENTITIES,
  ...TASHKENT_METRO_CIRCLE_EXTRA_ENTITIES,
  ...TASHKENT_MICRODISTRICT_ENTITIES,
  ...TASHKENT_MICRODISTRICT_EXTRA_ENTITIES,
  ...TASHKENT_CHILANZAR_11_14_ENTITIES,
  ...TASHKENT_CHILANZAR_15_20_ENTITIES,
  ...TASHKENT_YUNUSABAD_4_9_ENTITIES,
  ...TASHKENT_YUNUSABAD_11_16_ENTITIES,
  ...TASHKENT_YUNUSABAD_17_19_ENTITIES,
  ...TASHKENT_NAMED_MICRODISTRICT_ENTITIES,
  ...TASHKENT_LOCAL_AREA_ENTITIES,
  ...TASHKENT_ALMAZAR_LOCAL_AREA_ENTITIES,
  ...TASHKENT_SHAYKHANTAHUR_LOCAL_AREA_ENTITIES,
  ...TASHKENT_CORE_EXTRA_LOCAL_AREA_ENTITIES,
  ...TASHKENT_MIRZO_ULUGBEK_LOCAL_AREA_ENTITIES,
  ...TASHKENT_TTZ_EXTRA_LOCAL_AREA_ENTITIES,
  ...TASHKENT_YASHNOBOD_LOCAL_AREA_ENTITIES,
  ...TASHKENT_YASHNOBOD_TUZEL_LOCAL_AREA_ENTITIES,
  ...TASHKENT_SERGELI_YANGIHAYOT_LOCAL_AREA_ENTITIES,
  ...TASHKENT_SERGELI_BLOCK_LOCAL_AREA_ENTITIES,
  ...TASHKENT_YANGIDARHAN_LOCAL_AREA_ENTITIES,
  ...TASHKENT_VERIFIED_AREA_ENTITIES,
  ...TASHKENT_MAHALLA_ENTITIES,
  ...TASHKENT_ALMAZAR_EXTRA_MAHALLA_ENTITIES,
  ...TASHKENT_MIRZO_ULUGBEK_MAHALLA_ENTITIES,
  ...TASHKENT_YANGIHAYOT_MAHALLA_ENTITIES,
  ...TASHKENT_POI_ENTITIES,
  ...TASHKENT_POI_EXTRA_ENTITIES,
  ...TASHKENT_RESIDENTIAL_ENTITIES,
  ...TASHKENT_RESIDENTIAL_EXTRA_ENTITIES,
  ...SAMARKAND_POI_ENTITIES,
  ...SAMARKAND_AREA_ENTITIES,
  ...SAMARKAND_STREET_ENTITIES,
  ...NAMANGAN_ENTITIES,
  ...ANDIJAN_ENTITIES,
  ...FERGANA_ENTITIES,
  ...BUKHARA_ENTITIES,
  ...QARSHI_ENTITIES,
  ...NUKUS_ENTITIES,
  ...URGENCH_ENTITIES,
  ...UZ_SECONDARY_CITY_ANCHORS,
  ...UZ_HERITAGE_ANCHORS,
  ...UZ_HERITAGE_TRANSPORT_ENTITIES,
  ...UZ_TASHKENT_REGION_CITY_ANCHORS,
  ...UA_ENTITIES,
  ...LEARNED_ADDRESS_ENTITIES,
];

const validation = validateGeoCatalog(entities);
if (!validation.valid) {
  throw new Error(`Invalid geo catalog:\n${validation.errors.join('\n')}`);
}

export const GEO_ENTITIES = Object.freeze(entities.map((entity) => Object.freeze({
  ...entity,
  center: Object.freeze({ ...entity.center }),
  ...(entity.bbox ? { bbox: Object.freeze({ ...entity.bbox }) } : {}),
  ...(entity.osm ? { osm: Object.freeze({ ...entity.osm }) } : {})
})));

const byId = new Map(GEO_ENTITIES.map((entity) => [entity.id, entity]));
const byLookupKey = new Map(
  GEO_ENTITIES
    .filter((entity) => entity.lookupKey)
    .map((entity) => [entity.lookupKey, entity]),
);

export function getGeoEntity(id) {
  return byId.get(id) ?? null;
}

export function getGeoEntityByLookupKey(lookupKey) {
  return byLookupKey.get(String(lookupKey || '')) ?? null;
}

export function hasGeoEntity(id) {
  return byId.has(id);
}

export function findGeoEntities(filters = {}) {
  const { country, type, parentId } = filters;
  return GEO_ENTITIES.filter((entity) =>
    (!country || entity.country === country) &&
    (!type || entity.type === type) &&
    (parentId === undefined || entity.parentId === parentId)
  );
}

export function getGeoChildren(parentId) {
  return findGeoEntities({ parentId });
}
