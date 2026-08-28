const normalize = (value) => String(value ?? '')
  .normalize('NFKC').trim().toLowerCase()
  .replace(/[’ʻʼ‘`´]/g, "'")
  .replace(/[^\p{L}\p{N}]+/gu, '-')
  .replace(/^-+|-+$/g, '');

const gaps = (type, canonicals, reason) => canonicals.map((canonical) => Object.freeze({ country: 'UA', city: 'Cherkasy', type, canonical, reason }));

export const UA_CHERKASY_COVERAGE_GAPS = Object.freeze([
  ...gaps('district', ['Prydniprovskyi','Sosnivskyi'], 'Administrative district is verified, but an authoritative boundary-derived representative center is not stored; arbitrary neighborhood points are intentionally not substituted.'),
  ...gaps('microdistrict', ['Tsentr','Khimpaselyshche','Zelenyi','Lunacharskyi','D','700-richchia'], 'The listing locality is attested, but no independently verified standalone locality center or current map object was established with sufficient confidence in this pass.'),
  ...gaps('residential_complex', ['Symfonia','Hrafskyi','Ridnyi Dim','City Park','Perlyna Dnipra','Andorra','Parkovyi Kvartal','European'], 'The residential complex is attested, but no independently verified representative center for the exact complex was established in this pass.'),
  ...gaps('poi', ['Dnipro Embankment','Wedding Palace','House with Chimeras'], 'The landmark is attested, but a unique current representative center or exact physical object was not independently verified; a nearby street or building is intentionally not substituted.'),
]);

const gapKeys = new Set(UA_CHERKASY_COVERAGE_GAPS.map((gap) => [gap.country, gap.city, gap.type, gap.canonical].map(normalize).join('|')));

export function isUaCherkasyCoverageGap(input) {
  return gapKeys.has([input?.country, input?.city, input?.type, input?.canonical].map(normalize).join('|'));
}
