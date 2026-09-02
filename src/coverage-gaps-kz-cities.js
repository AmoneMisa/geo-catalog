const normalize = (value) => String(value ?? '')
  .normalize('NFKC')
  .trim()
  .toLowerCase()
  .replace(/[’ʻʼ‘`´]/g, "'")
  .replace(/[^\p{L}\p{N}]+/gu, '-')
  .replace(/^-+|-+$/g, '');

const cityNames = Object.freeze([
  'Konaev','Zhanaozen','Satbayev','Kosshy','Arys',
  'Kentau','Saryagash','Stepnogorsk','Atbasar','Shchuchinsk','Makinsk','Ereymentau','Akkol','Kaskelen','Talgar',
  'Esik','Shelek','Uzynagash','Zharkent','Tekeli','Usharal','Saran','Shakhtinsk','Abai','Priozersk','Karkaralinsk',
  'Aksu','Ridder','Altai','Serebryansk','Shemonaikha','Kurchatov','Ayagoz','Khromtau','Alga','Kandyagash','Shalkar',
  'Kulsary','Dossor','Fort-Shevchenko','Lisakovsk','Arkalyk','Tobyl','Zhitikara','Aksai','Baikonur','Aral','Kazaly',
  'Shu','Karatau','Zhanatas','Merke','Zhetysai','Lenger','Shardara',
]);

export const KZ_CITY_COVERAGE_GAPS = Object.freeze(cityNames.map((canonical) => Object.freeze({
  country: 'KZ',
  type: 'city',
  canonical,
  reason: 'Canonical parsing-lexicon city is not yet represented by a verified geo-catalog city entity.',
})));

const gapKeys = new Set(KZ_CITY_COVERAGE_GAPS.map((gap) => [gap.country, gap.city, gap.type, gap.canonical].map(normalize).join('|')));

export function isKzCityCoverageGap(input) {
  return gapKeys.has([input?.country, input?.city, input?.type || 'city', input?.canonical].map(normalize).join('|'));
}
