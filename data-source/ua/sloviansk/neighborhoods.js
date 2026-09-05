const neighborhood = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 1200) => Object.freeze({
  id: `ua:sloviansk:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UA',
  canonicalName,
  parentId: 'ua:sloviansk',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
});

export const UA_SLOVIANSK_NEIGHBORHOOD_ENTITIES = Object.freeze([
  neighborhood('cherivkivka', 'Cherivkivka', 48.8246525, 37.6399971, 'node', 4547358438),
  neighborhood('khymik', 'Khymik', 48.8405359, 37.6475395, 'node', 4547358437),
]);
