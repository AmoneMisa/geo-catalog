const osmResidential = (slug, canonicalName, lat, lng, osmWayId, accuracyM = 100) => ({
  id: `uz:tashkent:residential:${slug}`,
  type: 'residential_complex',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'building',
  accuracyM,
  osm: { type: 'way', id: osmWayId },
});

const sourcedResidential = (slug, canonicalName, lat, lng, sourceUrl, accuracyM = 180) => ({
  id: `uz:tashkent:residential:${slug}`,
  type: 'residential_complex',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent',
  center: { lat, lng },
  source: 'manual',
  accuracy: 'building',
  accuracyM,
  sourceUrl,
});

export const TASHKENT_RESIDENTIAL_EXTRA_ENTITIES = Object.freeze([
  osmResidential('nrg-u-tower', 'NRG U-Tower', 41.31104, 69.23932, 1075340743, 90),
  osmResidential('nrg-oybek', 'NRG Oybek', 41.29354, 69.28185, 1126838984, 90),
  sourcedResidential('assalom-sohil', 'Assalom Sohil', 41.282995, 69.30842, 'https://yandex.com/maps/10335/tashkent/geo/4098449809/', 140),
  sourcedResidential('xon-saroy', 'Xon Saroy', 41.373056, 69.315705, 'https://yandex.com/maps/10335/tashkent/geo/4859874576/', 160),
  sourcedResidential('infinity', 'Infinity', 41.3025714, 69.2889718, 'https://infinity.gh.uz/', 220),
]);
