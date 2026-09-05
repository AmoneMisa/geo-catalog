const poi = (slug, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:novovolynsk:poi:${slug}`,
  type: 'poi.landmark',
  country: 'UA',
  canonicalName,
  parentId: 'ua:novovolynsk',
  center: Object.freeze({ lat, lng }),
  source: extra.source ?? (extra.osm ? 'osm' : 'manual'),
  accuracy: 'poi',
  accuracyM,
  ...extra,
});

export const NOVOVOLYNSK_POIS = Object.freeze([
  poi('historical-museum', 'Нововолинський історичний музей', 50.727023215, 24.164847331, 100, {
    source: 'manual',
    sourceUrl: 'https://maps.visicom.ua/i/POIN37RKZE',
  }),
]);
