const neighborhood = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 1100) => Object.freeze({
  id: `ua:uzhhorod:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UA',
  canonicalName,
  parentId: 'ua:uzhhorod',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
});

export const UA_UZHHOROD_NEIGHBORHOOD_ENTITIES = Object.freeze([
  neighborhood('bozdosh', 'Bozdosh', 48.6162708, 22.2664035, 'node', 6516279720),
  neighborhood('radanka', 'Radanka', 48.6150437, 22.3166274, 'node', 2829667632),
  neighborhood('tsentr', 'Tsentr', 48.6236648, 22.2989735, 'node', 7785727318),
  neighborhood('bam', 'BAM', 48.6392828, 22.2858729, 'node', 2829667629),
  neighborhood('chervenytsia', 'Chervenytsia', 48.6453475, 22.2802683, 'node', 2827318564),
  neighborhood('domanyntsi', 'Domanyntsi', 48.6354744, 22.3257721, 'relation', 12940458),
  neighborhood('kompotnyi', 'Kompotnyi', 48.6288945, 22.2624466, 'node', 7785727323),
]);
