const normalize = (value) => String(value ?? '')
  .normalize('NFKC').trim().toLowerCase()
  .replace(/[’ʻʼ‘`´]/g, "'")
  .replace(/[^\p{L}\p{N}]+/gu, '-')
  .replace(/^-+|-+$/g, '');

const gaps = (type, canonicals, reason) => canonicals.map((canonical) => Object.freeze({ country: 'UA', city: 'Kharkiv', type, canonical, reason }));

export const UA_KHARKIV_COVERAGE_GAPS = Object.freeze([
  ...gaps('microdistrict', ['536 microdistrict','537 microdistrict','614 microdistrict'], 'The locality is confirmed in current Kharkiv listing/OSM-derived sources, but no defensible representative coordinate or distinct physical owner has been verified yet; building/listing points are intentionally not promoted to locality centers.'),
  ...gaps('microdistrict', ['Kulynychi'], 'The lexicon exposes Kulynychi as a Kharkiv microdistrict for listing compatibility, while the verified physical locality is a settlement whose formal city-boundary ownership is not safe to infer as a Kharkiv microdistrict. Keep this explicit until the bridge can represent the settlement semantics without mis-typing or mis-parenting the physical owner.'),
  ...gaps('poi', ['Feldman Ecopark'], 'The attraction is outside the Kharkiv city boundary; the current UA catalog has no regional parent layer suitable for assigning this physical owner without mis-parenting it to the city.'),
  ...gaps('poi', ['Rost','Klass'], 'These canonicals refer to retail chains with multiple Kharkiv branches, so one city-level canonical cannot honestly own a single physical point without branch disambiguation.'),
]);

const gapKeys = new Set(UA_KHARKIV_COVERAGE_GAPS.map((gap) => [gap.country, gap.city, gap.type, gap.canonical].map(normalize).join('|')));

export function isUaKharkivCoverageGap(input) {
  return gapKeys.has([input?.country, input?.city, input?.type, input?.canonical].map(normalize).join('|'));
}
