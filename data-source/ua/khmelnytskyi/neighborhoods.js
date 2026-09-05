const neighborhood = (slug, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:khmelnytskyi:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UA',
  canonicalName,
  parentId: 'ua:khmelnytskyi',
  center: Object.freeze({ lat, lng }),
  source: extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : extra.source ?? 'manual',
  accuracy: 'neighborhood',
  accuracyM,
  ...extra,
});

export const UA_KHMELNYTSKYI_NEIGHBORHOOD_ENTITIES = Object.freeze([
  neighborhood('hrechany', 'Гречани', 49.4345113, 26.9580413, 1500, { osm: Object.freeze({ type: 'node', id: 506819093 }) }),
  neighborhood('rakove', 'Ракове', 49.3969687, 27.0539644, 1500, { osm: Object.freeze({ type: 'node', id: 506819097 }) }),
  neighborhood('ozerna', 'Озерна', 49.4538128, 27.0072419, 1500, { osm: Object.freeze({ type: 'node', id: 506819095 }) }),
  neighborhood('pivdenno-zakhidnyi', 'Південно-Західний', 49.4096123, 26.9553738, 1700, { osm: Object.freeze({ type: 'node', id: 506819099 }), wikidataId: 'Q12145807' }),
  neighborhood('dubove', 'Дубове', 49.40787, 26.99032, 1500, { osm: Object.freeze({ type: 'node', id: 506819098 }) }),
  neighborhood('knyzhkivtsi', 'Книжківці', 49.39162, 27.03814, 1500, { osm: Object.freeze({ type: 'node', id: 735668822 }) }),
  neighborhood('ruzhychna', 'Ружична', 49.38702, 26.95415, 1600, { osm: Object.freeze({ type: 'node', id: 2853030840 }) }),
  neighborhood('lezneve', 'Лезневе', 49.4307136, 27.0486541, 1700, { osm: Object.freeze({ type: 'node', id: 506819096 }) }),
  neighborhood('zarichchia', 'Заріччя', 49.44179, 26.98003, 1400, { osm: Object.freeze({ type: 'node', id: 4045996626 }) }),
  neighborhood('vystavka', 'Виставка', 49.436978, 26.9983091, 1600, { osm: Object.freeze({ type: 'node', id: 506819094 }) }),
  neighborhood('blyzhni-hrechany', 'Ближні Гречани', 49.431757, 26.953121, 1700, { source: 'manual', sourceUrl: 'https://maps.visicom.ua/c/26.953120954999%2C49.431756963049594%2C12/f/HSTOI?lang=uk' }),
  neighborhood('dalni-hrechany', 'Дальні Гречани', 49.4459802, 26.9301543, 1800, { osm: Object.freeze({ type: 'node', id: 5921329130 }) }),
  neighborhood('stare-misto', 'Старе місто', 49.4286833, 26.9744012, 1200, { osm: Object.freeze({ type: 'node', id: 6655901662 }) }),
]);
