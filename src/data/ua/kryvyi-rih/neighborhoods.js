const neighborhood = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 1200) => Object.freeze({
  id: `ua:kryvyi-rih:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UA',
  canonicalName,
  parentId: 'ua:kryvyi-rih',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
});

export const UA_KRYVYI_RIH_NEIGHBORHOOD_ENTITIES = Object.freeze([
  neighborhood('95-kvartal', '95 Kvartal', 47.9100115, 33.3953978, 'way', 124897028, 1000),
  neighborhood('sotsmisto', 'Sotsmisto', 47.9001282, 33.3992878, 'node', 5001108365, 1500),
  neighborhood('skhidnyi', 'Skhidnyi', 47.9481322, 33.4555126, 'node', 13701134152, 1200),
  neighborhood('zarichnyi', 'Zarichnyi', 47.9974191, 33.4803924, 'node', 13135135126, 1600),
  neighborhood('hirnytskyi', 'Hirnytskyi', 47.9630073, 33.4559889, 'way', 648167098, 1100),
]);
