const GEONAMES_SOURCE = 'https://www.geonames.org/advanced-search.html?country=KG&q=Bishkek';

const district = (slug, canonicalName, lat, lng, accuracyM) => Object.freeze({
  id: `kg:bishkek:district:${slug}`,
  type: 'district',
  country: 'KG',
  canonicalName,
  parentId: 'kg:bishkek',
  center: Object.freeze({ lat, lng }),
  source: 'geonames',
  sourceUrl: GEONAMES_SOURCE,
  accuracy: 'district',
  accuracyM,
});

export const KG_BISHKEK_DISTRICT_ENTITIES = Object.freeze([
  district('pervomaisky', 'Pervomaisky', 42.887044, 74.582129, 6500),
  district('leninsky', 'Leninsky', 42.854908, 74.584053, 6500),
  district('oktyabrsky', 'Oktyabrsky', 42.859608, 74.620332, 6500),
  district('sverdlovsky', 'Sverdlovsky', 42.902761, 74.600127, 6500),
]);
