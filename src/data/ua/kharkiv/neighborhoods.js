const microdistrict = (slug, canonicalName, lat, lng, accuracyM, sourceUrl) => Object.freeze({
  id: `ua:kharkiv:microdistrict:${slug}`, type: 'microdistrict', country: 'UA', canonicalName,
  parentId: 'ua:kharkiv', center: Object.freeze({ lat, lng }), source: 'osm', accuracy: 'neighborhood', accuracyM, sourceUrl,
});

export const UA_KHARKIV_NEIGHBORHOOD_ENTITIES = Object.freeze([
  microdistrict('saltivka', 'Салтівка', 50.016960, 36.345468, 700, 'https://www.openstreetmap.org/relation/11553119'),
  microdistrict('pavlove-pole', 'Павлове Поле', 50.034406, 36.226882, 700, 'https://www.openstreetmap.org/relation/11553372'),
  microdistrict('kholodna-hora', 'Холодна Гора', 49.982790, 36.182513, 900, 'https://www.openstreetmap.org/node/268473514'),
  microdistrict('oleksiivka', 'Олексіївка', 50.043990, 36.198277, 700, 'https://www.openstreetmap.org/relation/11553210'),
  microdistrict('zhukovskoho', 'Селище ім. Жуковського', 50.053211, 36.293270, 900, 'https://www.openstreetmap.org/node/13897123173'),
  microdistrict('novi-budynky', 'Нові Будинки', 49.959226, 36.331639, 900, 'https://www.openstreetmap.org/node/1985599387'),
]);
