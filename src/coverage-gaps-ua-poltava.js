const normalize = (value) => String(value ?? '')
  .normalize('NFKC').trim().toLowerCase()
  .replace(/[’ʻʼ‘`´]/g, "'")
  .replace(/[^\p{L}\p{N}]+/gu, '-')
  .replace(/^-+|-+$/g, '');

const gaps = (type, canonicals, reason) => canonicals.map((canonical) => Object.freeze({ country: 'UA', city: 'Poltava', type, canonical, reason }));

export const UA_POLTAVA_COVERAGE_GAPS = Object.freeze([
  ...gaps('microdistrict', ['Tsentr','Sady','Polovky','Bozhenka','Motel','Zyhina','5 Shkola','Yar'], 'The listing locality is attested, but no independently verified standalone locality center or current map object was established with sufficient confidence in this pass.'),
  ...gaps('microdistrict', ['Sady-3'], 'Current map evidence identifies Sady-3 as Ohnivka; creating a second spatial entity for the same physical locality would duplicate the verified Ohnivka anchor.'),
  ...gaps('microdistrict', ['Rozsoshentsi'], 'Rozsoshentsi is a separate village in Shcherbani hromada rather than a Poltava city microdistrict; the city anchor is intentionally not reused as its parent.'),
  ...gaps('residential_complex', ['European','Family Park','Simeinyi','Levada','Petrivskyi Kvartal','Victory Club House'], 'The residential complex is attested, but no independently verified representative center for the exact complex was established in this pass.'),
  ...gaps('poi', ['Round Square','Ivanova Hora'], 'The place is attested, but a unique representative center distinct from the nearby verified park or landmark was not independently established with sufficient confidence.'),
]);

const gapKeys = new Set(UA_POLTAVA_COVERAGE_GAPS.map((gap) => [gap.country, gap.city, gap.type, gap.canonical].map(normalize).join('|')));

export function isUaPoltavaCoverageGap(input) {
  return gapKeys.has([input?.country, input?.city, input?.type, input?.canonical].map(normalize).join('|'));
}