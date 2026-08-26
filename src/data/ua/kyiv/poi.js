const poi = (slug, type, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:kyiv:poi:${slug}`,
  type,
  country: 'UA',
  canonicalName,
  parentId: 'ua:kyiv',
  center: Object.freeze({ lat, lng }),
  source: extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : 'manual',
  accuracy: 'poi',
  accuracyM,
  ...extra,
});

export const UA_KYIV_POI_ENTITIES = Object.freeze([
  poi('taras-shevchenko-park', 'poi.park', 'Парк Тараса Шевченка', 50.44133, 30.51143, 350, { wikidataId: 'Q4441787' }),
  poi('mariinsky-park', 'poi.park', 'Маріїнський парк', 50.44755, 30.54184, 500, { wikidataId: 'Q2737272' }),
  poi('eternal-glory-park', 'poi.park', 'Парк Вічної Слави', 50.43895, 30.55356, 450, { wikidataId: 'Q4343817' }),
  poi('holosiivskyi-park', 'poi.park', 'Голосіївський парк', 50.38744, 30.50179, 900, { wikidataId: 'Q4137844' }),
  poi('natalka-park', 'poi.park', 'Парк Наталка', 50.50463, 30.51635, 700, { wikidataId: 'Q4344851' }),
  poi('peremoha-park', 'poi.park', 'Парк Перемога', 50.46345, 30.60532, 850, { wikidataId: 'Q4344575' }),
  poi('kyoto-park', 'poi.park', 'Парк Кіото', 50.46445, 30.64479, 800, { wikidataId: 'Q4344289' }),
  poi('syretskyi-park', 'poi.park', 'Сирецький парк', 50.47368, 30.44074, 700, { wikidataId: 'Q4447980' }),

  poi('maidan-nezalezhnosti', 'poi.square', 'Майдан Незалежності', 50.45025, 30.523889, 220, { wikidataId: 'Q863759' }),
  poi('sofiiska-square', 'poi.square', 'Софійська площа', 50.453611, 30.516111, 180, { wikidataId: 'Q3406857', osm: Object.freeze({ type: 'relation', id: 9298900 }) }),
  poi('mykhailivska-square', 'poi.square', 'Михайлівська площа', 50.455556, 30.521111, 180),
  poi('kontraktova-square', 'poi.square', 'Контрактова площа', 50.463889, 30.518056, 220, { wikidataId: 'Q2429499', osm: Object.freeze({ type: 'relation', id: 354367 }) }),
  poi('poshtova-square', 'poi.square', 'Поштова площа', 50.459439, 30.525, 180, { wikidataId: 'Q2472423' }),
  poi('andriivskyi-descent', 'poi.street', 'Андріївський узвіз', 50.459861, 30.515139, 500, { wikidataId: 'Q2622438' }),
  poi('golden-gate', 'poi.landmark', 'Золоті ворота', 50.448333, 30.513056, 120, { wikidataId: 'Q1427503' }),
  poi('kyiv-pechersk-lavra', 'poi.landmark', 'Києво-Печерська лавра', 50.432222, 30.562222, 650, { wikidataId: 'Q242711' }),
]);
