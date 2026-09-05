const residential = (slug, canonicalName, lat, lng, sourceUrl, accuracyM = 260) => Object.freeze({
  id: `kg:bishkek:residential:${slug}`,
  type: 'residential_complex',
  country: 'KG',
  canonicalName,
  parentId: 'kg:bishkek',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: 'building',
  accuracyM,
});

export const KG_BISHKEK_REVIEWED_RESIDENTIAL_ENTITIES = Object.freeze([
  residential('achekey', 'Ачекей', 42.831215, 74.653287, 'https://2gis.kg/bishkek/geo/70030076177262940'),
  residential('arbat', 'Арбат', 42.873477, 74.593601, 'https://2gis.kg/bishkek/geo/70030076198458074'),
  residential('chyngyz-aytmatov', 'Чынгыз Айтматов Ордосу', 42.821347, 74.613171, 'https://2gis.kg/bishkek/geo/70030076353131122'),
  residential('dzhal-artis', 'Jal Artis', 42.844954, 74.567446, 'https://2gis.kg/bishkek/geo/70030077146127951'),
  residential('florentsiya', 'Флоренция', 42.818912, 74.617261, 'https://2gis.kg/bishkek/geo/70030076168537056'),
  residential('ihlas-residence', 'IHLAS Residence', 42.835896, 74.582728, 'https://2gis.kg/bishkek/geo/70030076201436762'),
  residential('imperial', 'Империал', 42.880323, 74.62051, 'https://2gis.kg/bishkek/geo/15763234351119787'),
  residential('jibekcity', 'Jibekcity', 42.885571, 74.598216, 'https://2gis.kg/bishkek/geo/70030077154003011'),
  residential('kontinental', 'Континенталь', 42.858779, 74.61382, 'https://2gis.kg/bishkek/geo/70030076201799610'),
  residential('kremlevskiy', 'Кремлевский', 42.847922, 74.601698, 'https://2gis.kg/bishkek/geo/70030076170116197'),
  residential('malina', 'Malina', 42.812993, 74.620127, 'https://2gis.kg/bishkek/geo/70030076221163219'),
  residential('muras', 'Мурас', 42.883072, 74.578627, 'https://2gis.kg/bishkek/geo/70030076176544634'),
  residential('pioner', 'Пионер', 42.86267, 74.620262, 'https://2gis.kg/bishkek/geo/15763234351047236'),
  residential('royal', 'Royal', 42.882945, 74.593679, 'https://2gis.kg/bishkek/geo/70030076377140948'),
]);
