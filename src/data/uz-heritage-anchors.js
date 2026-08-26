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
  wikidataPoi('khiva', 'itchan-kala', 'Ichan Kala', 41.37810, 60.35980, 'Q535577', { osm: { type: 'way', id: 185036984 }, accuracyM: 250 }),
  wikidataPoi('khiva', 'kalta-minor', 'Kalta Minor', 41.37835, 60.35798, 'Q4294004', { osm: { type: 'way', id: 178606424 }, accuracyM: 90 }),
  wikidataPoi('khiva', 'kunya-ark', 'Kunya Ark', 41.37888, 60.35822, 'Q4247358', { osm: { type: 'node', id: 1956482954 }, accuracyM: 100 }),
  wikidataPoi('khiva', 'islam-khodja', 'Islam Khodja', 41.376697, 60.360449, 'Q4287941', { accuracyM: 140 }),
  wikidataPoi('khiva', 'pahlavon-mahmud', 'Pahlavon Mahmud', 41.377100, 60.359500, 'Q4273777', { accuracyM: 150 }),
  wikidataPoi('khiva', 'tosh-hovli', 'Tosh Hovli', 41.378370, 60.361328, 'Q4155900', { accuracyM: 120 }),
  wikidataPoi('khiva', 'olloqulixon', 'Olloqulixon', 41.377502, 60.361951, 'Q4287928', { accuracyM: 140 }),
  wikidataPoi('shakhrisabz', 'ak-saray-palace', 'Ak-Saray Palace', 39.060776, 66.829475, 'Q2828887', { accuracyM: 140 }),
  wikidataPoi('kokand', 'khudayar-khan-palace', 'Khudoyar Khan Palace', 40.538333, 70.937500, 'Q7126242', { osm: { type: 'way', id: 174718684 }, accuracyM: 100 }),
  wikidataPoi('kokand', 'jami-mosque', 'Jami Mosque', 40.532642, 70.949230, 'Q20536410', { accuracyM: 120 }),
  wikidataPoi('termez', 'fayoztepa', 'Fayoztepa', 37.28622, 67.18796, 'Q25523471', { osm: { type: 'way', id: 244130562 }, accuracyM: 180 }),
  wikidataPoi('termez', 'karatepa', 'Karatepa', 37.27884, 67.18315, 'Q4213429', { osm: { type: 'way', id: 493758365 }, accuracyM: 180 }),
  wikidataPoi('termez', 'sultan-saodat', 'Sultan Saodat', 37.26311, 67.30940, 'Q7636738', { osm: { type: 'way', id: 448234922 }, accuracyM: 180 }),
]);
