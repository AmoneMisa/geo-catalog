const normalize = (value) => String(value ?? '')
  .normalize('NFKC')
  .trim()
  .toLowerCase()
  .replace(/[’ʻʼ‘`´]/g, "'")
  .replace(/[^\p{L}\p{N}]+/gu, '-')
  .replace(/^-+|-+$/g, '');

const gaps = (type, canonicals, reason) => canonicals.map((canonical) => Object.freeze({
  country: 'UA', city: 'Vinnytsia', type, canonical, reason,
}));

export const UA_VINNYTSIA_COVERAGE_GAPS = Object.freeze([
  ...gaps('microdistrict', ['Slovianska','Urozhai','Koreia','Barske Shose'], 'The parser name is attested in Vinnytsia usage, but no independently verified standalone locality center/object reference was established in this pass; nearby streets or facilities are intentionally not substituted.'),
  Object.freeze({
    country: 'UA', city: 'Vinnytsia', type: 'microdistrict', canonical: 'Vinnytski Khutory',
    reason: 'Vinnytski Khutory is a separate settlement in the Vinnytsia hromada, not a city microdistrict; it requires settlement hierarchy instead of being parented under ua:vinnytsia.',
  }),
  ...gaps('residential_complex', ['Avalon','Premier Tower','Naberezhnyi Kvartal','Turkish City','Forest Home','Simeinyi','Akademichnyi','Podillia','Park Tower','River City','Dream Lake','European Quarter','Barcelona'], 'No current independently verified representative center for this Vinnytsia residential-complex canonical was established in this pass.'),
  ...gaps('poi', ['Vyshenske Lake','Friendship Park','Roshen Embankment'], 'The landmark is attested, but a unique current representative center/object was not independently verified with enough confidence to store spatially in this pass.'),
]);

const gapKeys = new Set(UA_VINNYTSIA_COVERAGE_GAPS.map((gap) => [gap.country, gap.city, gap.type, gap.canonical].map(normalize).join('|')));

export function isUaVinnytsiaCoverageGap(input) {
  return gapKeys.has([input?.country, input?.city, input?.type, input?.canonical].map(normalize).join('|'));
}
