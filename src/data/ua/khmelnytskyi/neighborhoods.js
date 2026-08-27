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
  neighborhood('hrechany', 'Гречани', 49.44287, 26.93858, 1600, { source: 'manual', sourceUrl: 'https://mapcarta.com/13762004', geonamesId: '708163' }),
  neighborhood('rakove', 'Ракове', 49.39697, 27.05396, 1600, { source: 'manual', sourceUrl: 'https://mapcarta.com/39608434' }),
  neighborhood('ozerna', 'Озерна', 49.4452, 27.0045, 1500, { source: 'manual', sourceUrl: 'https://maps.visicom.ua/i/ADR3KH6BB7VHJCH5PF' }),
  neighborhood('pivdenno-zakhidnyi', 'Південно-Західний', 49.40961, 26.95537, 1700, { osm: Object.freeze({ type: 'node', id: 506819099 }), wikidataId: 'Q12145807' }),
  neighborhood('dubove', 'Дубове', 49.40787, 26.99032, 1500, { osm: Object.freeze({ type: 'node', id: 506819098 }) }),
  neighborhood('knyzhkivtsi', 'Книжківці', 49.39162, 27.03814, 1500, { osm: Object.freeze({ type: 'node', id: 735668822 }) }),
  neighborhood('ruzhychna', 'Ружична', 49.38702, 26.95415, 1600, { osm: Object.freeze({ type: 'node', id: 2853030840 }) }),
  neighborhood('lezneve', 'Лезневе', 49.42843, 27.0536, 1800, { source: 'manual', sourceUrl: 'https://mapcarta.com/13751876', geonamesId: '703099' }),
  neighborhood('zarichchia', 'Заріччя', 49.44179, 26.98003, 1400, { osm: Object.freeze({ type: 'node', id: 4045996626 }) }),
]);
