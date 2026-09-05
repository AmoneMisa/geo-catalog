import { getGeoChildren } from '../catalog.js';
import metroShapeRows from './generated/tashkent-metro-osm-shapes.js';

const TASHKENT_METRO_ENTITIES = getGeoChildren('uz:tashkent', { type: 'metro' });

const stopId = (stationId) => stationId.replace(':metro:', ':stop:metro:');

const METRO_SHAPES_BY_SLUG = new Map(metroShapeRows.map((row) => [row[0], row]));
const freezeMultiLine = (segments) => Object.freeze(segments.map((segment) =>
  Object.freeze(segment.map(([lng, lat]) => Object.freeze([lng, lat]))),
));

export const TASHKENT_METRO_STOPS = Object.freeze(TASHKENT_METRO_ENTITIES.map((station) => Object.freeze({
  id: stopId(station.id),
  type: 'stop',
  mode: 'metro',
  country: station.country,
  cityId: 'uz:tashkent',
  canonicalName: station.canonicalName,
  center: Object.freeze({ ...station.center }),
  geoEntityId: station.id,
  source: station.source,
  accuracy: station.accuracy,
  accuracyM: station.accuracyM,
  ...(station.osm ? { osm: Object.freeze({ ...station.osm }) } : {}),
  ...(station.wikidataId ? { wikidataId: station.wikidataId } : {}),
})));

const route = (slug, canonicalName, ref, stationSlugs) => {
  const shapeRow = METRO_SHAPES_BY_SLUG.get(slug);
  if (!shapeRow) throw new Error(`Missing OSM geometry for Tashkent metro line ${slug}.`);
  const [, relationId, segments, [west, south, east, north]] = shapeRow;

  return Object.freeze({
    id: `uz:tashkent:route:metro:${slug}`,
    type: 'route',
    mode: 'metro',
    country: 'UZ',
    cityId: 'uz:tashkent',
    canonicalName,
    ref,
    source: 'manual',
    sourceUpdatedAt: '2026-01-03',
    coverage: 'full',
    stopIds: Object.freeze(stationSlugs.map((stationSlug) => `uz:tashkent:stop:metro:${stationSlug}`)),
    osm: Object.freeze({ type: 'relation', id: relationId }),
    geometry: Object.freeze({
      type: 'MultiLineString',
      coordinates: freezeMultiLine(segments),
    }),
    bounds: Object.freeze({ west, south, east, north }),
    geometrySource: 'osm',
    geometryUpdatedAt: '2026-08-30',
  });
};

export const TASHKENT_METRO_ROUTES = Object.freeze([
  route('chilonzor', 'Chilonzor Line', 'Chilonzor', [
    'buyuk-ipak-yoli','pushkin','hamid-olimjon','amir-temur-xiyoboni','mustaqillik-maydoni','paxtakor','xalqlar-dostligi','milliy-bog','novza','mirzo-ulugbek','chilonzor','olmazor','choshtepa','ozgarish','sergeli','yangihayot','chinor',
  ]),
  route('ozbekiston', "O'zbekiston Line", "O'zbekiston", [
    'beruniy','tinchlik','chorsu','gafur-gulom','alisher-navoi','ozbekiston','kosmonavtlar','oybek','toshkent','mashinasozlar','dostlik',
  ]),
  route('yunusobod', 'Yunusobod Line', 'Yunusobod', [
    'turkiston','yunusobod','shahriston','bodomzor','minor','abdulla-qodiriy','yunus-rajabiy','ming-orik',
  ]),
  route('circle', 'Circle Line', 'Circle', [
    'texnopark','yashnobod','tuzel','olmos','rohat','yangiobod','qoyliq','matonat','qiyot','tolariq','xonobod','quruvchilar','turon','qipchoq',
  ]),
]);

const transfer = (a, b) => Object.freeze({
  id: `uz:tashkent:transfer:${a}:${b}`,
  type: 'transfer',
  mode: 'walk',
  country: 'UZ',
  cityId: 'uz:tashkent',
  stopIds: Object.freeze([
    `uz:tashkent:stop:metro:${a}`,
    `uz:tashkent:stop:metro:${b}`,
  ]),
  source: 'manual',
});

export const TASHKENT_METRO_TRANSFERS = Object.freeze([
  transfer('amir-temur-xiyoboni', 'yunus-rajabiy'),
  transfer('paxtakor', 'alisher-navoi'),
  transfer('oybek', 'ming-orik'),
  transfer('dostlik', 'texnopark'),
]);
