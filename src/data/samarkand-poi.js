const wikidataPoi = (slug, canonicalName, lat, lng, wikidataId, accuracyM = 120) => ({
  id: `uz:samarkand:poi:${slug}`,
  type: 'poi',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:samarkand',
  center: { lat, lng },
  source: 'wikidata',
  accuracy: 'poi',
  accuracyM,
  wikidataId,
});

export const SAMARKAND_POI_ENTITIES = Object.freeze([
  wikidataPoi('registan-square', 'Registan Square', 39.654722, 66.975556, 'Q1373583', 120),
  wikidataPoi('gur-e-amir', 'Gur-e Amir', 39.648333, 66.968889, 'Q1256223', 100),
  wikidataPoi('shohi-zinda', 'Shohi Zinda', 39.662620, 66.987878, 'Q671935', 140),
  wikidataPoi('bibi-khanym', 'Bibi-Khanym', 39.660556, 66.979722, 'Q679218', 100),
  wikidataPoi('siyob-bazaar', 'Siyob Bazaar', 39.661893, 66.979915, 'Q13534449', 120),
  wikidataPoi('ulugbek-observatory', 'Ulugbek Observatory', 39.674722, 67.005556, 'Q608580', 150),
]);
