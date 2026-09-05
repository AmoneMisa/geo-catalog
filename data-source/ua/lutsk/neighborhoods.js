const neighborhood = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 1200) => Object.freeze({
  id: `ua:lutsk:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UA',
  canonicalName,
  parentId: 'ua:lutsk',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
});

export const UA_LUTSK_NEIGHBORHOOD_ENTITIES = Object.freeze([
  neighborhood('zavokzalnyi', 'Zavokzalnyi', 50.7587297, 25.3577009, 'node', 2539747519),
  neighborhood('vyshkiv', 'Vyshkiv', 50.7694246, 25.3355038, 'node', 2539717775),
  neighborhood('veresneve', 'Veresneve', 50.6975646, 25.3029775, 'node', 2539717761),
  neighborhood('hnidava', 'Hnidava', 50.7249907, 25.3055171, 'node', 2539724974),
  neighborhood('kichkarivka', 'Kichkarivka', 50.749981, 25.300129, 'node', 2539737169),
  neighborhood('lpz', 'LPZ', 50.7179221, 25.3110791, 'node', 6575105898, 900),
]);
