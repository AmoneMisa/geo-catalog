const neighborhood = (slug, canonicalName, lat, lng, osmNodeId, wikidataId = null) => Object.freeze({
  id: `ua:zhytomyr:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UA',
  canonicalName,
  parentId: 'ua:zhytomyr',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM: 900,
  osm: Object.freeze({ type: 'node', id: osmNodeId }),
  ...(wikidataId ? { wikidataId } : {}),
});

// Listing-facing Zhytomyr localities with independent OSM place nodes.
// Ambiguous aggregate names (for example Polova or Smolianka) stay out until
// one parser canonical can be bound to one physical owner without guessing.
export const UA_ZHYTOMYR_NEIGHBORHOOD_ENTITIES = Object.freeze([
  neighborhood('korbutivka', 'Korbutivka', 50.24207, 28.62222, 8328164724, 'Q16702588'),
  neighborhood('khmilnyky', 'Khmilnyky', 50.27427, 28.63316, 8796142617),
  neighborhood('sokolova-hora', 'Sokolova Hora', 50.29307, 28.61981, 8328164720, 'Q55609173'),
  neighborhood('putiatynka', 'Putiatynka', 50.25176, 28.69278, 8328164732, 'Q105487774'),
]);
