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
  ...gaps('Navoiy', 'microdistrict', ['17 microdistrict'], 'Canonical numbered microdistrict is verified lexically; standalone spatial geometry is still pending.'),
  ...gaps('Almalyk', 'microdistrict', [
    '5/1 microdistrict','5/2 microdistrict','5/3 microdistrict','Yubileyny microdistrict',
  ], 'Canonical Almalyk microdistrict is verified lexically; standalone spatial geometry is still pending.'),
  ...gaps('Angren', 'microdistrict', [
    '2 quarter','3 quarter','5 quarter','6 quarter','7 quarter','8 quarter','9 quarter','10 quarter','11 quarter','32 quarter',
    '2/2 quarter','2/5 quarter','3/2 quarter','3/3 quarter','4/5 quarter','4/6 quarter','5/1A quarter','5/1B quarter','5/3 quarter','5/4 quarter','5/5 quarter','6/4 quarter','18/19 quarter',
  ], 'Canonical Angren quarter/daha is verified lexically; standalone spatial geometry is still pending.'),
  ...gaps('Angren', 'mahalla', ['Geolog'], 'Geolog is now modeled as a mahalla by the lexicon; a verified mahalla boundary or point is still pending.'),
  ...gaps('Angren', 'street', ['Amir Temur Street','Bunyodkor Street','Ohangaron Street'], 'Translated Angren street canonical is verified lexically; verified street geometry is still pending.'),
].map(Object.freeze));

const gapKeys = new Set(UZ_EXPANSION_COVERAGE_GAPS.map((gap) =>
  [gap.country, gap.city, gap.type, gap.canonical].map(normalize).join('|'),
));

export function isUzExpansionCoverageGap(input) {
  if (!input?.country || !input?.canonical) return false;
  return gapKeys.has([input.country, input.city, input.type || 'city', input.canonical].map(normalize).join('|'));
}
