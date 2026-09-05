const poi = (slug, type, canonicalName, lat, lng, osmType, osmId, accuracyM = 220) => Object.freeze({
  id: `ua:bilhorod-dnistrovskyi:poi:${slug}`,
  type,
  country: 'UA',
  canonicalName,
  parentId: 'ua:bilhorod-dnistrovskyi',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
});

export const UA_BILHOROD_DNISTROVSKYI_POI_ENTITIES = Object.freeze([
  poi('railway-station', 'poi.railway_station', 'Railway Station', 46.1851948, 30.3377667, 'way', 213173299, 160),
  poi('akkerman-fortress', 'poi.fortress', 'Akkerman Fortress', 46.2005105, 30.3491024, 'node', 4309547289, 180),
  poi('dnister-estuary', 'poi', 'Dnister Estuary', 46.2313166, 30.3416059, 'relation', 7252087, 1400),
]);
