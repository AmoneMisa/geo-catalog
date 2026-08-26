const normalize = (value) => String(value ?? '')
  .normalize('NFKC')
  .trim()
  .toLowerCase()
  .replace(/[’ʻʼ‘`´]/g, "'")
  .replace(/[^\p{L}\p{N}]+/gu, '-')
  .replace(/^-+|-+$/g, '');

const gaps = (city, type, canonicals, reason) => canonicals.map((canonical) => ({ country: 'UZ', city, type, canonical, reason }));

export const UZ_SECONDARY_COVERAGE_GAPS = Object.freeze([
  ...gaps('Jizzakh', 'local_area', ['Sangzor','Zilol','Hamid Olimjon','Navoiy','Airport area'], 'Jizzakh local-area alias still needs a verified standalone spatial match.'),
  ...gaps('Jizzakh', 'poi', ['Sangzor River'], 'Regional natural feature is intentionally not parented to Jizzakh city until natural-feature hierarchy is modeled.'),

  ...gaps('Navoiy', 'mahalla', ['Guliston'], 'Official lexicon mahalla; verified standalone spatial boundary/locality object still pending.'),
  ...gaps('Navoiy', 'microdistrict', ['8 microdistrict','11 microdistrict','12 microdistrict'], 'Navoiy numbered microdistrict still needs a verified neighbourhood/residential object.'),
  ...gaps('Navoiy', 'local_area', ['Uzbekiston Massiv','Yangi Navoiy','Sputnik'], 'Navoiy local-area alias still needs a verified standalone spatial match.'),
  ...gaps('Navoiy', 'poi', ['Alisher Navoiy Park'], 'Navoiy landmark still needs a verified spatial match.'),

  ...gaps('Termez', 'mahalla', ['Farxod'], 'Official lexicon mahalla; verified standalone spatial boundary/locality object still pending.'),
  ...gaps('Termez', 'local_area', ['Northern Gate','Alpomish',"Navro'z",'Qiziljar'], 'Termez local-area alias still needs a verified standalone spatial match.'),
  ...gaps('Termez', 'poi', ['Old Termez','Amu Darya'], 'Termez landmark still needs a verified spatial match or natural-feature hierarchy.'),

  ...gaps('Chirchiq', 'microdistrict', ['5 microdistrict','6 microdistrict','7 microdistrict','9 microdistrict'], 'Chirchiq numbered microdistrict still needs a verified neighbourhood/residential object.'),
  ...gaps('Chirchiq', 'local_area', ['Yubileiny','Khimik','KhimGorodok','Mashinostroitel','Troitsky','Bochka','Olympic area'], 'Chirchiq local-area alias still needs a verified standalone spatial match.'),
  ...gaps('Chirchiq', 'poi', ['Chirchiq River'], 'Regional natural feature is intentionally not parented to Chirchiq city until natural-feature hierarchy is modeled.'),

  ...gaps('Kokand', 'local_area', ['Old City','Orda','Chorsu','Dangara Road'], 'Kokand local-area alias still needs a verified standalone spatial match.'),

  ...gaps('Margilan', 'local_area', ['Old City','Atlas'], 'Margilan local-area alias still needs a verified standalone spatial match.'),

  ...gaps('Almalyk', 'mahalla', ['Kamalak'], 'Official lexicon mahalla; verified standalone spatial boundary/locality object still pending.'),
  ...gaps('Almalyk', 'microdistrict', ['1 microdistrict','2 microdistrict','3 microdistrict','4 microdistrict','5 microdistrict'], 'Almalyk numbered microdistrict still needs a verified neighbourhood/residential object.'),
  ...gaps('Almalyk', 'local_area', ['Old City','New City','Metallurg','Sports Palace area','Railway Station area'], 'Almalyk local-area alias still needs a verified standalone spatial match.'),

  ...gaps('Angren', 'microdistrict', ['1 microdistrict','2 microdistrict','3 microdistrict','4 microdistrict','5 microdistrict'], 'Angren numbered microdistrict still needs a verified neighbourhood/residential object.'),
  ...gaps('Angren', 'local_area', ['Old Angren','New Angren','Dukent','Geolog'], 'Angren local-area alias still needs a verified standalone spatial match.'),

  ...gaps('Bekabad', 'local_area', ['Metallurg','Tsementnik','Vodnik','Syrdarya','Farhod','Railway Station area'], 'Bekabad local-area alias still needs a verified standalone spatial match.'),
  ...gaps('Bekabad', 'poi', ['Farhod HPP'], 'Cross-border power infrastructure is intentionally not parented to Bekabad until infrastructure/region hierarchy is modeled.'),

  ...gaps('Shakhrisabz', 'local_area', ['Amir Temur','Kitob direction','Railway Station area'], 'Shakhrisabz local-area alias still needs a verified standalone spatial match.'),

  ...gaps('Khiva', 'local_area', ['New City'], 'Khiva local-area alias still needs a verified standalone spatial match.'),
].map(Object.freeze));

const gapKeys = new Set(UZ_SECONDARY_COVERAGE_GAPS.map((gap) => [gap.country, gap.city, gap.type, gap.canonical].map(normalize).join('|')));

export function isUzSecondaryCoverageGap(input) {
  if (!input?.country || !input?.canonical) return false;
  return gapKeys.has([input.country, input.city, input.type || 'city', input.canonical].map(normalize).join('|'));
}
