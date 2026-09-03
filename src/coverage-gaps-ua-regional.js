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

  Object.freeze({
    country: 'UA', city: 'Kremenchuk', type: 'microdistrict', canonical: 'Vodokanal',
    reason: 'Current sources resolve Vodokanal to the municipal water utility rather than a standalone geographic locality; the lexicon candidate needs review before spatial anchoring.',
  }),
  Object.freeze({
    country: 'UA', city: 'Kremenchuk', type: 'microdistrict', canonical: 'Avtokrazivskyi',
    reason: 'Current map evidence identifies Avtokrazivskyi Boulevard, not a standalone neighborhood geometry; do not anchor the listing-area convention to the street point.',
  }),
  Object.freeze({
    country: 'UA', city: 'Kremenchuk', type: 'residential_complex', canonical: 'Dniprovska Riviera',
    reason: 'The residential project and address are verified, but a representative center for the multi-building development has not yet been independently verified.',
  }),
  Object.freeze({
    country: 'UA', city: 'Kremenchuk', type: 'poi', canonical: 'Dnipro Embankment',
    reason: 'Generic riverfront wording is not yet tied to a standalone named POI and must not be conflated with Velyka Naberezhna street or Prydniprovskyi Park.',
  }),

  Object.freeze({
    country: 'UA', city: 'Bila Tserkva', type: 'microdistrict', canonical: 'Tsentr',
    reason: 'The central planning area is attested, but no standalone locality geometry or independently defensible centroid is verified yet.',
  }),
  Object.freeze({
    country: 'UA', city: 'Bila Tserkva', type: 'microdistrict', canonical: 'Pionerska',
    reason: 'Pionerska is attested as a city-local area, but a stale map cache collides with the current Oleksandriiskyi OSM node; do not reuse that node without a current spatial match.',
  }),
  Object.freeze({
    country: 'UA', city: 'Bila Tserkva', type: 'microdistrict', canonical: '5 microdistrict',
    reason: 'No independently verified standalone spatial locality for the parser canonical has been established yet.',
  }),
  Object.freeze({
    country: 'UA', city: 'Bila Tserkva', type: 'microdistrict', canonical: '6 microdistrict',
    reason: 'No independently verified standalone spatial locality for the parser canonical has been established yet.',
  }),
  Object.freeze({
    country: 'UA', city: 'Bila Tserkva', type: 'poi', canonical: 'Ros River',
    reason: 'The Ros is a regional river extending far beyond Bila Tserkva and must not be parented to the city until natural-feature/region hierarchy is modeled.',
  }),
]);

const gapKeys = new Set(UA_REGIONAL_COVERAGE_GAPS.map((gap) => [gap.country, gap.city, gap.type, gap.canonical].map(normalize).join('|')));

export function isUaRegionalCoverageGap(input) {
  return gapKeys.has([input?.country, input?.city, input?.type, input?.canonical].map(normalize).join('|'));
}
