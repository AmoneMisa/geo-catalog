const station = (citySlug, slug, canonicalName, lat, lng, osmId, accuracyM = 120) => ({
  id: `uz:${citySlug}:poi:${slug}`,
  type: 'poi',
  country: 'UZ',
  canonicalName,
  parentId: `uz:${citySlug}`,
  center: { lat, lng },
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: { type: 'node', id: osmId },
});

export const UZ_P3_TRANSPORT_ENTITIES = Object.freeze([
  station('yangiyol', 'yangiyol-railway-station', 'Yangiyol Railway Station', 41.11678, 69.06075, 2209501413),
  station('chust', 'chust-railway-station', 'Chust Railway Station', 40.88312, 71.24116, 1587386149),
  station('yangiyer', 'yangiyer-railway-station', 'Yangiyer Railway Station', 40.29627, 68.82489, 8343455277),
  station('margilan', 'margilan-railway-station', 'Margilan Railway Station', 40.44258, 71.72309, 246213673),
  station('kokand', 'kokand-railway-station', 'Kokand Railway Station', 40.51901, 70.92847, 1587385859),
  station('kungrad', 'kungrad-railway-station', 'Kungrad Railway Station', 43.04077, 58.84135, 1583746274),
  station('turtkul', 'turtkul-railway-station', 'Turtkul Railway Station', 41.57057, 61.03238, 1592362133),
]);
