const normalize = (value) => String(value ?? '')
  .normalize('NFKC').trim().toLowerCase()
  .replace(/[’ʻʼ‘`´]/g, "'")
  .replace(/[^\p{L}\p{N}]+/gu, '-')
  .replace(/^-+|-+$/g, '');

const gaps = (type, canonicals, reason) => canonicals.map((canonical) => Object.freeze({ country: 'UA', city: 'Kharkiv', type, canonical, reason }));

export const UA_KHARKIV_COVERAGE_GAPS = Object.freeze([
  ...gaps('microdistrict', ['627 microdistrict'], 'Current locality evidence is ambiguous with the same physical territory labelled as 624A; a second spatial owner is intentionally not created until the identity is disambiguated.'),
  ...gaps('poi', ['Feldman Ecopark'], 'The attraction is outside the Kharkiv city boundary; the current UA catalog has no regional parent layer suitable for assigning this physical owner without mis-parenting it to the city.'),
  ...gaps('poi', ['Rost','Klass'], 'These canonicals refer to retail chains with multiple Kharkiv branches, so one city-level canonical cannot honestly own a single physical point without branch disambiguation.'),
]);

const gapKeys = new Set(UA_KHARKIV_COVERAGE_GAPS.map((gap) => [gap.country, gap.city, gap.type, gap.canonical].map(normalize).join('|')));

export function isUaKharkivCoverageGap(input) {
  return gapKeys.has([input?.country, input?.city, input?.type, input?.canonical].map(normalize).join('|'));
}
