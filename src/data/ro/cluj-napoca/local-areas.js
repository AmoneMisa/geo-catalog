const wikidataArea = (slug, canonicalName, lat, lng, wikidataId, accuracyM, aliases = []) => Object.freeze({
  id: `ro:cluj-napoca:local-area:${slug}`,
  type: 'local_area',
  country: 'RO',
  canonicalName,
  aliases: Object.freeze(aliases),
  parentId: 'ro:cluj-napoca',
  center: Object.freeze({ lat, lng }),
  source: 'wikidata',
  sourceUrl: `https://www.wikidata.org/wiki/${wikidataId}`,
  accuracy: 'neighborhood',
  accuracyM,
  wikidataId,
});

export const RO_CLUJ_NAPOCA_LOCAL_AREA_ENTITIES = Object.freeze([
  wikidataArea('manastur', 'Mănăștur', 46.7558861, 23.5521778, 'Q368523', 2200, ['Kolozsmonostor', 'Cluj-Mănăștur', 'Mănăştur']),
  wikidataArea('marasti', 'Mărăști', 46.78131963055556, 23.61266485, 'Q281611', 1800),
  wikidataArea('gheorgheni', 'Gheorgheni', 46.765, 23.61861111111111, 'Q590050', 1900, ['Györgyfalvi-negyed']),
  wikidataArea('grigorescu', 'Grigorescu', 46.77017, 23.5624, 'Q715962', 1800, ['Donath', 'Donátnegyed']),
]);
