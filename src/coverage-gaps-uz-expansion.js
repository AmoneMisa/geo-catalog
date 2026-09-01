const normalize = (value) => String(value ?? '')
  .normalize('NFKC')
  .trim()
  .toLowerCase()
  .replace(/[’ʻʼ‘`´]/g, "'")
  .replace(/[^\p{L}\p{N}]+/gu, '-')
  .replace(/^-+|-+$/g, '');

const gaps = (city, type, canonicals, reason) => canonicals.map((canonical) => ({
  country: 'UZ', city, type, canonical, reason,
}));

// Entries introduced by newer parsing-lexicon geography revisions that do not
// yet have independently verified spatial owners in geo-catalog. Keeping them
// explicit prevents parser coverage from being mistaken for geocoded coverage.
export const UZ_EXPANSION_COVERAGE_GAPS = Object.freeze([
  ...gaps('Samarkand', 'poi', ['Central Park'], 'Current lexicon canonical for Alisher Navoiy Park; exact verified park geometry is still pending.'),
].map(Object.freeze));

const gapKeys = new Set(UZ_EXPANSION_COVERAGE_GAPS.map((gap) =>
  [gap.country, gap.city, gap.type, gap.canonical].map(normalize).join('|'),
));

export function isUzExpansionCoverageGap(input) {
  if (!input?.country || !input?.canonical) return false;
  return gapKeys.has([input.country, input.city, input.type || 'city', input.canonical].map(normalize).join('|'));
}
