const normalize = (value) => String(value ?? '')
  .normalize('NFKC')
  .trim()
  .toLowerCase()
  .replace(/[’ʻʼ‘`´]/g, "'")
  .replace(/[^\p{L}\p{N}]+/gu, '-')
  .replace(/^-+|-+$/g, '');

const gaps = (country, city, type, canonicals, reason) => canonicals.map((canonical) => ({ country, city, type, canonical, reason }));

export const GEO_COVERAGE_GAPS = Object.freeze([
  ...gaps('UZ', 'Tashkent', 'local_area', [
    'Vuzgorodok','Hospitalny','Oltinkul','Movarounnahr','TTZ-3','Geofizika','Stroygorod','Nakkoshlik','Al-Khorezmi-1','Rakatboshi','Glinka','Alimkent',
  ], 'No verified standalone spatial locality match yet.'),
  { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Lolazor', reason: 'Ambiguous with same-name places outside Tashkent.' },
  { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Buyuk Ipak Yuli', reason: 'Area must not be conflated with the metro station.' },
  { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Dehqonobod', reason: 'Same-name settlements elsewhere in Uzbekistan require disambiguation.' },
  { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Sputnik', reason: 'Available points refer to individual blocks, not the whole massif.' },
  { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Kuylyuk Center', reason: 'Must not be conflated with the broader Kuylyuk microdistrict.' },
  { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Shohimardon', reason: 'Ambiguous with the Fergana Valley settlement; Tashkent match not verified.' },

  ...gaps('UZ', 'Samarkand', 'mahalla', ["Navro'z",'Shirin','Chilkuduk',"Cho'pon ota"], 'Official lexicon entity; verified spatial object still pending.'),
  ...gaps('UZ', 'Samarkand', 'local_area', [
    'Siyob','Registon','Center','University area','Dahbed','Railway Station area','Rudakiy','Gagarin area','Mirzo Ulugbek area','Spitamen','Panjakent Road','Bogishamol','Qorasuv','Geofizika','Sugdiyona','Super Market area','Dinamo area',"So'zangaron",'Buyuk Ipak Yoli',
  ], 'Lexicon local area still needs a verified standalone spatial match.'),
  ...gaps('UZ', 'Samarkand', 'poi', ['Samarkand City','Central Park','Youth Park','Yangi Ozbekiston Park'], 'Lexicon landmark still needs a verified spatial match.'),
].map(Object.freeze));

const gapKeys = new Set(GEO_COVERAGE_GAPS.map((gap) => [gap.country, gap.city, gap.type, gap.canonical].map(normalize).join('|')));

export function isGeoCoverageGap(input) {
  if (!input?.country || !input?.canonical) return false;
  return gapKeys.has([input.country, input.city, input.type || 'city', input.canonical].map(normalize).join('|'));
}
