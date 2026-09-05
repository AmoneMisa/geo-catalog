const osmLocalArea = (slug, canonicalName, parentId, lat, lng, osmType, osmId, accuracyM = 700) => ({
  id: `uz:tashkent:local-area:${slug}`,
  type: 'local_area',
  country: 'UZ',
  canonicalName,
  parentId,
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

const manualLocalArea = (slug, canonicalName, parentId, lat, lng, accuracyM) => ({
  id: `uz:tashkent:local-area:${slug}`,
  type: 'local_area',
  country: 'UZ',
  canonicalName,
  parentId,
  center: { lat, lng },
  source: 'manual',
  accuracy: 'approximate',
  accuracyM,
});

const YANGIHAYOT = 'uz:tashkent:yangihayot';

export const TASHKENT_SERGELI_YANGIHAYOT_LOCAL_AREA_ENTITIES = Object.freeze([
  osmLocalArea('yangi-sergeli', 'Yangi Sergeli', 'uz:tashkent:sergeli', 41.2228385, 69.2252417, 'way', 516431539, 760),
  osmLocalArea('uzgarish', 'Uzgarish', 'uz:tashkent:sergeli', 41.2511102, 69.2239233, 'way', 82881043, 900),
  // The official Tashkent toponymic reference defines Sug'diyona mahalla and Sug'diyona mavzesi as separate identities and places the 2023 mavze inside the mahalla. Reuse the conservative mahalla representative point without claiming a mavze OSM owner.
  manualLocalArea('sugdiyona', "Sug'diyona", 'uz:tashkent:sergeli', 41.223284, 69.235013, 1500),

  // Current Yo'ldosh (Sputnik) residential dahas. Prefer explicit residential
  // relations from the enrichment discovery; use the direct neighbourhood node
  // only where the report did not expose a separate area relation.
  osmLocalArea('yoldosh-1', "Yo'ldosh-1", YANGIHAYOT, 41.2009563, 69.2143167, 'relation', 1866494, 520),
  osmLocalArea('yoldosh-2', "Yo'ldosh-2", YANGIHAYOT, 41.203734, 69.2210467, 'relation', 1866492, 520),
  osmLocalArea('yoldosh-3', "Yo'ldosh-3", YANGIHAYOT, 41.2055862, 69.2255331, 'relation', 1959145, 520),
  osmLocalArea('yoldosh-4', "Yo'ldosh-4", YANGIHAYOT, 41.2065619, 69.2299765, 'node', 1868248384, 650),
  osmLocalArea('yoldosh-5', "Yo'ldosh-5", YANGIHAYOT, 41.197868, 69.2165409, 'relation', 1959147, 520),
  osmLocalArea('yoldosh-6', "Yo'ldosh-6", YANGIHAYOT, 41.201051, 69.2242887, 'relation', 1959148, 520),
  osmLocalArea('yoldosh-7', "Yo'ldosh-7", YANGIHAYOT, 41.2039082, 69.2278456, 'relation', 1959350, 520),
  osmLocalArea('yoldosh-8', "Yo'ldosh-8", YANGIHAYOT, 41.1946028, 69.2188351, 'relation', 1866493, 520),
  osmLocalArea('yoldosh-9', "Yo'ldosh-9", YANGIHAYOT, 41.1974034, 69.2255718, 'relation', 1866495, 520),
  osmLocalArea('yoldosh-10', "Yo'ldosh-10", YANGIHAYOT, 41.2013532, 69.2275858, 'relation', 1959342, 520),
  osmLocalArea('yoldosh-11', "Yo'ldosh-11", YANGIHAYOT, 41.1978483, 69.2292467, 'relation', 1959343, 520),
  osmLocalArea('yoldosh-12', "Yo'ldosh-12", YANGIHAYOT, 41.1922792, 69.2205246, 'relation', 1959344, 520),
  osmLocalArea('yoldosh-13', "Yo'ldosh-13", YANGIHAYOT, 41.193661, 69.2239153, 'relation', 1959345, 520),
  osmLocalArea('yoldosh-14', "Yo'ldosh-14", YANGIHAYOT, 41.1950438, 69.2272923, 'relation', 1959346, 520),
  osmLocalArea('yoldosh-15', "Yo'ldosh-15", YANGIHAYOT, 41.1931674, 69.2160924, 'node', 13241688708, 650),
  osmLocalArea('yoldosh-16', "Yo'ldosh-16", YANGIHAYOT, 41.1991891, 69.2095847, 'node', 1868248364, 650),
  osmLocalArea('yoldosh-16a', "Yo'ldosh-16A", YANGIHAYOT, 41.1964697, 69.2049969, 'node', 13241688680, 650),
  osmLocalArea('yoldosh-17', "Yo'ldosh-17", YANGIHAYOT, 41.1963243, 69.2116236, 'node', 1868248368, 650),
  osmLocalArea('yoldosh-c1', "Yo'ldosh-C1", YANGIHAYOT, 41.2023375, 69.2176894, 'relation', 1959347, 520),
  osmLocalArea('yoldosh-c2', "Yo'ldosh-C2", YANGIHAYOT, 41.1996599, 69.2209183, 'relation', 1959348, 520),
  osmLocalArea('yoldosh-c3', "Yo'ldosh-C3", YANGIHAYOT, 41.1960268, 69.2222363, 'relation', 1959349, 520),
]);
