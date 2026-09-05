const wikidataArea = (slug, canonicalName, lat, lng, wikidataId, accuracyM, aliases = []) => Object.freeze({
  id: `ro:timisoara:local-area:${slug}`,
  type: 'local_area',
  country: 'RO',
  canonicalName,
  aliases: Object.freeze(aliases),
  parentId: 'ro:timisoara',
  center: Object.freeze({ lat, lng }),
  source: 'wikidata',
  sourceUrl: `https://www.wikidata.org/wiki/${wikidataId}`,
  accuracy: 'neighborhood',
  accuracyM,
  wikidataId,
});

export const RO_TIMISOARA_LOCAL_AREA_ENTITIES = Object.freeze([
  wikidataArea('cetate', 'Cetate', 45.75611111111111, 21.229444444444443, 'Q18538871', 2200, ['Belváros', 'Innere Stadt']),
  wikidataArea('fabric', 'Fabric', 45.75375, 21.227988888888888, 'Q726997', 2500, ['Gyárváros', 'Fabrikstadt']),
  wikidataArea('iosefin', 'Iosefin', 45.74444444444445, 21.20888888888889, 'Q54099162', 2300, ['Józsefváros', 'Josefstadt']),
  wikidataArea('elisabetin', 'Elisabetin', 45.74236388888889, 21.22625833333333, 'Q1330589', 2700, ['Erzsébetváros', 'Elisabethstadt']),
]);
