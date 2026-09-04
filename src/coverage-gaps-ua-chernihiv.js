const normalize = (value) => String(value ?? '')
  .normalize('NFKC').trim().toLowerCase()
  .replace(/[’ʻʼ‘`´]/g, "'")
  .replace(/[^\p{L}\p{N}]+/gu, '-')
  .replace(/^-+|-+$/g, '');

const gaps = (type, canonicals, reason) => canonicals.map((canonical) => Object.freeze({ country: 'UA', city: 'Chernihiv', type, canonical, reason }));

export const UA_CHERNIHIV_COVERAGE_GAPS = Object.freeze([
  ...gaps('microdistrict', ['Tsentr','Rokossovskoho','Podusivka','Stara Podusivka','Piat Kutiv','Oleksandrivka','ZAZ','Podil'], 'The listing locality is attested, but no independently verified standalone locality center or current map object was established with sufficient confidence; a station or same-named out-of-city settlement is intentionally not substituted.'),
  ...gaps('residential_complex', ['Oleksandrivskyi','Lisovyi','Kyivskyi','Yeletskyi','Panorama','Riverside'], 'The residential complex is attested, but no independently verified representative center for the exact complex was established in this pass.'),
  ...gaps('poi', ['Chernihiv Val','Bohdan Khmelnytskyi Park','Central Park'], 'The landmark is attested, but a unique current geometry or representative center distinct from nearby verified historic and park entities was not independently established.'),
]);

const gapKeys = new Set(UA_CHERNIHIV_COVERAGE_GAPS.map((gap) => [gap.country, gap.city, gap.type, gap.canonical].map(normalize).join('|')));

export function isUaChernihivCoverageGap(input) {
  return gapKeys.has([input?.country, input?.city, input?.type, input?.canonical].map(normalize).join('|'));
}
