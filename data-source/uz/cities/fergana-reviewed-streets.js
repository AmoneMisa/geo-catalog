const osmStreet = (slug, canonicalName, lat, lng, osmWayId, accuracyM = 850) => ({
  id: `uz:fergana:street:${slug}`,
  type: 'street',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:fergana',
  center: { lat, lng },
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/way/${osmWayId}`,
  accuracy: 'street',
  accuracyM,
  osm: { type: 'way', id: osmWayId },
});

export const FERGANA_REVIEWED_STREET_ENTITIES = Object.freeze([
  osmStreet('kuvasayskaya', 'Кувасайская улица', 40.3990017, 71.8439485, 775162618),
  osmStreet('konstitutsii', 'улица Конституции', 40.3874062, 71.7949757, 84225411),
  osmStreet('nikhol', 'улица Нихол', 40.4224694, 71.8197295, 923732557),
  osmStreet('belova', 'улица Белова', 40.3854233, 71.8366197, 172053175),
  osmStreet('voris', 'улица Ворис', 40.3855667, 71.8379527, 171374697),
  osmStreet('guliston', 'улица Гулистон', 40.3985639, 71.8452081, 1472007836),
  osmStreet('binafsha', 'улица Бинафша', 40.4212558, 71.8189947, 1530544995),
  osmStreet('yangi-khayot', 'улица Янги Хаёт', 40.3818135, 71.8240776, 172053150),
]);
