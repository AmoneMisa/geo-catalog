const normalize = (value) => String(value ?? '')
  .normalize('NFKC')
  .trim()
  .toLowerCase()
  .replace(/[’ʻʼ‘`´]/g, "'")
  .replace(/[^\p{L}\p{N}]+/gu, '-')
  .replace(/^-+|-+$/g, '');

const gaps = (type, canonicals, reason) => canonicals.map((canonical) => Object.freeze({
  country: 'UA', city: 'Rivne', type, canonical, reason,
}));

export const UA_RIVNE_COVERAGE_GAPS = Object.freeze([
  ...gaps('district', ['Pivnichnyi','Skhidnyi','Zakhidnyi','Pivdennyi','Tsentralnyi'], 'These five parser buckets come from Rivne planning/listing zoning (the 2025 city scheme divides the city into five analysis zones), not from a verified current KATOTTG intra-city administrative district layer. Geo-catalog intentionally does not invent administrative district entities for them.'),
  ...gaps('microdistrict', ['Tsentr','Pivnichnyi','Yuvileinyi','Lonokombinat','Avtovokzal','Hrabnyk','Mototrek','Chervoni Hory','Zoopark','Pyvzavod','Radiozavod'], 'Parser locality is attested as a Rivne listing/planning area, but no independently verified standalone locality center is available yet; nearby facilities or streets are intentionally not substituted.'),
  ...gaps('residential_complex', ['Prestige','Panorama de Luxe','Panorama','Pokrovskyi','Riverside'], 'Current sources do not provide a sufficiently verified representative center for this Rivne residential-complex canonical.'),
  ...gaps('poi', ['Hydropark','Prosvity Park'], 'The Rivne landmark is attested, but a direct independently verified representative coordinate has not yet been established; nearby addresses are intentionally not used as the POI center.'),
]);

const gapKeys = new Set(UA_RIVNE_COVERAGE_GAPS.map((gap) => [gap.country, gap.city, gap.type, gap.canonical].map(normalize).join('|')));

export function isUaRivneCoverageGap(input) {
  return gapKeys.has([input?.country, input?.city, input?.type, input?.canonical].map(normalize).join('|'));
}
