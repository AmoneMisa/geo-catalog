// Current Kherson intra-city districts are Dniprovskyi, Korabelnyi and Tsentralnyi.
// Current budget/KATOTTG sources use those three names; Suvorovskyi and Komsomolskyi
// are historical aliases and belong in parsing-lexicon, not as current spatial canonicals.

const district = (slug, canonicalName, lat, lng, accuracyM, sourceUrl, osmRelationId = null) => Object.freeze({
  id: `ua:kherson:district:${slug}`,
  type: 'district',
  country: 'UA',
  canonicalName,
  parentId: 'ua:kherson',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: 'district',
  accuracyM,
  ...(osmRelationId ? { osm: Object.freeze({ type: 'relation', id: osmRelationId }) } : {}),
});

export const UA_KHERSON_DISTRICT_ENTITIES = Object.freeze([
  district(
    'dniprovskyi',
    'Dniprovskyi',
    46.667500,
    32.671944,
    10000,
    'https://www.dniproradakherson.gov.ua/dniprovskij_rajon',
    4258125,
  ),
  district(
    'korabelnyi',
    'Korabelnyi',
    46.633056,
    32.600000,
    12000,
    'https://directory.org.ua/territories/UA65100150010217771',
  ),
  district(
    'tsentralnyi',
    'Tsentralnyi',
    46.658611,
    32.609167,
    6000,
    'https://commons.wikimedia.org/wiki/Category:Suvorovskyi_Raion,_Kherson',
    4251773,
  ),
]);
