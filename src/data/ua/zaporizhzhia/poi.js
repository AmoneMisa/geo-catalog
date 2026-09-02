const poi = (slug, type, canonicalName, lat, lng, osmType, osmId, accuracyM = 220) => Object.freeze({
  id: `ua:zaporizhzhia:poi:${slug}`,
  type,
  country: 'UA',
  canonicalName,
  parentId: 'ua:zaporizhzhia',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
});

export const UA_ZAPORIZHZHIA_POI_ENTITIES = Object.freeze([
  poi('dniprohes', 'poi.power_plant', 'DniproHES', 47.8678685, 35.089358, 'way', 113308943, 500),
  poi('dubovyi-hai', 'poi.park', 'Dubovyi Hai', 47.8080335, 35.1689766, 'way', 248037388, 900),
  poi('voznesenivskyi-park', 'poi.park', 'Voznesenivskyi Park', 47.8355349, 35.1193096, 'relation', 8332464, 700),
  poi('peremoha-park', 'poi.park', 'Peremoha Park', 47.8285881, 35.1472147, 'way', 154243282, 650),
  poi('festivalna-square', 'poi.square', 'Festivalna Square', 47.8385119, 35.138635, 'way', 162940197, 220),
  poi('city-mall', 'poi.shopping_mall', 'City Mall', 47.8183818, 35.1569137, 'way', 199519495, 180),
  poi('ukraine-mall', 'poi.shopping_mall', 'Ukraine Mall', 47.8425486, 35.1310472, 'way', 60908531, 180),
]);
