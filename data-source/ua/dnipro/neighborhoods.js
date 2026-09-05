const neighborhood = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 1300) => Object.freeze({
  id: `ua:dnipro:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UA',
  canonicalName,
  parentId: 'ua:dnipro',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
});

export const UA_DNIPRO_NEIGHBORHOOD_ENTITIES = Object.freeze([
  neighborhood('odynkivka', 'Odynkivka', 48.4963102, 35.1933272, 'way', 973162877, 1500),
  neighborhood('pokrovskyi', 'Pokrovskyi', 48.4817478, 34.9198165, 'relation', 13309107, 1500),
  neighborhood('parus', 'Parus', 48.4787013, 34.9088653, 'relation', 3688209, 1500),
]);
