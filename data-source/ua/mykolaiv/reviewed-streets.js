const street = (slug, canonicalName, lat, lng, osmWayId, accuracyM = 2200) => Object.freeze({
  id: `ua:mykolaiv:street:${slug}`,
  type: 'street',
  country: 'UA',
  canonicalName,
  parentId: 'ua:mykolaiv',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/way/${osmWayId}`,
  accuracy: 'street',
  accuracyM,
  osm: Object.freeze({ type: 'way', id: osmWayId }),
});

export const UA_MYKOLAIV_REVIEWED_STREET_ENTITIES = Object.freeze([
  street('kurortnyi-lane', 'провулок Курортний', 46.9587119, 31.9634134, 197366592),
  street('armiiskyi-lane', 'Армійський провулок', 47.0032937, 31.9956036, 849897209),
  street('finskyi-lane', 'Фінський провулок', 47.0048201, 31.9983039, 1305676875),
  street('mizhrichkovyi-lane', 'Міжрічковий провулок', 46.999715, 31.9996219, 131383328),
  street('pershyi-lane', 'Перший провулок', 46.9984676, 31.9956101, 110860137),
  street('ochakovskiy-lane', 'Очаковский переулок', 46.9881331, 31.94417, 184111710),
  street('izmailskiy-lane', 'Измаильский переулок', 46.9872069, 31.9419976, 300717981),
  street('4-parnikovyy-lane', '4-й Парниковый переулок', 46.961236, 31.9568842, 148498094),
  street('1-parnikovyy-lane', '1-й Парниковый переулок', 46.9591472, 31.9605641, 148498097),
  street('2-parnikovyy-lane', '2-й Парниковый переулок', 46.9595477, 31.9598671, 148498104),
  street('ofitserskiy-boulevard', 'Офицерский бульвар', 47.0238299, 31.9696876, 184779573, 2800),
  // Russian and Ukrainian OSM segments describe one physical waterfront boulevard.
  street('buzkyi-boulevard', 'Бузький бульвар', 46.9815669, 31.9711369, 1212975222, 3200),
]);
