const street = (slug, canonicalName, lat, lng, osmWayId, accuracyM = 1600) => Object.freeze({
  id: `kg:karakol:street:${slug}`,
  type: 'street',
  country: 'KG',
  canonicalName,
  parentId: 'kg:karakol',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/way/${osmWayId}`,
  accuracy: 'street',
  accuracyM,
  osm: Object.freeze({ type: 'way', id: osmWayId }),
});

export const KG_KARAKOL_STREET_ENTITIES = Object.freeze([
  street('aldasheva', 'Улица Алдашева', 42.4947898, 78.3900758, 27427041),
  street('gebze', 'Улица Гебзе', 42.4906073, 78.4016604, 28556841),
  street('karasaeva', 'Улица Карасаева', 42.4699192, 78.3801316, 27410147),
  street('lenina', 'Улица Ленина', 42.5043104, 78.3765856, 1536295713),
  street('przhevalskogo', 'Улица Пржевальского', 42.4970614, 78.3813105, 27413777),
  street('shopokova', 'Улица Шопокова', 42.4785472, 78.3855872, 220868234),
  street('toktogula', 'Улица Токтогула', 42.4934002, 78.3963514, 1396850174),
  street('tynystanova', 'Улица Тыныстанова', 42.4930165, 78.4021032, 1397450497),
  street('zhamansarieva', 'Улица Жамансариева', 42.4854896, 78.3960705, 1348490394),
]);
