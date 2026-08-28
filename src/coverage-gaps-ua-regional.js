const normalize = (value) => String(value ?? '')
  .normalize('NFKC')
  .trim()
  .toLowerCase()
  .replace(/[’ʻʼ‘`´]/g, "'")
  .replace(/[^\p{L}\p{N}]+/gu, '-')
  .replace(/^-+|-+$/g, '');

export const UA_REGIONAL_COVERAGE_GAPS = Object.freeze([
  Object.freeze({
    country: 'UA', city: 'Kropyvnytskyi', type: 'residential_complex', canonical: 'Manhattan',
    reason: 'Current Kropyvnytskyi sources identify Manhattan as a shopping center; no verified residential complex match was established.',
  }),
  Object.freeze({
    country: 'UA', city: 'Kropyvnytskyi', type: 'residential_complex', canonical: 'Perlyna',
    reason: 'No current Kropyvnytskyi residential development with this canonical name has a verified spatial match.',
  }),
  Object.freeze({
    country: 'UA', city: 'Kropyvnytskyi', type: 'residential_complex', canonical: 'European',
    reason: 'Do not conflate this lexicon candidate with the verified ЖК Сузір’я Європейське project; the canonical European entry has no verified spatial match.',
  }),
  Object.freeze({
    country: 'UA', city: 'Kropyvnytskyi', type: 'residential_complex', canonical: 'Kvartal',
    reason: 'No current Kropyvnytskyi residential development with this canonical name has a verified spatial match.',
  }),
  Object.freeze({
    country: 'UA', city: 'Kropyvnytskyi', type: 'residential_complex', canonical: 'Central',
    reason: 'No current Kropyvnytskyi residential development with this canonical name has a verified spatial match.',
  }),
]);

const gapKeys = new Set(UA_REGIONAL_COVERAGE_GAPS.map((gap) => [gap.country, gap.city, gap.type, gap.canonical].map(normalize).join('|')));

export function isUaRegionalCoverageGap(input) {
  return gapKeys.has([input?.country, input?.city, input?.type, input?.canonical].map(normalize).join('|'));
}
