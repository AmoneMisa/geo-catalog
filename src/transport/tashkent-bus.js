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

export const TASHKENT_BUS_STOPS = Object.freeze([
  stop('ttz-bus-station', 'TTZ Bus Station', 41.36823, 69.39480, 'way', 98599092, { accuracyM: 220 }),
]);

export const TASHKENT_BUS_ROUTES = Object.freeze([
  Object.freeze({
    id: 'uz:tashkent:route:bus:79',
    type: 'route',
    mode: 'bus',
    country: 'UZ',
    cityId: 'uz:tashkent',
    canonicalName: 'Route 79',
    ref: '79',
    source: 'manual',
    sourceUpdatedAt: '2026-08-18',
    coverage: 'terminals_only',
    terminalNames: Object.freeze(['Beruniy Metro', 'TTZ Bus Station']),
    stopIds: Object.freeze([
      'uz:tashkent:stop:metro:beruniy',
      'uz:tashkent:stop:bus:ttz-bus-station',
    ]),
  }),
]);
