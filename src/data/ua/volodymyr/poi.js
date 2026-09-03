const poi = (slug, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:volodymyr:poi:${slug}`,
  type: 'poi.landmark',
  country: 'UA',
  canonicalName,
  parentId: 'ua:volodymyr',
  center: Object.freeze({ lat, lng }),
  source: extra.source ?? (extra.osm ? 'osm' : 'manual'),
  accuracy: 'poi',
  accuracyM,
  ...extra,
});

export const VOLODYMYR_POIS = Object.freeze([
  poi(
    'historical-museum',
    'Володимирський історичний музей імені Омеляна Дверницького',
    50.848072,
    24.318605,
    100,
    {
      source: 'manual',
      sourceUrl: 'https://www.coe.int/en/web/cultural-routes/-/history-museum-of-volodymyr-volynskyi',
    },
  ),
  poi('dytynets', 'Volodymyr dytynets', 50.84332, 24.31772, 100, {
    source: 'osm',
    osm: Object.freeze({ type: 'node', id: 10814228359 }),
    wikidataId: 'Q65172296',
  }),
  poi(
    'joachim-and-anne-church',
    'Костел святих Йоакима та Анни',
    50.8470547,
    24.3195355,
    50,
    {
      source: 'manual',
      sourceUrl: 'https://zabytki.in.ua/service/uk/location/object/718',
    },
  ),
  poi('dormition-cathedral', 'Свято-Успенський кафедральний собор', 50.841111, 24.320278, 50, {
    source: 'osm',
    osm: Object.freeze({ type: 'way', id: 145439183 }),
    wikidataId: 'Q4478056',
  }),
]);
