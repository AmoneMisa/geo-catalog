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

const CITY_CENTER_FALLBACK_RADIUS_M = 35_000;
const AREA_MARKER_RE = /\b(?:mahalla(?:si)?|mfy|mpj|mavze(?:si)?|massiv|massivi|daha(?:si)?|mikrorayon|microdistrict|district|neighbou?rhood|suburb|quarter|rayon|tumani|район|махалла|массив|квартал|микрорайон|мкр|ықшамаудан|шағын\s+аудан)\b/iu;
const NUMBERED_AREA_MARKER_RE = /\b(?:microdistrict|mikrorayon|mavze(?:si)?|massiv|massivi|daha(?:si)?|quarter|микрорайон|мкр|массив|квартал|ықшамаудан|шағын\s+аудан)\b/iu;
const AREA_CATEGORY_RE = /\b(?:boundary|place|landuse|administrative|district|neighbou?rhood|suburb|quarter|locality|residential)\b/i;
const NON_AREA_CATEGORY_RE = /\b(?:highway|amenity|shop|tourism|leisure|office|craft|building|historic|railway|public_transport|aeroway)\b/i;

export function normalizeGeoText(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/\p{M}+/gu, '')
    .replace(/ı/g, 'i')
    .replace(/[’ʻʼ‘`´]/g, "'")
    .replace(/\b(?:mahalla(?:si)?|mfy|mpj|mavze(?:si)?|massiv|massivi|daha(?:si)?|mikrorayon|microdistrict|district|rayon|район|махалла|массив|квартал|street|ko'chasi|ko‘chasi|koshesi|улица|ул|ықшамаудан|шағын\s+аудан)\b/giu, ' ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ');
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

export function isCandidateInCity(row, candidate, cityGeo = null) {
  const expected = normalizeGeoText(row.city);
  const actual = normalizeGeoText(candidate.city);
  if (actual && actual === expected) return true;
  if (pointInBbox(candidate, cityGeo?.bbox)) return true;
  if (cityGeo?.center && haversineM(candidate, cityGeo.center) <= CITY_CENTER_FALLBACK_RADIUS_M) return true;
  if (actual) return false;
  return labelMentionsCityWithoutDistrictSuffix(row, candidate);
}

function providerTypeText(candidate) {
  return `${candidate.rawType || ''} ${candidate.meta?.category || ''}`.toLowerCase();
}

export function providerTypeScore(row, candidate) {
  const type = providerTypeText(candidate);
  if (row.type === 'street') return /road|street|highway|living_street|primary|secondary|tertiary|service|pedestrian|unclassified/.test(type) ? 1 : 0.35;
  if (row.type === 'metro') return /station|subway|railway|public_transport|stop|transit/.test(type) ? 1 : 0.35;
  if (row.type === 'poi') return /amenity|tourism|shop|leisure|building|historic|office|place|stop|poi|marketplace|park|museum|airport|university|mall|sports_centre|garden|botanical_garden/.test(type) ? 0.9 : 0.5;
  if (row.type === 'residential_complex') return /residential|building|apartments|housing|place/.test(type) ? 1 : 0.4;
  if (row.type === 'district') return /administrative|district|borough|boundary/.test(type) ? 1 : 0.2;
  if (row.type === 'microdistrict') {
    if (/administrative|district|neighbou?rhood|quarter/.test(type)) return 1;
    return /residential|place|locality|landuse/.test(type) ? 0.75 : 0.2;
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

  // Nominatim exposes both a feature type and a feature class/category. A
  // street, shop or cafe may contain the target area in its address, but it is
  // not the spatial entity itself.
  if (NON_AREA_CATEGORY_RE.test(candidate.meta?.category || '')) return false;

  if (row.type === 'settlement') return /village|hamlet|town|settlement|locality|suburb|neighbou?rhood|place/.test(type);
  if (row.type === 'district') return /administrative|district|borough|boundary/.test(type);
  return AREA_CATEGORY_RE.test(type);
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
