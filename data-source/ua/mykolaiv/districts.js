// Current administrative division: Centralnyi, Zavodskyi, Inhulskyi, Korabelnyi.
// Mykolaiv municipal sanitation scheme, section 1 / fig. 1.1:
// https://dgkh.mkrada.gov.ua/wp-content/uploads/2023/07/2_tekst.mater._sso-mykolai%CC%88v_06.07.23_compressed.pdf

const district = (slug, canonicalName, lat, lng, accuracyM, osmRelationId) => Object.freeze({
  id: `ua:mykolaiv:district:${slug}`,
  type: 'district',
  country: 'UA',
  canonicalName,
  parentId: 'ua:mykolaiv',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'district',
  accuracyM,
  osm: Object.freeze({ type: 'relation', id: osmRelationId }),
});

export const UA_MYKOLAIV_DISTRICT_ENTITIES = Object.freeze([
  district('tsentralnyi', 'Tsentralnyi', 47.001089, 31.952019, 7000, 2464737),
  district('zavodskyi', 'Zavodskyi', 46.941819, 31.949789, 5000, 2464844),
  district('inhulskyi', 'Inhulskyi', 46.947681, 32.066169, 6000, 2523802),
  district('korabelnyi', 'Korabelnyi', 46.873339, 32.021031, 9000, 2523805),
]);
