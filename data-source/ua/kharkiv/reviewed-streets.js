const osmStreet = (slug, canonicalName, lat, lng, osmWayId, accuracyM = 2600) => Object.freeze({
  id: `ua:kharkiv:street:${slug}`,
  type: 'street',
  country: 'UA',
  canonicalName,
  parentId: 'ua:kharkiv',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/way/${osmWayId}`,
  accuracy: 'street',
  accuracyM,
  osm: Object.freeze({ type: 'way', id: osmWayId }),
});

export const UA_KHARKIV_REVIEWED_STREET_ENTITIES = Object.freeze([
  osmStreet('goncharovskiy-boulevard', 'Гончаровский бульвар', 49.9830719, 36.215713, 1000223112),
  osmStreet('zhasminovyy-boulevard', 'Жасминовый бульвар', 49.9494549, 36.3199808, 237026869),
  osmStreet('profsoyuznyy-boulevard', 'Профсоюзный бульвар', 49.9715998, 36.1867653, 34772365),
  osmStreet('frontovikov-boulevard', 'бульвар Фронтовиков', 50.0478162, 36.1944598, 724277024),
  osmStreet('sadovyy-boulevard', 'Садовый бульвар', 50.0560612, 36.298043, 34838627),
  osmStreet('yureva-boulevard', 'бульвар Юрьева', 49.9611981, 36.3246346, 844367679),
  osmStreet('bogdana-khmelnitskogo-boulevard', 'бульвар Богдана Хмельницкого', 49.9566631, 36.3500919, 732334809),
  osmStreet('dmitriya-antonovicha-boulevard', 'бульвар Дмитрия Антоновича', 49.9290018, 36.4371501, 80946348),
]);
