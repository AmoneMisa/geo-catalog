const residential = (slug, canonicalName, lat, lng, sourceUrl) => Object.freeze({
  id: `ua:chernihiv:residential:${slug}`,
  type: "residential_complex",
  country: "UA",
  canonicalName,
  parentId: "ua:chernihiv",
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: "building",
  accuracyM: 260,
});

export const UA_CHERNIHIV_RESIDENTIAL_COMPLEX_ENTITIES = Object.freeze([
  residential("masani", "Масани", 51.517939000, 31.240136000, "https://yandex.com/maps/?text=%D0%96%D0%9A%2C%20Chernihiv"),
]);
