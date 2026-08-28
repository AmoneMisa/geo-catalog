const neighborhood = (slug, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:vinnytsia:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UA',
  canonicalName,
  parentId: 'ua:vinnytsia',
  center: Object.freeze({ lat, lng }),
  source: extra.source ?? (extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : 'manual'),
  accuracy: 'neighborhood',
  accuracyM,
  ...extra,
});

export const UA_VINNYTSIA_NEIGHBORHOOD_ENTITIES = Object.freeze([
  neighborhood('tsentr', 'Tsentr', 49.23257, 28.46868, 1200, { osm: Object.freeze({ type: 'node', id: 4791371903 }) }),
  neighborhood('stare-misto', 'Stare Misto', 49.21878, 28.4939, 1600, { osm: Object.freeze({ type: 'node', id: 4791371904 }) }),
  neighborhood('zamostia', 'Zamostia', 49.24242, 28.4946, 1800, { osm: Object.freeze({ type: 'node', id: 4791371905 }), wikidataId: 'Q12105764' }),
  neighborhood('vyshenka', 'Vyshenka', 49.22811, 28.41301, 1800, { osm: Object.freeze({ type: 'node', id: 4791371907 }), wikidataId: 'Q4112621' }),
  neighborhood('podillia', 'Podillia', 49.21913, 28.44481, 1400, { osm: Object.freeze({ type: 'node', id: 4791371908 }), wikidataId: 'Q16711953' }),
  neighborhood('piatnychany', 'Piatnychany', 49.24966, 28.46205, 1700, { osm: Object.freeze({ type: 'node', id: 4791371906 }), wikidataId: 'Q16710653' }),
  neighborhood('tyazhyliv', 'Tyazhyliv', 49.24981, 28.53836, 1800, { osm: Object.freeze({ type: 'node', id: 3531782537 }), wikidataId: 'Q12163143' }),
  neighborhood('khutir-shevchenka', 'Khutir Shevchenka', 49.25857, 28.5204, 1300, { osm: Object.freeze({ type: 'node', id: 5318406101 }) }),
  neighborhood('akademichnyi', 'Akademichnyi', 49.20571, 28.42199, 1200, { osm: Object.freeze({ type: 'node', id: 11237948239 }) }),
  neighborhood('sabariv', 'Sabariv', 49.19738, 28.45114, 1700, { osm: Object.freeze({ type: 'node', id: 4845144837 }), wikidataId: 'Q12149926' }),
  neighborhood('pyrohovo', 'Pyrohovo', 49.21588, 28.39345, 1700, { source: 'manual', sourceUrl: 'https://mapcarta.com/13740060' }),
]);
