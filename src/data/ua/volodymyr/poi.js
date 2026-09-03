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
  poi(
    'st-basil-rotunda',
    'Свято-Василівська церква-ротонда',
    50.841286,
    24.320423,
    50,
    {
      source: 'manual',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:%D0%92%D0%BE%D0%BB%D0%BE%D0%B4%D0%B8%D0%BC%D0%B8%D1%80-%D0%92%D0%BE%D0%BB%D0%B8%D0%BD%D1%81%D1%8C%D0%BA%D0%B8%D0%B9_%D0%92%D0%B0%D1%81%D0%B8%D0%BB%D1%96%D0%B2%D1%81%D1%8C%D0%BA%D0%B0_%D1%86%D0%B5%D1%80%D0%BA%D0%B2%D0%B0.jpg',
    },
  ),
]);
