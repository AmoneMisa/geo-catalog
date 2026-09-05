const neighborhood = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 1200) => Object.freeze({
  id: `ua:ternopil:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UA',
  canonicalName,
  parentId: 'ua:ternopil',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
});

export const UA_TERNOPIL_NEIGHBORHOOD_ENTITIES = Object.freeze([
  neighborhood('bam', 'BAM', 49.5614231, 25.6300925, 'way', 327955988),
  neighborhood('skhidnyi', 'Skhidnyi', 49.5474358, 25.6247386, 'way', 327956511),
  neighborhood('kanada', 'Kanada', 49.5572089, 25.6145756, 'way', 327955583),
  neighborhood('novyi-svit', 'Novyi Svit', 49.5632785, 25.5903125, 'way', 327955093),
  neighborhood('kutkivtsi', 'Kutkivtsi', 49.5626691, 25.5603869, 'way', 327941735),
  neighborhood('tsentr', 'Tsentr', 49.5506426, 25.5951892, 'way', 327955095),
  neighborhood('soniachnyi', 'Soniachnyi', 49.5561935, 25.6430728, 'way', 327956510),
  neighborhood('aliaska', 'Aliaska', 49.5705811, 25.641205, 'way', 327955987),
  neighborhood('proniatyn', 'Proniatyn', 49.5867573, 25.5471588, 'way', 327955094),
  neighborhood('obolonia', 'Obolonia', 49.5412672, 25.5958043, 'way', 327955584),
]);
