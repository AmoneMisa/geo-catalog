const normalize = (value) => String(value ?? '')
  .normalize('NFKC')
  .trim()
  .toLowerCase()
  .replace(/[’ʻʼ‘`´]/g, "'")
  .replace(/[^\p{L}\p{N}]+/gu, '-')
  .replace(/^-+|-+$/g, '');

const gaps = (city, type, canonicals, reason) => canonicals.map((canonical) => ({
  country: 'UZ', city, type, canonical, reason,
}));

// Entries introduced by newer parsing-lexicon geography revisions that do not
// yet have independently verified spatial owners in geo-catalog. Keeping them
// explicit prevents parser coverage from being mistaken for geocoded coverage.
const reasonLexicon098 = 'Introduced by parsing-lexicon 0.9.8 expanded geography; independently verified spatial owner is still pending.';

export const UZ_EXPANSION_COVERAGE_GAPS = Object.freeze([
  ...gaps('Samarkand', 'poi', ['Central Park'], 'Current lexicon canonical for Alisher Navoiy Park; exact verified park geometry is still pending.'),
  ...gaps('Samarkand', 'local_area', ['So‘g‘diyona-А mikrotumani'], reasonLexicon098),
  ...gaps('Samarkand', 'street', ["Morоqadn 1-tor ko'chasi"], reasonLexicon098),
  ...gaps('Namangan', 'street', [
    'Аbay 1-berk koʼchasi', 'Аbdulla Qahhor 1-berk koʻchasi', 'Аfrosiyob 4-tor koʻchasi',
    'Аndijon 4-berk koʻchasi', 'Аndijon 5-berk koʻchasi', 'Аxsi 18-berk koʼchasi',
    'Аxsi 19-berk koʼchasi', 'Аxsi 19А berk koʼchasi', 'Аxsi 2-tor 1-berk koʼchasi',
    'Аxsi 2-tor koʼchasi', 'Аxsi 21-berk koʼchasi', 'Аxsi 23-berk koʼchasi',
    'Аxsi 24-berk koʼchasi', 'Аxsi 26-berk koʼchasi', 'Аxsi 27-berk koʼchasi',
    'Аxsi 29-berk koʼchas', 'Аxsi 3-tor 1-berk koʼchasi', 'Аxsi 4-tor 1-berk koʻchasi',
    'Аxsi 4-tor 2-berk koʻchasi', 'Аxsi 5-tor koʼchasi', 'Тuraqoʻrgʻon 3-tor 1-berk koʻchasi',
    "Axsi 6А berk ko'chasi", 'Buramatut 10а-berk koʼchasi', "Janubiy Аylanma Yo'li 2-berk koʼchasi",
    'Margʻilon 16А berk koʻchasi', 'Margʻilon 4А berk koʻchasi', 'Temiryoʻl 6-tor 2А berk koʻchasi',
    'Yangiаriq 6-tor koʼchasi',
  ], reasonLexicon098),
  ...gaps('Andijan', 'street', [
    'F.Egamberdiyev kо‘chasi', 'K.Аxmadiy 1-tor koʻchasi', 'Tinchlik kо‘chasi',
    'Universitet kо‘chasi', 'Urоjayniy koʻchasi', 'V.Аzimov koʻchasi',
  ], reasonLexicon098),
  ...gaps('Qarshi', 'local_area', ['Geolog мahallasi'], reasonLexicon098),
  ...gaps('Nukus', 'street', ['Mehir gúyа kóshesi'], reasonLexicon098),
  ...gaps('Urgench', 'local_area', ['Mahallasi № 5 "Аl-Horazmiy\'"'], reasonLexicon098),
  ...gaps('Urgench', 'street', ["Mаxtumkuli ko'chasi"], reasonLexicon098),
  ...gaps('Jizzakh', 'local_area', ['Бoлгали'], reasonLexicon098),
  ...gaps('Jizzakh', 'street', ["Сhinozlik ko'chasi", "Baхmal ko'chasi", "Baхmalsoy ko'chasi"], reasonLexicon098),
  ...gaps('Kokand', 'local_area', ['Deхkonobod', 'Kaldushоn', 'Shаyimbek'], reasonLexicon098),
  ...gaps('Margilan', 'street', ['Аsilobod berk koʼchasi', 'Barkamol Аvlod koʻchasi'], reasonLexicon098),
  ...gaps('Termez', 'local_area', ['Uzbекistаn'], reasonLexicon098),
  ...gaps('Termez', 'street', ["Мehridaryo ko'chasi"], reasonLexicon098),
  ...gaps('Almalyk', 'local_area', ['Soʻfi Ollоyor mahallasi'], reasonLexicon098),
  ...gaps('Angren', 'street', ['A373 "Камчик"'], reasonLexicon098),
  ...gaps('Denov', 'street', ['Даштобод Kучаси'], reasonLexicon098),
  ...gaps('Asaka', 'street', ['Fayziobod kо‘chasi', 'Fayzobod kо‘chasi', 'Toshloq Kо‘chasi'], reasonLexicon098),
  ...gaps('Yangiyol', 'local_area', ["Bog'chasаrоy"], reasonLexicon098),
  ...gaps('Xonobod', 'local_area', ['Chimiоn'], reasonLexicon098),
  ...gaps('Xonobod', 'street', ['Буюк Tурон'], reasonLexicon098),
].map(Object.freeze));

const gapKeys = new Set(UZ_EXPANSION_COVERAGE_GAPS.map((gap) =>
  [gap.country, gap.city, gap.type, gap.canonical].map(normalize).join('|'),
));

export function isUzExpansionCoverageGap(input) {
  if (!input?.country || !input?.canonical) return false;
  return gapKeys.has([input.country, input.city, input.type || 'city', input.canonical].map(normalize).join('|'));
}
