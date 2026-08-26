const normalize = (value) => String(value ?? '')
  .normalize('NFKC')
  .trim()
  .toLowerCase()
  .replace(/[’ʻʼ‘`´]/g, "'")
  .replace(/[^\p{L}\p{N}]+/gu, '-')
  .replace(/^-+|-+$/g, '');

export const GEO_COVERAGE_GAPS = Object.freeze([
  { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Vuzgorodok', reason: 'No verified standalone OSM locality match yet.' },
  { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Hospitalny', reason: 'No verified standalone OSM locality match yet.' },
  { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Lolazor', reason: 'Ambiguous with same-name places outside Tashkent.' },
  { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Oltinkul', reason: 'No verified standalone OSM locality match yet.' },
  { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Movarounnahr', reason: 'No verified standalone OSM locality match yet.' },
  { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Buyuk Ipak Yuli', reason: 'Area must not be conflated with the metro station.' },
  { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'TTZ-3', reason: 'No verified standalone neighbourhood object yet.' },
  { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Geofizika', reason: 'No verified standalone OSM locality match yet.' },
  { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Stroygorod', reason: 'No verified standalone OSM locality match yet.' },
  { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Nakkoshlik', reason: 'No verified standalone OSM locality match yet.' },
  { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Al-Khorezmi-1', reason: 'No verified standalone OSM locality match yet.' },
  { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Dehqonobod', reason: 'Same-name settlements elsewhere in Uzbekistan require disambiguation.' },
  { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Rakatboshi', reason: 'Official mahalla is known; spatial OSM object still needs a verified match.' },
  { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Glinka', reason: 'No verified standalone OSM locality match yet.' },
  { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Dustlik-1', reason: 'No verified standalone neighbourhood object yet.' },
  { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Dustlik-2', reason: 'No verified standalone neighbourhood object yet.' },
  { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Sputnik', reason: 'Available points refer to individual blocks, not the whole massif.' },
  { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Kuylyuk Center', reason: 'Must not be conflated with the broader Kuylyuk microdistrict.' },
  { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Alimkent', reason: 'No verified standalone OSM locality match yet.' },
  { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Shohimardon', reason: 'Ambiguous with the Fergana Valley settlement; Tashkent match not verified.' },
].map(Object.freeze));

const gapKeys = new Set(GEO_COVERAGE_GAPS.map((gap) => [gap.country, gap.city, gap.type, gap.canonical].map(normalize).join('|')));

export function isGeoCoverageGap(input) {
  if (!input?.country || !input?.canonical) return false;
  return gapKeys.has([input.country, input.city, input.type || 'city', input.canonical].map(normalize).join('|'));
}
