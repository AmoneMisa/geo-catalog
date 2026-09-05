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
  osmStreet('kuvasayskaya', 'Кувасайская улица', 40.3591543, 71.833952, 775162618),
  osmStreet('konstitutsii', 'улица Конституции', 40.3835871, 71.7857042, 84225411),
  osmStreet('nikhol', 'улица Нихол', 40.3462157, 71.8069033, 923732557),
  osmStreet('belova', 'улица Белова', 40.3821944, 71.8392414, 172053175),
  osmStreet('voris', 'улица Ворис', 40.3704415, 71.8353731, 171374697),
  osmStreet('guliston', 'улица Гулистон', 40.3566278, 71.8326908, 1472007836),
  osmStreet('binafsha', 'улица Бинафша', 40.3662263, 71.8392361, 1530544995),
  osmStreet('yangi-khayot', 'улица Янги Хаёт', 40.3875309, 71.8273477, 172053150),
]);
