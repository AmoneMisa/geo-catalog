const wikidataPoi = (citySlug, slug, canonicalName, lat, lng, wikidataId, extra = {}) => ({
  id: `uz:${citySlug}:poi:${slug}`,
  type: 'poi',
  country: 'UZ',
  canonicalName,
  parentId: `uz:${citySlug}`,
  center: { lat, lng },
  source: extra.osm ? 'osm' : 'wikidata',
  accuracy: 'poi',
  accuracyM: extra.accuracyM ?? 180,
  wikidataId,
  ...(extra.osm ? { osm: extra.osm } : {}),
});

export const UZ_HERITAGE_ANCHORS = Object.freeze([
  wikidataPoi('khiva', 'itchan-kala', 'Itchan Kala', 41.377718, 60.359476, 'Q535577', { accuracyM: 350 }),
  wikidataPoi('shakhrisabz', 'ak-saray-palace', 'Ak-Saray Palace', 39.060776, 66.829475, 'Q2828887', { accuracyM: 140 }),
  wikidataPoi('kokand', 'khudayar-khan-palace', 'Khudoyar Khan Palace', 40.538333, 70.937500, 'Q7126242', { osm: { type: 'way', id: 174718684 }, accuracyM: 100 }),
]);
