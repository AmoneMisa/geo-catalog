const normalize = (value) => String(value ?? '')
  .normalize('NFKC').trim().toLowerCase()
  .replace(/[’ʻʼ‘`´]/g, "'")
  .replace(/[^\p{L}\p{N}]+/gu, '-')
  .replace(/^-+|-+$/g, '');

const gaps = (type, canonicals, reason) => canonicals.map((canonical) => Object.freeze({
  country: 'UA', city: 'Sumy', type, canonical, reason,
}));

export const UA_SUMY_COVERAGE_GAPS = Object.freeze([
  ...gaps('microdistrict', ['Tsentr','Prokofieve','Kharkivska','Basivka','Kosivshchyna'], 'The Sumy listing locality is attested, but a unique standalone spatial owner has not yet been independently verified with enough confidence; same-named streets, villages or nearby facilities are intentionally not substituted.'),
  ...gaps('residential_complex', ['Nottingham','Kharkivskyi','Teatralnyi','European'], 'The residential development is present in the parser vocabulary, but an independently verified representative center for the exact Sumy complex has not yet been established.'),
]);

const gapKeys = new Set(UA_SUMY_COVERAGE_GAPS.map((gap) =>
  [gap.country, gap.city, gap.type, gap.canonical].map(normalize).join('|')));

export function isUaSumyCoverageGap(input) {
  return gapKeys.has([input?.country, input?.city, input?.type, input?.canonical].map(normalize).join('|'));
}
