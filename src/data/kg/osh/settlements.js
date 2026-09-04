const settlement = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 1200) => Object.freeze({
  id: `kg:osh:settlement:${slug}`,
  type: 'settlement',
  country: 'KG',
  canonicalName,
  parentId: 'kg:osh',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/${osmType}/${osmId}`,
  accuracy: 'settlement',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
});

// These villages are administered by Osh city according to the current municipal
// territorial structure. OSM is retained as the spatial source for their centers.
export const KG_OSH_SETTLEMENT_ENTITIES = Object.freeze([
  settlement('kenesh', 'Кеңеш', 40.4913586, 72.7085400, 'relation', 19062463, 1300),
  settlement('kerme-too', 'Керме-Тоо', 40.5105276, 72.7152939, 'relation', 19062465, 1300),
  settlement('ozgur', 'Озгур', 40.4503384, 72.8545544, 'relation', 19062572, 1400),
  settlement('orke', 'Орке', 40.4834323, 72.7287003, 'way', 448298178, 1100),
  settlement('pyatiletka', 'Пятилетка', 40.4903266, 72.8124640, 'node', 7054522032, 1200),
  settlement('teeke', 'Тээке', 40.4726848, 72.7129986, 'way', 448298172, 1200),
  settlement('uchar', 'Учар', 40.4739583, 72.7765615, 'way', 448298182, 1200),
  settlement('ak-buura-2', 'Ак-Буура-2', 40.4907787, 72.7773582, 'way', 448298181, 1000),
  settlement('ak-buura-3', 'Ак-Буура-3', 40.5101500, 72.7780300, 'node', 12798433809, 900),
]);
