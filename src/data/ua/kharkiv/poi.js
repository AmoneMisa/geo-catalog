const poi = (slug, canonicalName, lat, lng, accuracyM, sourceUrl) => Object.freeze({
  id: `ua:kharkiv:poi:${slug}`,
  type: 'poi.shopping_mall',
  country: 'UA',
  canonicalName,
  parentId: 'ua:kharkiv',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  accuracy: 'poi',
  accuracyM,
  sourceUrl,
});

export const UA_KHARKIV_POI_ENTITIES = Object.freeze([
  poi('nikolsky', 'Nikolsky', 49.99159, 36.23518, 120, 'https://mapcarta.com/W151347688'),
  poi('karavan', 'Karavan', 50.029047, 36.328194, 180, 'https://kharkov.wiki/buildings/73397/'),
]);
