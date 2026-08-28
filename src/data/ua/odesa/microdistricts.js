const microdistrict = (slug, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:odesa:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UA',
  canonicalName,
  parentId: extra.parentId ?? 'ua:odesa',
  center: Object.freeze({ lat, lng }),
  source: extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : extra.source ?? 'manual',
  accuracy: extra.accuracy ?? 'neighborhood',
  accuracyM,
  ...extra,
});

export const UA_ODESA_MICRODISTRICT_ENTITIES = Object.freeze([
  microdistrict('arkadia', 'Arkadia', 46.43179, 30.76083, 1300, {
    parentId: 'ua:odesa:district:prymorskyi',
    osm: Object.freeze({ type: 'node', id: 2151201619 }),
    wikidataId: 'Q2081578',
  }),
  microdistrict('velykyi-fontan', 'Velykyi Fontan', 46.39475, 30.74603, 2200, {
    parentId: 'ua:odesa:district:kyivskyi',
    osm: Object.freeze({ type: 'node', id: 3901671563 }),
    wikidataId: 'Q4092923',
  }),
  microdistrict('lanzheron', 'Lanzheron', 46.47434, 30.75929, 900, {
    parentId: 'ua:odesa:district:prymorskyi',
    osm: Object.freeze({ type: 'node', id: 2151206626 }),
  }),
  microdistrict('serednii-fontan', 'Serednii Fontan', 46.41252, 30.75456, 1600, {
    parentId: 'ua:odesa:district:kyivskyi',
    osm: Object.freeze({ type: 'node', id: 2151201621 }),
    wikidataId: 'Q28706753',
  }),
  microdistrict('sakhalinchyk', 'Sakhalinchyk', 46.45795, 30.73382, 900, {
    parentId: 'ua:odesa:district:prymorskyi',
    osm: Object.freeze({ type: 'node', id: 3902658921 }),
    wikidataId: 'Q4409422',
  }),
  microdistrict('otrada', 'Otrada', 46.466667, 30.755556, 500, {
    parentId: 'ua:odesa:district:prymorskyi',
    source: 'manual',
    accuracy: 'neighborhood',
    sourceUrl: 'https://cyclowiki.org/wiki/%D0%9E%D1%82%D1%80%D0%B0%D0%B4%D0%B0_%28%D1%80%D0%B0%D0%B9%D0%BE%D0%B4%D0%B5%D1%81%D1%81%D1%8B%29',
  }),
]);
