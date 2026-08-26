const normalize = (value) => String(value ?? '')
  .normalize('NFKC')
  .trim()
  .toLowerCase()
  .replace(/[’ʻʼ‘`´]/g, "'")
  .replace(/[^\p{L}\p{N}]+/gu, '-')
  .replace(/^-+|-+$/g, '');

const gaps = (city, type, canonicals, reason) => canonicals.map((canonical) => ({ country: 'UZ', city, type, canonical, reason }));

export const UZ_SECONDARY_COVERAGE_GAPS = Object.freeze([
  ...gaps('Jizzakh', 'mahalla', ['Ittifoq'], 'Official lexicon mahalla; verified standalone spatial boundary/locality object still pending.'),
  ...gaps('Jizzakh', 'local_area', ['Center','Sangzor','Zilol','Hamid Olimjon','Navoiy','Railway Station area','Airport area'], 'Jizzakh local-area alias still needs a verified standalone spatial match.'),
  ...gaps('Jizzakh', 'poi', ['Jizzakh Pedagogical University','Sangzor River'], 'Jizzakh landmark still needs a verified spatial match.'),

  ...gaps('Navoiy', 'mahalla', ['Guliston'], 'Official lexicon mahalla; verified standalone spatial boundary/locality object still pending.'),
  ...gaps('Navoiy', 'microdistrict', ['1 microdistrict','2 microdistrict','3 microdistrict','4 microdistrict','5 microdistrict','6 microdistrict','7 microdistrict','8 microdistrict','9 microdistrict','10 microdistrict','11 microdistrict','12 microdistrict'], 'Navoiy numbered microdistrict still needs a verified neighbourhood/residential object.'),
  ...gaps('Navoiy', 'local_area', ['Uzbekiston Massiv','Yangi Navoiy','Center','Sputnik','Railway Station area'], 'Navoiy local-area alias still needs a verified standalone spatial match.'),
  ...gaps('Navoiy', 'poi', ['Alisher Navoiy Park','Farhod Palace of Culture','Navoiy Mining and Metallurgical Company'], 'Navoiy landmark still needs a verified spatial match.'),

  ...gaps('Termez', 'mahalla', ['Farxod'], 'Official lexicon mahalla; verified standalone spatial boundary/locality object still pending.'),
  ...gaps('Termez', 'local_area', ['Center','Old Termez','Northern Gate','Railway Station area','Airport area','University area','Alpomish',"Navro'z",'Qiziljar'], 'Termez local-area alias still needs a verified standalone spatial match.'),
  ...gaps('Termez', 'poi', ['Old Termez','Fayoztepa','Karatepa','Sultan Saodat','Hakim at-Termiziy','Amu Darya','Afghanistan Friendship Bridge'], 'Termez landmark still needs a verified spatial match.'),

  ...gaps('Gulistan', 'mahalla', ['Sayqal'], 'Official lexicon mahalla; verified standalone spatial boundary/locality object still pending.'),
  ...gaps('Gulistan', 'microdistrict', ['1 microdistrict','2 microdistrict','3 microdistrict','4 microdistrict'], 'Gulistan numbered microdistrict still needs a verified neighbourhood/residential object.'),
  ...gaps('Gulistan', 'local_area', ['Center','Dehqon Bazaar','University area','Railway Station area'], 'Gulistan local-area alias still needs a verified standalone spatial match.'),
  ...gaps('Gulistan', 'poi', ['Gulistan State University','Central Stadium'], 'Gulistan landmark still needs a verified spatial match.'),

  ...gaps('Chirchiq', 'microdistrict', ['1 microdistrict','2 microdistrict','3 microdistrict','4 microdistrict','5 microdistrict','6 microdistrict','7 microdistrict','8 microdistrict','9 microdistrict'], 'Chirchiq numbered microdistrict still needs a verified neighbourhood/residential object.'),
  ...gaps('Chirchiq', 'local_area', ['Center','Yubileiny','Khimik','KhimGorodok','Mashinostroitel','Troitsky','Railway Station area','Bochka','Olympic area'], 'Chirchiq local-area alias still needs a verified standalone spatial match.'),
  ...gaps('Chirchiq', 'poi', ['Chirchiq River','Chirchiq Pedagogical University','Maxam-Chirchiq'], 'Chirchiq landmark still needs a verified spatial match.'),

  ...gaps('Kokand', 'local_area', ['Center','Old City','Khudoyar Khan area','Orda','Chorsu','Dangara Road','Railway Station area'], 'Kokand local-area alias still needs a verified standalone spatial match.'),
  ...gaps('Kokand', 'poi', ['Jami Mosque','Norbutabiy Madrasa','Kokand Bazaar'], 'Kokand landmark still needs a verified spatial match.'),

  ...gaps('Margilan', 'local_area', ['Center','Old City','Kumtepa','Yodgorlik','Atlas','Railway Station area'], 'Margilan local-area alias still needs a verified standalone spatial match.'),
  ...gaps('Margilan', 'poi', ['Kumtepa Bazaar','Yodgorlik Silk Factory'], 'Margilan landmark still needs a verified spatial match.'),
].map(Object.freeze));

const gapKeys = new Set(UZ_SECONDARY_COVERAGE_GAPS.map((gap) => [gap.country, gap.city, gap.type, gap.canonical].map(normalize).join('|')));

export function isUzSecondaryCoverageGap(input) {
  if (!input?.country || !input?.canonical) return false;
  return gapKeys.has([input.country, input.city, input.type || 'city', input.canonical].map(normalize).join('|'));
}
