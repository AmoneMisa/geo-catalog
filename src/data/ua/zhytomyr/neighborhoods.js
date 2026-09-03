const neighborhood = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 900, extra = {}) => Object.freeze({
  id: `ua:zhytomyr:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UA',
  canonicalName,
  parentId: 'ua:zhytomyr',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
  ...extra,
});

// Listing-facing Zhytomyr localities with independent OSM physical owners.
// Ambiguous canonicals such as Polova and Kroshnia stay out until one parser
// canonical can be bound to one owner without guessing.
export const UA_ZHYTOMYR_NEIGHBORHOOD_ENTITIES = Object.freeze([
  neighborhood('korbutivka', 'Korbutivka', 50.24207, 28.62222, 'node', 8328164724, 900, { wikidataId: 'Q16702588' }),
  neighborhood('khmilnyky', 'Khmilnyky', 50.27427, 28.63316, 'node', 8796142617),
  neighborhood('sokolova-hora', 'Sokolova Hora', 50.29307, 28.61981, 'node', 8328164720, 900, { wikidataId: 'Q55609173' }),
  neighborhood('putiatynka', 'Putiatynka', 50.25176, 28.69278, 'node', 8328164732, 900, { wikidataId: 'Q105487774' }),
  neighborhood('bohuniia', 'Bohuniia', 50.2797959, 28.6105738, 'relation', 12196948, 1300),
  neighborhood('malovanka', 'Malovanka', 50.2542056, 28.6344627, 'relation', 12196950, 1200),
  neighborhood('smolianka', 'Smolianka', 50.2367981, 28.6949826, 'relation', 15569479, 1200),
  neighborhood('tsentr', 'Tsentr', 50.2561821, 28.6629095, 'relation', 12916486, 1300),
  neighborhood('marianivka', 'Marianivka', 50.2791733, 28.7008954, 'relation', 12196939, 1200),
  neighborhood('skhidnyi', 'Skhidnyi', 50.2440416, 28.70526, 'relation', 12196935, 1200),
  neighborhood('promavtomatyka', 'Promavtomatyka', 50.2588522, 28.7016532, 'relation', 12196965, 1000),
]);
