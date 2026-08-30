const normalize = (value) => String(value ?? '')
  .normalize('NFKC')
  .trim()
  .toLowerCase()
  .replace(/[’ʻʼ‘`´]/g, "'")
  .replace(/[^\p{L}\p{N}]+/gu, '-')
  .replace(/^-+|-+$/g, '');

const gaps = (country, city, type, canonicals, reason) => canonicals.map((canonical) => ({ country, city, type, canonical, reason }));

export const GEO_COVERAGE_GAPS = Object.freeze([
  ...gaps('UZ', 'Tashkent', 'local_area', ['Stroygorod'], 'No verified standalone spatial locality match yet.'),
  ...gaps('UZ', 'Tashkent', 'residential_complex', ['Do‘stlar'], 'The complex and its Yunusabad-5 address are confirmed, but a reliably sourced building center or footprint is still unavailable.'),
  ...gaps('UZ', 'Tashkent', 'microdistrict', ['Manzara'], 'Official Tashkent microdistrict name, but no independently verifiable standalone OSM object or boundary was found.'),
  ...gaps('UZ', 'Tashkent', 'mahalla', [
    'Ahmad Yugnakiy','Humoyun',"Bog'ko'cha",'Gulobod','Qalqon',"Bog'bon",'Shifokorlar',"Chamanbog'",'Asalobod',"Sug'diyona",'Olimpiya','Sebzor','Yangi Choshtepa','Traktorsozlar',
  ], 'Official mahalla name from the lexicon; no independently verified spatial object or boundary is available yet.'),
  ...gaps('UZ', 'Tashkent', 'local_area', [
    'Manzara','Takhtapul','Taxtapul','Suvsoz-3','Suvsoz-4','Suvsoz-5','Humoyun',"Qo'yliq-3","Qo'yliq-4","Qo'yliq-5","Qo'yliq-6",'Parkent-Siolkovskiy','Qalqon',"Bog'bon",'Minora','Guruchariq','Muxbir','Shimoliy Olmazor-1','Shimoliy Olmazor-2','Taraqqiyot-1','Taraqqiyot-2','Taraqqiyot-3','Taraqqiyot-4','Shifokorlar-2','Shifokorlar-3','Shifokorlar-4','Shifokorlar-5','Shifokorlar-6','Beruniy-B1','Beruniy-B3',"So'lim", "Sug'diyona",
  ], 'Lexicon area name still needs a verified standalone spatial match.'),

  ...gaps('UZ', 'Samarkand', 'mahalla', ["Navro'z",'Shirin','Chilkuduk',"Cho'pon ota"], 'Official lexicon entity; verified spatial object still pending.'),
  ...gaps('UZ', 'Samarkand', 'microdistrict', ['Sogdiana','Sartepa','Sat-Tepo','Kimyogarlar','Vokzal','Universitet','Registan','Dagbitskaya','Rudaki'], 'Lexicon microdistrict still needs a verified standalone spatial match.'),
  ...gaps('UZ', 'Samarkand', 'local_area', ['Siyob','Registon','Center','University area','Dahbed','Railway Station area','Rudakiy','Gagarin area','Mirzo Ulugbek area','Spitamen','Panjakent Road','Geofizika','Sugdiyona','Super Market area','Dinamo area',"So'zangaron",'Buyuk Ipak Yoli'], 'Lexicon local area still needs a verified standalone spatial match.'),
  ...gaps('UZ', 'Samarkand', 'residential_complex', ['Samarkand City','Bogishamol City','Marokand Avenue','Silk Road Residence','Registan Residence'], 'Lexicon residential complex still needs a verified standalone spatial match.'),
  ...gaps('UZ', 'Samarkand', 'poi', ['Samarkand City','Youth Park','Yangi Ozbekiston Park','University Boulevard'], 'Lexicon landmark still needs a verified spatial match.'),

  ...gaps('UZ', 'Namangan', 'mahalla', ['Obihayot','Porloq','Mustaqillikning 5 yilligi'], 'Official mahalla is confirmed, but no verified standalone spatial boundary/locality object is available yet.'),
  ...gaps('UZ', 'Namangan', 'local_area', ['Center','North','Chortoq area','Uychi area','Turaqorgon area','Galaba','Bobur','Navoiy','Islom Karimov','Qoqimboyshox','Afrosiyob','Boburshox','Ibrat','Nodira'], 'Lexicon local area still needs a verified standalone spatial match.'),
  ...gaps('UZ', 'Namangan', 'poi', ['Yangi Ozbekiston Park'], 'Lexicon landmark still needs a verified spatial match.'),

  ...gaps('UZ', 'Andijan', 'mahalla', ["Bo'ston",'Obod','Temur Malik',"Qoraqo'rg'on","Ma'rifat",'Mustaqillikning 21 yilligi','Birlashgan',"Taxtako'prik"], 'Official lexicon mahalla; verified standalone spatial boundary/locality object still pending.'),
  ...gaps('UZ', 'Andijan', 'local_area', ['Center','Old City','New City','Bobur','Navoiy','Mashinasozlar','North','South-West','University area','Railway Station area','Airport area'], 'Lexicon local area still needs a verified standalone spatial match.'),
  ...gaps('UZ', 'Andijan', 'poi', ['Bobur Square'], 'Lexicon landmark still needs a verified spatial match.'),

  ...gaps('UZ', 'Fergana', 'mahalla', ["Ma'rifat"], 'Official lexicon mahalla; verified standalone spatial boundary/locality object still pending.'),
  ...gaps('UZ', 'Fergana', 'local_area', ['Qirguli','Neftchi','Center','Mustaqillik','Al-Fargoniy','Margilon Road','Railway Station area','Airport area','University area','Navoiy'], 'Lexicon local area still needs a verified standalone spatial match.'),
  ...gaps('UZ', 'Fergana', 'poi', ['Independence Square'], 'Lexicon landmark still needs a verified spatial match.'),

  ...gaps('UZ', 'Bukhara', 'mahalla', ['M. Narshaxiy','S. Raximov nomli 17-MFY'], 'Official lexicon mahalla; verified standalone spatial boundary/locality object still pending.'),
  ...gaps('UZ', 'Bukhara', 'local_area', ['Old City','Center','Gijduvon Road','Gazli Road','Railway Station area','Bukhara-1','Bukhara-2','University area','Namozgoh','Sharq','Mohi Xosa'], 'Lexicon local area still needs a verified standalone spatial match.'),

  ...gaps('UZ', 'Qarshi', 'mahalla', ['Navo','Gungon','Buyuk Turon'], 'Official lexicon mahalla; verified standalone spatial boundary/locality object still pending.'),
  ...gaps('UZ', 'Qarshi', 'local_area', ['Center','Old City','Geolog','Sharq','Paxtazor','Nasaf','Qat','Railway Station area','Airport area','University area','Xonobod','Jayxun'], 'Lexicon local area still needs a verified standalone spatial match.'),

  ...gaps('UZ', 'Nukus', 'mahalla', [
    'Bes tobe','Juwazshı','Nurli bostan','Qarataw','Janabazar','Bereket','Qizil qum','Gúzar','Jeke terek','Isbilermenler aymagi','Darbent','Nawkan baǵ','Abat makan',"Jasil bag'","Shig'is",'Uzin kol','Amanliq guzari','Allaniyaz Qaxraman','Shimbay guzari','Ata makan','Jolshilar','Qutli qonis','Dosliq guzari','Hawa joli',"Botanika bag'i",'Taslaq','Qum awil','Qutli makan','Aydin jol','Shimbay shayxana','Sarbinaz','Eliabat','Shayirlar awili','Tungish qonis','Qurilisshi','Almazar','Ornek','Jana zaman','Qos kol','Aq otaw','Baqshiliq','Dosliq','Tinishliq','Xaliqlar dosligi','Boz awil','Jas awlad','Qos bulaq','Jiydeli baysin','Aq jagis','Kok ozek','Amudarya','Tele oray','Shadli awil','Altin jagis','Qumbiz awil','Nawpir','Bayterek'
  ], 'Official Nukus MFY from parsing-lexicon; verified standalone OSM neighbourhood/residential geometry still pending.'),
  ...gaps('UZ', 'Nukus', 'local_area', ['Center','Dosliq','Beruniy area','Qizketken','Nayman','Turtkul Road','Khojeyli Road','Airport area','Railway Station area'], 'Nukus local-area alias still needs a verified standalone spatial match.'),
  ...gaps('UZ', 'Nukus', 'poi', ['Berdakh Square'], 'Lexicon landmark still needs a verified spatial match.'),

  ...gaps('UZ', 'Urgench', 'mahalla', ['Mustaqillik','Feruz',"Ma'rifat","Yuqori bog'",'Al Xorazmiy','Besh mergan','Shodlik','Gulshan','Gulzor','Navbahor','Avesto','Ashxobod'], 'Official Urgench mahalla; verified standalone OSM neighbourhood/residential geometry still pending.'),
  ...gaps('UZ', 'Urgench', 'local_area', ['Center','Olimpiya','Railway Station area','Airport area','University area','Al-Xorazmiy area','Navoiy','Gurlan Road','Khiva Road'], 'Urgench local-area alias still needs a verified standalone spatial match.'),
].map(Object.freeze));

const gapKeys = new Set(GEO_COVERAGE_GAPS.map((gap) => [gap.country, gap.city, gap.type, gap.canonical].map(normalize).join('|')));

export function isGeoCoverageGap(input) {
  if (!input?.country || !input?.canonical) return false;
  return gapKeys.has([input.country, input.city, input.type || 'city', input.canonical].map(normalize).join('|'));
}
