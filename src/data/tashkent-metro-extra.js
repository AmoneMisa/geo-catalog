const station = (slug, canonicalName, lat, lng, wikidataId, osmId = null) => ({
  id: `uz:tashkent:metro:${slug}`,
  type: 'metro',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent',
  center: { lat, lng },
  source: 'wikidata',
  accuracy: 'entrance',
  accuracyM: 75,
  wikidataId,
  ...(osmId ? { osm: { type: 'node', id: osmId } } : {}),
});

export const TASHKENT_METRO_EXTRA_ENTITIES = Object.freeze([
  station('pushkin', 'Pushkin', 41.32195, 69.3111, 'Q4384777', 1777037922),
  station('ozgarish', 'Ozgarish', 41.2272694, 69.2040389, 'Q12817052', 10538244113),
  station('sergeli', 'Sergeli', 41.22064, 69.20884, 'Q12831211'),
  station('yangihayot', 'Yangihayot', 41.2126889, 69.2146694, 'Q105642828', 10538244119),
  station('dostlik', 'Dostlik', 41.2935389, 69.3226861, 'Q4171201', 1777856012),
  station('turkiston', 'Turkiston', 41.37752, 69.29602, 'Q10276199', 7861940928),
  station('texnopark', 'Texnopark', 41.2945731, 69.3233761, 'Q65160427', 10537927077),
]);
