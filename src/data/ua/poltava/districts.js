const district = (slug, canonicalName, lat, lng, accuracyM, sourceUrl, extra = {}) => Object.freeze({
  id: `ua:poltava:district:${slug}`,
  type: 'district',
  country: 'UA',
  canonicalName,
  parentId: 'ua:poltava',
  center: Object.freeze({ lat, lng }),
  source: extra.wikidataId ? 'wikidata' : 'manual',
  sourceUrl,
  accuracy: 'district',
  accuracyM,
  ...extra,
});

// Poltava City Council currently lists three intra-city districts:
// Kyivskyi, Podilskyi and Shevchenkivskyi. Representative centers are kept
// deliberately broad because exact published boundary centroids are not used here.
export const UA_POLTAVA_DISTRICT_ENTITIES = Object.freeze([
  district('kyivskyi', 'Kyivskyi', 49.6090, 34.5293, 8500, 'https://kr-pl.gov.ua/district/'),
  district('podilskyi', 'Podilskyi', 49.5801, 34.5849, 8500, 'https://lr-pl.gov.ua/', { wikidataId: 'Q12117640' }),
  district('shevchenkivskyi', 'Shevchenkivskyi', 49.5645, 34.5387, 8500, 'https://okt-rada.gov.ua/%D1%96%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D1%96%D1%8F-%D0%BF%D1%80%D0%BE-%D1%80%D0%B0%D0%B9%D0%BE%D0%BD/', { wikidataId: 'Q12135495' }),
]);
