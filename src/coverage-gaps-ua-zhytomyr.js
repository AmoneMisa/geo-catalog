const normalize = (value) => String(value ?? '')
  .normalize('NFKC').trim().toLowerCase()
  .replace(/[’ʻʼ‘`´]/g, "'")
  .replace(/[^\p{L}\p{N}]+/gu, '-')
  .replace(/^-+|-+$/g, '');

const gaps = (type, canonicals, reason) => canonicals.map((canonical) => Object.freeze({
  country: 'UA', city: 'Zhytomyr', type, canonical, reason,
}));

export const UA_ZHYTOMYR_COVERAGE_GAPS = Object.freeze([
  Object.freeze({
    country: 'UA', city: 'Zhytomyr', type: 'microdistrict', canonical: 'Bohuniia',
    reason: 'Current broad Bohuniia/Bohunskyi locality data overlaps the administrative-district identity; a separate microdistrict owner is not asserted until a narrower standalone locality object is verified.',
  }),
  ...gaps('microdistrict', ['Tsentr','Malikova','Marianivka','Skhidnyi','Muzykalka','Promavtomatyka'], 'The listing locality is attested in Zhytomyr, but a unique current standalone spatial owner has not yet been independently verified; a same-named street, facility or nearby quarter is intentionally not substituted.'),
  ...gaps('microdistrict', ['Polova','Polova-1','Polova-2','Polova-3'], 'Current map evidence splits the Polova area into independently named upper/lower and numbered planning parts; the parser canonical cannot yet be bound one-to-one without inventing a centroid or duplicating a physical owner.'),
  Object.freeze({
    country: 'UA', city: 'Zhytomyr', type: 'microdistrict', canonical: 'Kroshnia',
    reason: 'Current map evidence distinguishes Nova, Ukrainska, Cheska and other Kroshnia localities; the broad parser canonical needs a verified base owner before it is spatially anchored.',
  }),
  Object.freeze({
    country: 'UA', city: 'Zhytomyr', type: 'microdistrict', canonical: 'Smolianka',
    reason: 'Current OSM distinguishes Persha and Druha Smolianka plus a broader suburb identity; the broad parser canonical stays unresolved until one physical owner is selected without duplication.',
  }),
  ...gaps('residential_complex', ['Domashnii','Mriia','Grand City Dombrovskyi','Polissia','Perlyny Korbutivky','River City','Mystetski Vorota','Smart City'], 'No independently verified representative center for the exact Zhytomyr residential-complex canonical has been established in this pass.'),
  Object.freeze({
    country: 'UA', city: 'Zhytomyr', type: 'poi', canonical: 'Haharin Park',
    reason: 'The physical city park is verified, but current naming/decolonization and legacy Haharin/Shoduarivskyi usage must be normalized before assigning the parser canonical to one current POI owner.',
  }),
  Object.freeze({
    country: 'UA', city: 'Zhytomyr', type: 'poi', canonical: 'Korolovskyi Square',
    reason: 'A unique current square geometry/representative center matching this exact parser canonical has not yet been independently verified.',
  }),
]);

const gapKeys = new Set(UA_ZHYTOMYR_COVERAGE_GAPS.map((gap) =>
  [gap.country, gap.city, gap.type, gap.canonical].map(normalize).join('|')));

export function isUaZhytomyrCoverageGap(input) {
  return gapKeys.has([input?.country, input?.city, input?.type, input?.canonical].map(normalize).join('|'));
}
