const normalize = (value) => String(value ?? '')
  .normalize('NFKC').trim().toLowerCase()
  .replace(/[’ʻʼ‘`´]/g, "'")
  .replace(/[^\p{L}\p{N}]+/gu, '-')
  .replace(/^-+|-+$/g, '');

const gaps = (type, canonicals, reason) => canonicals.map((canonical) => Object.freeze({ country: 'UA', city: 'Mykolaiv', type, canonical, reason }));

export const UA_MYKOLAIV_COVERAGE_GAPS = Object.freeze([
  ...gaps('microdistrict', ['Tsentr','Inhulskyi','Korabelnyi','Zhovtneve'], 'The locality is attested, but a current standalone locality center/object reference was not independently verified with sufficient confidence in this pass.'),
  ...gaps('microdistrict', ['PTZ','YuTZ'], 'Both parser canonicals refer to the same Pivdennyi Turbinnyi Zavod locality in current map evidence; creating duplicate spatial entities would require an explicit alias/deduplication policy first.'),
  ...gaps('residential_complex', ['Levanevtsiv','Admiral','Soniachnyi'], 'No current independently verified representative center for this residential-complex canonical was established in this pass.'),
  ...gaps('poi', ['Flotskyi Boulevard','Embankment',], 'The landmark is attested, but a unique current representative center/object was not independently verified in this pass; nearby street or riverfront geometry is not substituted.'),
]);

const gapKeys = new Set(UA_MYKOLAIV_COVERAGE_GAPS.map((gap) => [gap.country, gap.city, gap.type, gap.canonical].map(normalize).join('|')));

export function isUaMykolaivCoverageGap(input) {
  return gapKeys.has([input?.country, input?.city, input?.type, input?.canonical].map(normalize).join('|'));
}