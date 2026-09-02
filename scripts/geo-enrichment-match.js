const AREA_TYPES = new Set([
  'district',
  'microdistrict',
  'mahalla',
  'local_area',
  'suburb',
  'settlement',
  'development_area',
]);

const GENERIC_AREA_NAMES = new Set([
  'center',
  'centre',
  'markaz',
  'markaziy',
  'central',
]);

const CITY_CENTER_FALLBACK_RADIUS_M = 15_000;
const EXPLICIT_CITY_FALLBACK_RADIUS_M = 8_000;
const AREA_MARKER_RE = /\b(?:mahalla(?:si)?|mfy|mpj|mavze(?:si)?|massiv|massivi|daha(?:si)?|mikrorayon|microdistrict|district|neighbou?rhood|suburb|quarter|rayon|tumani|район|махалла|массив|квартал|микрорайон|мкр|ықшамаудан|шағын\s+аудан)\b/iu;
const NUMBERED_AREA_MARKER_RE = /\b(?:microdistrict|mikrorayon|mavze(?:si)?|massiv|massivi|daha(?:si)?|quarter|микрорайон|мкр|массив|квартал|ықшамаудан|шағын\s+аудан)\b/iu;
const AREA_CATEGORY_RE = /\b(?:boundary|place|landuse|administrative|district|neighbou?rhood|suburb|quarter|locality|residential)\b/i;
const NON_AREA_CATEGORY_RE = /\b(?:highway|amenity|shop|tourism|leisure|office|craft|building|historic|railway|public_transport|aeroway)\b/i;
const SEPARATE_LOCALITY_TYPE_RE = /\b(?:city|town|village|hamlet|settlement|administrative|municipality)\b/i;

const CITY_CYRILLIC_FOLD = Object.freeze({
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z',
  и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
  с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch',
  ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
  қ: 'k', ғ: 'g', ә: 'a', і: 'i', ң: 'n', ө: 'o', ұ: 'u', ү: 'u', һ: 'h',
  ў: 'o', ҳ: 'h',
  є: 'ye', ї: 'yi', ґ: 'g',
});

const POI_SEMANTIC_RULES = Object.freeze([
  [/\b(?:river|річка|река)\b/iu, /\b(?:river|waterway|stream|water|hydro)\b/i],
  [/\b(?:estuary|liman|лиман)\b/iu, /\b(?:water|estuary|lagoon|bay|hydro)\b/i],
  [/\b(?:pond|lake|озеро|став|пруд)\b/iu, /\b(?:pond|lake|reservoir|water|basin)\b/i],
  [/\b(?:island|islet|острів|остров)\b/iu, /\b(?:island|islet)\b/i],
  [/hes\b|ges\b|гес\b|гэс\b|hydroelectric|dam|гребл/iu, /\b(?:dam|hydro|hydroelectric|power|generator)\b/i],
  [/\b(?:railway\s+station|train\s+station|station|вокзал|станц(?:ія|ия))\b/iu, /\b(?:railway_station|train_station|station|railway)\b/i],
  [/\b(?:fortress|fort|castle|фортец(?:я|і)|крепост(?:ь|и)|замок)\b/iu, /\b(?:fortress|fort|castle|historic|attraction)\b/i],
  [/\b(?:square|площа|площадь|майдан)\b/iu, /\b(?:square|pedestrian)\b/i],
  [/\b(?:sea\s+port|port|порт)\b/iu, /\b(?:port|harbour|harbor|dock|terminal|industrial)\b/i],
  [/\b(?:monastery|монастир|монастырь)\b/iu, /\b(?:monastery|place_of_worship|religious|historic|attraction|castle)\b/i],
  [/\b(?:cathedral|church|собор|церкв)\b/iu, /\b(?:cathedral|church|place_of_worship|religious)\b/i],
  [/\b(?:park|парк)\b/iu, /\b(?:park|garden|recreation|leisure|wood|nature_reserve)\b/i],
  [/\b(?:mall|shopping\s+cent(?:er|re)|торгов(?:ий|ый)\s+центр|тц)\b/iu, /\b(?:mall|department_store|retail|shopping_centre|shopping_center)\b/i],
  [/\b(?:bridge|міст|мост)\b/iu, /\b(?:bridge|pedestrian|footway)\b/i],
  [/\b(?:embankment|набережн)\b/iu, /\b(?:pedestrian|footway|path|residential|road|street)\b/i],
  [/\b(?:fountain|фонтан)\b/iu, /\b(?:fountain|water)\b/i],
  [/\b(?:avenue|prospect|проспект)\b/iu, /\b(?:primary|secondary|tertiary|residential|road|pedestrian)\b/i],
  [/\b(?:alley|алея|аллея)\b/iu, /\b(?:park|garden|pedestrian|footway|path)\b/i],
  [/\b(?:reserve|заповідник|заповедник)\b/iu, /\b(?:nature_reserve|protected_area|park|island|islet|attraction|historic)\b/i],
  [/\b(?:sich|січ|сечь)\b/iu, /\b(?:historic|museum|attraction|archaeological_site|fort|fortress|castle)\b/i],
]);

