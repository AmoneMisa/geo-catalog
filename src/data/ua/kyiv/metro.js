const metro = (slug, canonicalName, lat, lng, osmId) => Object.freeze({
  id: `ua:kyiv:metro:${slug}`,
  type: 'metro',
  country: 'UA',
  canonicalName,
  parentId: 'ua:kyiv',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'poi',
  accuracyM: 80,
  osm: Object.freeze({ type: 'node', id: osmId }),
});

export const UA_KYIV_METRO_ENTITIES = Object.freeze([
  metro('khreshchatyk', 'Khreshchatyk', 50.4471871, 30.5229456, 9151108492),
  metro('vokzalna', 'Vokzalna', 50.4416401, 30.4882512, 3806369598),
  metro('maidan-nezalezhnosti', 'Maidan Nezalezhnosti', 50.4499356, 30.5244408, 9151090552),
  metro('zoloti-vorota', 'Zoloti Vorota', 50.4482462, 30.5134785, 7160992960),
  metro('universytet', 'Universytet', 50.4442469, 30.5058928, 3806362030),
  metro('palats-ukraina', 'Palats Ukraina', 50.4206817, 30.5213092, 7247486081),
  metro('olimpiiska', 'Olimpiiska', 50.4322821, 30.5164035, 10726000867),
  metro('osokorky', 'Osokorky', 50.3951862, 30.6162493, 5267935780),
  metro('lukianivska', 'Lukianivska', 50.4623623, 30.4818047, 10726245822),
]);
