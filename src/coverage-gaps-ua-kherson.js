const normalize = (value) => String(value ?? '')
  .normalize('NFKC')
  .trim()
  .toLowerCase()
  .replace(/[’ʻʼ‘`´]/g, "'")
  .replace(/[^\p{L}\p{N}]+/gu, '-')
  .replace(/^-+|-+$/g, '');

const gaps = (type, canonicals, reason) => canonicals.map((canonical) => Object.freeze({
  country: 'UA', city: 'Kherson', type, canonical, reason,
}));

export const UA_KHERSON_COVERAGE_GAPS = Object.freeze([
  ...gaps('microdistrict', ['Tsentr','Tavriiskyi-1','KhBK'], 'The Kherson locality is attested, but its current standalone locality center/object reference was not recovered with sufficient confidence in this pass.'),
  Object.freeze({
    country: 'UA', city: 'Kherson', type: 'microdistrict', canonical: 'Korabel',
    reason: 'Current OSM treats Ostriv as also known as Korabel; creating a second spatial entity would duplicate the same physical locality and requires alias/duplicate policy first.',
  }),
  Object.freeze({
    country: 'UA', city: 'Kherson', type: 'microdistrict', canonical: 'Stepanivka',
    reason: 'The parser locality needs current hierarchy and standalone spatial verification before it can be safely parented as a Kherson microdistrict.',
  }),
  ...gaps('microdistrict', ['Antonivka','Zelenivka','Komyshany'], 'This parser canonical is a separate settlement in the Kherson hromada; it should be modeled through settlement hierarchy rather than incorrectly parented as a city microdistrict.'),
  Object.freeze({
    country: 'UA', city: 'Kherson', type: 'microdistrict', canonical: 'Naftohavan',
    reason: 'No independently verified standalone locality center is available yet; do not conflate Naftohavan with similarly named oil-workers settlements or industrial facilities.',
  }),
  ...gaps('residential_complex', ['Admiral','Parus','Dniprovskyi','Tavriiskyi','Suvorovskyi','Raiduzhnyi','European'], 'No current independently verified representative center for this Kherson residential-complex canonical was established in this pass.'),
  Object.freeze({
    country: 'UA', city: 'Kherson', type: 'poi', canonical: 'Potemkin Square',
    reason: 'The imperial-era canonical is affected by current naming/decolonization ambiguity; no stale historical label is anchored without an explicit current spatial alias mapping.',
  }),
  Object.freeze({
    country: 'UA', city: 'Kherson', type: 'poi', canonical: 'Dnipro Embankment',
    reason: 'Generic Dnipro riverfront wording is not a uniquely verified standalone POI and must not be assigned to an arbitrary embankment segment.',
  }),
]);

const gapKeys = new Set(UA_KHERSON_COVERAGE_GAPS.map((gap) => [gap.country, gap.city, gap.type, gap.canonical].map(normalize).join('|')));

export function isUaKhersonCoverageGap(input) {
  return gapKeys.has([input?.country, input?.city, input?.type, input?.canonical].map(normalize).join('|'));
}