export function normalizeGeoText(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/\p{M}+/gu, '')
    .replace(/ı/g, 'i')
    .replace(/(\d+)а\b/gu, '$1a')
    .replace(/[’ʻʼ‘`´]/g, "'")
    .replace(/\b(?:mahalla(?:si)?|mfy|mpj|mavze(?:si)?|massiv|massivi|daha(?:si)?|mikrorayon|microdistrict|district|rayon|район|махалла|массив|квартал|street|ko'chasi|ko‘chasi|koshesi|улица|ул|ықшамаудан|шағын\s+аудан)\b/giu, ' ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\b(\d+)\s+[aа]\b/gu, '$1a')
    .trim()
    .replace(/\s+/g, ' ');
}

function looseCityKey(value) {
  return normalizeGeoText(value)
    .split('')
    .map((char) => CITY_CYRILLIC_FOLD[char] ?? char)
    .join('');
}

function tokenDice(a, b) {
  const left = new Set(normalizeGeoText(a).split(' ').filter(Boolean));
  const right = new Set(normalizeGeoText(b).split(' ').filter(Boolean));
  if (!left.size || !right.size) return 0;
  let common = 0;
  for (const token of left) if (right.has(token)) common += 1;
  return (2 * common) / (left.size + right.size);
}

export function nameScore(query, label) {
  const a = normalizeGeoText(query);
  const b = normalizeGeoText(label);
  if (!a || !b) return 0;
  if (a === b) return 1;
  if (b.startsWith(`${a} `) || b.endsWith(` ${a}`)) return 0.95;
  if (b.includes(a) || a.includes(b)) return 0.9;
  return tokenDice(a, b);
}

function pointInBbox(candidate, bbox) {
  if (!bbox || !Number.isFinite(candidate?.lat) || !Number.isFinite(candidate?.lng)) return false;
  return candidate.lat >= bbox.south
    && candidate.lat <= bbox.north
    && candidate.lng >= bbox.west
    && candidate.lng <= bbox.east;
}

function haversineM(a, b) {
  if (![a?.lat, a?.lng, b?.lat, b?.lng].every(Number.isFinite)) return Infinity;
  const rad = (deg) => deg * Math.PI / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const lat1 = rad(a.lat);
  const lat2 = rad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function labelMentionsCityWithoutDistrictSuffix(row, candidate) {
  const city = normalizeGeoText(row.city);
  if (!city) return false;
  const text = normalizeGeoText(candidate.label);
  const tokens = text.split(' ');
  const index = tokens.indexOf(city);
  if (index < 0) return false;
  const next = tokens[index + 1] || '';
  return !['rayon', 'rayoni', 'tumani', 'district', 'oblast', 'region'].includes(next);
}

function providerTypeText(candidate) {
  return `${candidate.rawType || ''} ${candidate.meta?.category || ''}`.toLowerCase();
}

export function isCandidateInCity(row, candidate, cityGeo = null) {
  const expected = normalizeGeoText(row.city);
  const actual = normalizeGeoText(candidate.city);
  if (actual && (actual === expected || looseCityKey(actual) === looseCityKey(expected))) return true;
  if (pointInBbox(candidate, cityGeo?.bbox)) return true;

  if (actual && actual !== expected && SEPARATE_LOCALITY_TYPE_RE.test(providerTypeText(candidate))) {
    return false;
  }

  const distance = cityGeo?.center ? haversineM(candidate, cityGeo.center) : Infinity;
  if (actual && actual !== expected) {
    const radius = AREA_TYPES.has(row.type) ? CITY_CENTER_FALLBACK_RADIUS_M : EXPLICIT_CITY_FALLBACK_RADIUS_M;
    return distance <= radius;
  }

  if (distance <= CITY_CENTER_FALLBACK_RADIUS_M) return true;
  if (actual) return false;
  return labelMentionsCityWithoutDistrictSuffix(row, candidate);
}

export function providerTypeScore(row, candidate) {
  const type = providerTypeText(candidate);
  if (row.type === 'street') return /road|street|highway|living_street|primary|secondary|tertiary|service|pedestrian|unclassified/.test(type) ? 1 : 0.35;
  if (row.type === 'metro') return /station|subway|railway|public_transport|stop|transit/.test(type) ? 1 : 0.35;
  if (row.type === 'poi') return /amenity|tourism|shop|leisure|building|historic|office|place|stop|poi|marketplace|park|museum|airport|university|mall|department_store|retail|sports_centre|garden|botanical_garden|river|water|waterway|pond|lake|reservoir|estuary|lagoon|bay|square|castle|fort|train_station|railway_station|industrial|dam|hydro|island|islet|bridge|pedestrian|footway|place_of_worship|church|cathedral|nature_reserve|fountain/.test(type) ? 0.9 : 0.5;
  if (row.type === 'residential_complex') return /residential|building|apartments|housing|place/.test(type) ? 1 : 0.4;
  if (row.type === 'district') return /administrative|district|borough|boundary/.test(type) ? 1 : 0.2;
  if (row.type === 'microdistrict') {
    if (/administrative|district|neighbou?rhood|quarter/.test(type)) return 1;
    if (/\d/.test(normalizeGeoText(row.canonical))) return /residential|place|locality|landuse|suburb/.test(type) ? 0.3 : 0.2;
    return /residential|place|locality|landuse|suburb/.test(type) ? 0.75 : 0.2;
  }
  if (row.type === 'mahalla') {
    if (/administrative|neighbou?rhood|quarter|suburb/.test(type)) return 1;
    return /district|residential|place|locality|landuse/.test(type) ? 0.75 : 0.2;
  }
  if (row.type === 'local_area') {
    if (/administrative|neighbou?rhood|quarter|suburb|locality/.test(type)) return 1;
    return /district|residential|place|landuse/.test(type) ? 0.75 : 0.2;
  }
  if (row.type === 'suburb') {
    if (/suburb|neighbou?rhood|quarter|locality/.test(type)) return 1;
    return /residential|place|administrative|district/.test(type) ? 0.75 : 0.2;
  }
  if (row.type === 'settlement') return /village|hamlet|town|settlement|locality|suburb|neighbou?rhood|place/.test(type) ? 1 : 0.2;
  if (row.type === 'development_area') return /residential|neighbou?rhood|quarter|administrative|district|place|locality|landuse/.test(type) ? 1 : 0.2;
  return 0.6;
}

function isAreaTypeCompatible(row, candidate) {
  const type = providerTypeText(candidate);
  if (!AREA_TYPES.has(row.type)) return true;

  if (NON_AREA_CATEGORY_RE.test(candidate.meta?.category || '')) return false;

  if (row.type === 'settlement') return /village|hamlet|town|settlement|locality|suburb|neighbou?rhood|place/.test(type);
  if (row.type === 'district') return /administrative|district|borough|boundary/.test(type);

  if (row.type === 'microdistrict' && /\d/.test(normalizeGeoText(row.canonical))) {
    return /administrative|district|neighbou?rhood|quarter/.test(type);
  }

  return AREA_CATEGORY_RE.test(type);
}

function isPoiTypeCompatible(row, candidate) {
  if (row.type !== 'poi') return true;
  const semanticText = `${row.canonical || ''} ${(row.aliases || []).join(' ')} ${candidate.query || ''}`;
  const rule = POI_SEMANTIC_RULES.find(([namePattern]) => namePattern.test(semanticText));
  if (!rule) return true;
  return rule[1].test(providerTypeText(candidate));
}

function firstLabelPart(candidate) {
  return String(candidate.label || '').split(',')[0].trim();
}

function hasDirectAreaNameEvidence(row, candidate) {
  if (!AREA_TYPES.has(row.type)) return true;
  const first = firstLabelPart(candidate);
  const firstNormalized = normalizeGeoText(first);
  const queryNormalized = normalizeGeoText(candidate.query || row.canonical);
  const canonicalNormalized = normalizeGeoText(row.canonical);
  if (!firstNormalized || !canonicalNormalized) return false;

  const nameMatches = firstNormalized === queryNormalized
    || firstNormalized === canonicalNormalized
    || firstNormalized.includes(queryNormalized)
    || firstNormalized.includes(canonicalNormalized);
  if (!nameMatches) return false;

  if (GENERIC_AREA_NAMES.has(canonicalNormalized) || GENERIC_AREA_NAMES.has(queryNormalized)) {
    return firstNormalized === queryNormalized
      || firstNormalized === canonicalNormalized
      || AREA_MARKER_RE.test(first);
  }

  if (row.type === 'microdistrict' && /\d/.test(canonicalNormalized)) {
    const canonicalNumbers = canonicalNormalized.match(/\d+[a-zа-я]?/giu) || [];
    const firstNumbers = firstNormalized.match(/\d+[a-zа-я]?/giu) || [];
    if (!canonicalNumbers.every((number) => firstNumbers.includes(number))) return false;
    if (!NUMBERED_AREA_MARKER_RE.test(first)) return false;
  }

  return true;
}

export function isAutoAcceptEligible(row, candidate, cityGeo = null) {
  if (!candidate?.persistable) return false;
  if (!isCandidateInCity(row, candidate, cityGeo)) return false;
  if (!isAreaTypeCompatible(row, candidate)) return false;
  if (!isPoiTypeCompatible(row, candidate)) return false;
  if (!hasDirectAreaNameEvidence(row, candidate)) return false;
  return true;
}

export function candidateScore(row, candidate, cityGeo = null) {
  const head = firstLabelPart(candidate);
  const directName = nameScore(candidate.query, head);
  const contextualName = nameScore(candidate.query, candidate.label);
  const name = Math.max(directName, contextualName * 0.82);
  const city = isCandidateInCity(row, candidate, cityGeo) ? 1 : 0.2;
  const parent = row.parent
    ? (normalizeGeoText(candidate.label).includes(normalizeGeoText(row.parent)) ? 1 : 0.45)
    : 0.75;
  const type = providerTypeScore(row, candidate);
  return Math.min(1, name * 0.68 + city * 0.17 + type * 0.10 + parent * 0.05);
}
