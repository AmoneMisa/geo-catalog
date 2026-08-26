const station = (citySlug, slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 120) => ({
  id: `uz:${citySlug}:poi:${slug}`,
  type: 'poi',
  country: 'UZ',
  canonicalName,
  parentId: `uz:${citySlug}`,
  center: { lat, lng },
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

export const UZ_TAIL_RAILWAY_ENTITIES = Object.freeze([
  station('yangiyer', 'yangiyer-railway-station', 'Yangiyer Railway Station', 40.29627, 68.82489, 'node', 8343455277),
  station('khojeyli', 'xojeli-railway-station', 'Xojeli Railway Station', 42.40482, 59.43686, 'node', 1584762347),
  station('kungrad', 'kungrad-railway-station', 'Kungrad Railway Station', 43.04096, 58.84155, 'way', 438257918),
  station('turtkul', 'turtkul-railway-station', 'Turtkul Railway Station', 41.57057, 61.03238, 'node', 1592362133),
]);
