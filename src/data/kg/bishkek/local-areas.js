const localArea = (slug, canonicalName, lat, lng, sourceUrl) => Object.freeze({
  id: `kg:bishkek:local-area:${slug}`,
  type: "local_area",
  country: "KG",
  canonicalName,
  parentId: "kg:bishkek",
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: "neighborhood",
  accuracyM: 1000,
});

export const KG_BISHKEK_LOCAL_AREA_ENTITIES = Object.freeze([
  localArea("ak-ordo", "Ак-Ордо", 42.827464108, 74.485501408, "https://www.bishkek.gov.kg/ru/post/21046"),
  localArea("ala-too-3", "Ала-Тоо 3", 42.837929417, 74.487041364, "https://www.bishkek.gov.kg/ru/post/12424"),
  localArea("kirgiziya-1", "Киргизия-1", 42.811815014, 74.580575434, "https://www.bishkek.gov.kg/ru/post/32716"),
]);
