const normalize = (value) => String(value ?? '')
  .normalize('NFKC')
  .trim()
  .toLowerCase()
  .replace(/[’ʻʼ‘`´]/g, "'")
  .replace(/[^\p{L}\p{N}]+/gu, '-')
  .replace(/^-+|-+$/g, '');

const gaps = (country, city, type, canonicals, reason) => canonicals.map((canonical) => ({ country, city, type, canonical, reason }));

export const GEO_COVERAGE_GAPS = Object.freeze([
  ...gaps('UZ', 'Tashkent', 'microdistrict', ['Manzara'], 'Official Tashkent microdistrict name, but no independently verifiable standalone OSM object or boundary was found.'),
  ...gaps('UZ', 'Tashkent', 'mahalla', [
    "Bog'ko'cha", "Bog'bon", 'Shifokorlar', "Chamanbog'",
  ], 'Official mahalla name from the lexicon; no independently verified spatial object or boundary is available yet.'),
  ...gaps('UZ', 'Tashkent', 'local_area', [
    'Shimoliy Olmazor-1', 'Shifokorlar-5', 'Shifokorlar-6',
  ], 'Lexicon area name remains unresolved until a standalone owner or defensible map center can be verified; a same-name street, stop, mahalla, or isolated building address is not sufficient.'),

  ...gaps('UZ', 'Samarkand', 'mahalla', ['Shirin', "Cho'pon ota"], 'Official lexicon entity; verified spatial object still pending.'),
  ...gaps('UZ', 'Samarkand', 'local_area', ['Siyob', 'Center', 'Geofizika', 'Super Market area'], 'Lexicon local area still needs a verified standalone spatial match.'),
  ...gaps('UZ', 'Samarkand', 'residential_complex', ['Bogishamol City', 'Marokand Avenue', 'Registan Residence'], 'Lexicon residential complex still needs a verified standalone spatial match.'),
  ...gaps('UZ', 'Samarkand', 'poi', ['Youth Park'], 'Lexicon landmark still needs a verified spatial match.'),

  ...gaps('UZ', 'Namangan', 'mahalla', ['Obihayot', 'Porloq', 'Mustaqillikning 5 yilligi'], 'Official mahalla is confirmed, but no verified standalone spatial boundary/locality object is available yet.'),
  ...gaps('UZ', 'Namangan', 'local_area', ['Center', 'North', 'Chortoq area', 'Uychi area', 'Turaqorgon area', 'Galaba', 'Bobur', 'Navoiy', 'Islom Karimov', 'Qoqimboyshox', 'Afrosiyob', 'Boburshox', 'Ibrat', 'Nodira'], 'Lexicon local area still needs a verified standalone spatial match.'),
  ...gaps('UZ', 'Namangan', 'poi', ['Yangi Ozbekiston Park'], 'Lexicon landmark still needs a verified spatial match.'),

  ...gaps('UZ', 'Andijan', 'mahalla', ['Obod', "Ma'rifat", 'Mustaqillikning 21 yilligi', "Taxtako'prik"], 'Official lexicon mahalla; verified standalone spatial boundary/locality object still pending.'),
  ...gaps('UZ', 'Andijan', 'local_area', ['Center', 'Old City', 'New City', 'Bobur', 'Navoiy', 'Mashinasozlar', 'North', 'South-West'], 'Lexicon local area still needs a verified standalone spatial match.'),

  ...gaps('UZ', 'Fergana', 'local_area', ['Qirguli', 'Neftchi', 'Center', 'Mustaqillik', 'Margilon Road', 'Navoiy'], 'Lexicon local area still needs a verified standalone spatial match.'),

  ...gaps('UZ', 'Bukhara', 'mahalla', ['M. Narshaxiy', 'S. Raximov nomli 17-MFY'], 'Official lexicon mahalla; no verified standalone spatial boundary/locality object is available yet.'),
  ...gaps('UZ', 'Bukhara', 'local_area', ['Center', 'Gijduvon Road', 'Gazli Road', 'Railway Station area', 'Bukhara-1', 'Bukhara-2', 'University area', 'Namozgoh', 'Sharq'], 'Bukhara local area still needs a verified standalone spatial match.'),

  ...gaps('UZ', 'Qarshi', 'mahalla', ['Navo', 'Gungon', 'Buyuk Turon'], 'Official lexicon mahalla; verified standalone spatial boundary/locality object still pending.'),
  ...gaps('UZ', 'Qarshi', 'local_area', ['Center', 'Old City', 'Geolog', 'Sharq', 'Paxtazor', 'Qat', 'Xonobod', 'Jayxun'], 'Lexicon local area still needs a verified standalone spatial match.'),

  ...gaps('UZ', 'Nukus', 'mahalla', [
    'Bes tobe', 'Juwazshı', 'Qarataw', 'Janabazar', 'Bereket', 'Qizil qum', 'Gúzar', 'Isbilermenler aymagi', 'Darbent', 'Nawkan baǵ', 'Abat makan', "Jasil bag'", "Shig'is", 'Allaniyaz Qaxraman', 'Ata makan', 'Jolshilar', 'Qutli qonis', 'Hawa joli', "Botanika bag'i", 'Taslaq', 'Qum awil', 'Qutli makan', 'Aydin jol', 'Shimbay shayxana', 'Sarbinaz', 'Eliabat', 'Shayirlar awili', 'Tungish qonis', 'Qurilisshi', 'Almazar', 'Ornek', 'Jana zaman', 'Qos kol', 'Baqshiliq', 'Tinishliq', 'Xaliqlar dosligi', 'Boz awil', 'Jas awlad', 'Qos bulaq', 'Aq jagis', 'Kok ozek', 'Amudarya', 'Tele oray', 'Shadli awil', 'Altin jagis', 'Qumbiz awil', 'Nawpir',
  ], 'Official Nukus MFY from parsing-lexicon; verified standalone OSM neighbourhood/residential geometry still pending.'),
  ...gaps('UZ', 'Nukus', 'local_area', ['Center', 'Dosliq', 'Beruniy area', 'Qizketken', 'Nayman', 'Turtkul Road', 'Khojeyli Road'], 'Nukus local-area alias still needs a verified standalone spatial match.'),
  ...gaps('UZ', 'Nukus', 'poi', ['Berdakh Square'], 'Lexicon landmark still needs a verified spatial match.'),

  ...gaps('UZ', 'Urgench', 'mahalla', ["Ma'rifat", 'Al Xorazmiy', 'Ashxobod'], 'Official Urgench mahalla; verified standalone OSM neighbourhood/residential geometry still pending.'),
  ...gaps('UZ', 'Urgench', 'local_area', ['Center', 'Olimpiya', 'Navoiy', 'Gurlan Road', 'Khiva Road'], 'Urgench local-area alias still needs a verified standalone spatial match.'),
].map(Object.freeze));

const gapKeys = new Set(GEO_COVERAGE_GAPS.map((gap) => [gap.country, gap.city, gap.type, gap.canonical].map(normalize).join('|')));

export function isGeoCoverageGap(input) {
  if (!input?.country || !input?.canonical) return false;
  return gapKeys.has([input.country, input.city, input.type || 'city', input.canonical].map(normalize).join('|'));
}
