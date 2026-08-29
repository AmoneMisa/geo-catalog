const normalize = (value) => String(value ?? '')
  .normalize('NFKC')
  .trim()
  .toLowerCase()
  .replace(/[’ʻʼ‘`´]/g, "'")
  .replace(/[^\p{L}\p{N}]+/gu, '-')
  .replace(/^-+|-+$/g, '');

const gaps = (city, type, canonicals, reason) => canonicals.map((canonical) => ({ country: 'UZ', city, type, canonical, reason }));

export const UZ_TAIL_COVERAGE_GAPS = Object.freeze([
  ...gaps('Denov', 'local_area', ['Center','Old Market','New Market','Chaganiyon','Railway Station area'], 'Denov local-area alias still needs a verified standalone spatial match.'),
  ...gaps('Asaka', 'local_area', ['Center','Auto Plant area','Old City','Railway Station area'], 'Asaka local-area alias still needs a verified standalone spatial match.'),
  ...gaps('Asaka', 'poi', ['Dehqon Bazaar'], 'Asaka landmark still needs a verified spatial match.'),
  ...gaps('Kogon', 'local_area', ['Center','Railway Station area','Railway Workers','Bukhara direction'], 'Kogon local-area alias still needs a verified standalone spatial match.'),
  ...gaps('Kattakurgan', 'local_area', ['Center','Old City','Railway Station area','Bazaar'], 'Kattakurgan local-area alias still needs a verified standalone spatial match.'),
  ...gaps('Kattakurgan', 'poi', ['Kattakurgan Reservoir'], 'Regional reservoir is intentionally not parented to Kattakurgan city until region/natural-feature hierarchy is modeled.'),
  ...gaps('Urgut', 'local_area', ['Center','Navoiy','Samarkand direction'], 'Urgut local-area alias still needs a verified standalone spatial match.'),
  ...gaps('Yangiyol', 'local_area', ['Center','Railway Station area','Samarkand Highway','Tashkent direction'], 'Yangiyol local-area alias still needs a verified standalone spatial match.'),
  ...gaps('Yangiyer', 'microdistrict', ['1 microdistrict','2 microdistrict','3 microdistrict','4 microdistrict'], 'Yangiyer numbered microdistrict still needs a verified neighbourhood/residential object.'),
  ...gaps('Yangiyer', 'local_area', ['Center','Railway Station area'], 'Yangiyer local-area alias still needs a verified standalone spatial match.'),
  ...gaps('Shirin', 'local_area', ['Center','Energetik','Farhod','Syrdarya'], 'Shirin local-area alias still needs a verified standalone spatial match.'),
  ...gaps('Shirin', 'poi', ['HPP'], 'Shirin landmark still needs a verified spatial match.'),
  ...gaps('Gazalkent', 'local_area', ['Center','Charvak direction','Bostanlyk direction'], 'Gazalkent local-area alias still needs a verified standalone spatial match.'),
  ...gaps('Chartak', 'local_area', ['Center','Namangan Road'], 'Chartak local-area alias still needs a verified standalone spatial match.'),
  ...gaps('Chust', 'local_area', ['Center'], 'Chust local-area alias still needs a verified standalone spatial match.'),
  ...gaps('Chust', 'poi', ['Chust Knives','Doppi'], 'Chust landmark still needs a verified spatial match.'),
  ...gaps('Kosonsoy', 'local_area', ['Center','Chust Road'], 'Kosonsoy local-area alias still needs a verified standalone spatial match.'),
  ...gaps('Kosonsoy', 'poi', ['Mug qala'], 'Kosonsoy landmark still needs a verified spatial match.'),
  ...gaps('Khojeyli', 'local_area', ['Center','Nukus direction','Railway Station area'], 'Khojeyli local-area alias still needs a verified standalone spatial match.'),
  ...gaps('Takhiatash', 'local_area', ['Center'], 'Takhiatash local-area alias still needs a verified standalone spatial match.'),
  ...gaps('Takhiatash', 'poi', ['Amu Darya'], 'Regional natural feature is intentionally not parented to Takhiatash city until natural-feature hierarchy is modeled.'),
  ...gaps('Kungrad', 'local_area', ['Center','Railway Station area','Ustyurt direction','Muynak direction'], 'Kungrad local-area alias still needs a verified standalone spatial match.'),
  ...gaps('Muynak', 'poi', ['Aral Sea','Aralkum'], 'Regional natural feature is intentionally not parented to Muynak until natural-feature/region hierarchy is modeled.'),
  ...gaps('Beruniy', 'local_area', ['Center','Turtkul Road'], 'Beruniy local-area alias still needs a verified standalone spatial match.'),
  ...gaps('Turtkul', 'local_area', ['Center','Bazaar','Railway Station area'], 'Turtkul local-area alias still needs a verified standalone spatial match.'),
  ...gaps('Shahrixon', 'local_area', ['Center','Market','Andijan direction'], 'Shahrixon local-area alias still needs a verified standalone spatial match.'),
  ...gaps('Xonobod', 'poi', ['Andijan Reservoir'], 'Regional reservoir is intentionally not parented to Xonobod city until region/natural-feature hierarchy is modeled.'),
].map(Object.freeze));

const gapKeys = new Set(UZ_TAIL_COVERAGE_GAPS.map((gap) => [gap.country, gap.city, gap.type, gap.canonical].map(normalize).join('|')));

export function isUzTailCoverageGap(input) {
  if (!input?.country || !input?.canonical) return false;
  return gapKeys.has([input.country, input.city, input.type || 'city', input.canonical].map(normalize).join('|'));
}
