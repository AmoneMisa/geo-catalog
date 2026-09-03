const DEFAULT_DISCOVERY_RADIUS_M = 8_000;
const MIN_DISCOVERY_RADIUS_M = 6_000;
const MAX_DISCOVERY_RADIUS_M = 12_000;
const STREET_HIGHWAY_RE = '^(motorway|trunk|primary|secondary|tertiary|residential|living_street|unclassified|pedestrian)$';
const RESIDENTIAL_COMPLEX_RE = /(?:\b(?:residence|residenc(?:e|y)|residential|complex| ЖК |zhk)\b|(?:^|\s)(?:ЖК|ТЖК)(?:\s|$)|житлов(?:ий|ого)\s+комплекс)/iu;

function normalize(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/\p{M}+/gu, '')
    .replace(/[’ʻʼ‘`´]/g, "'")
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function tokenDice(a, b) {
  const left = new Set(normalize(a).split(' ').filter(Boolean));
  const right = new Set(normalize(b).split(' ').filter(Boolean));
  if (!left.size || !right.size) return 0;
  let common = 0;
  for (const token of left) if (right.has(token)) common += 1;
  return (2 * common) / (left.size + right.size);
}

function nameScore(a, b) {
  const left = normalize(a);
  const right = normalize(b);
  if (!left || !right) return 0;
  if (left === right) return 1;
  if (right.startsWith(`${left} `) || right.endsWith(` ${left}`)) return 0.95;
  if (right.includes(left) || left.includes(right)) return 0.9;
  return tokenDice(left, right);
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

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function discoveryRadiusM(cityGeo) {
  const accuracyM = Number(cityGeo?.accuracyM);
  if (Number.isFinite(accuracyM) && accuracyM > 0) {
    return Math.round(clamp(accuracyM * 3, MIN_DISCOVERY_RADIUS_M, MAX_DISCOVERY_RADIUS_M));
  }
  return DEFAULT_DISCOVERY_RADIUS_M;
}

function itemCenter(item) {
  const lat = Number(item?.lat ?? item?.center?.lat);
  const lng = Number(item?.lon ?? item?.center?.lon);
  return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
}

function relationNames(item) {
  const tags = item?.tags || {};
  return [
    tags.name,
    tags['name:en'],
    tags['name:uk'],
    tags['name:ru'],
    tags['name:ky'],
    tags['name:uz'],
    tags['name:kk'],
    tags.official_name,
    tags.short_name,
    tags.alt_name,
  ].filter(Boolean);
}

function placeScore(place) {
  if (place === 'city') return 1;
  if (place === 'town') return 0.98;
  if (place === 'municipality') return 0.45;
  if (place === 'borough') return 0.42;
  if (place === 'village') return 0.30;
  if (place === 'district') return 0.22;
  return 0.12;
}

function adminLevelScore(value) {
  const level = Number(value);
  if (!Number.isFinite(level)) return 0.25;
  if (level >= 9) return 1;
  if (level === 8) return 0.9;
  if (level === 7) return 0.5;
  if (level === 6) return 0.25;
  return 0.08;
}

export function selectCityBoundary(city, center, elements = []) {
  const ranked = [];
  for (const item of elements) {
    if (item?.type !== 'relation' || item.tags?.boundary !== 'administrative') continue;
    const point = itemCenter(item);
    const distanceM = point ? haversineM(center, point) : Infinity;
    const names = relationNames(item);
    const bestNameScore = names.reduce((best, value) => Math.max(best, nameScore(city, value)), 0);
    const place = String(item.tags?.place || '').toLowerCase();
    const locality = placeScore(place);
    const admin = adminLevelScore(item.tags?.admin_level);
    const proximity = Number.isFinite(distanceM) ? Math.max(0, 1 - distanceM / 30_000) : 0;
    const score = bestNameScore * 0.38 + locality * 0.34 + admin * 0.16 + proximity * 0.12;
    ranked.push({ item, score, distanceM, bestNameScore, locality, admin });
  }
  ranked.sort((a, b) => b.score - a.score || a.distanceM - b.distanceM);
  const best = ranked[0] || null;
  if (!best) return null;
  if (best.bestNameScore < 0.55 && best.locality < 0.9) return null;
  if (best.distanceM > 35_000 && best.bestNameScore < 0.9) return null;
  return best.item;
}

function scopeSelector(scope) {
  if (scope.mode === 'area') return '(area.cityArea)';
  if (scope.mode === 'bbox') {
    const { south, west, north, east } = scope.bbox;
    return `(${south},${west},${north},${east})`;
  }
  return `(around:${scope.radiusM},${scope.center.lat},${scope.center.lng})`;
}

export function buildDiscoveryQuery(scope) {
  const selector = scopeSelector(scope);
  const prefix = scope.mode === 'area'
    ? `rel(${scope.relationId})->.city;map_to_area.city->.cityArea;`
    : '';
  const adminClause = scope.mode === 'radius'
    ? ''
    : `rel${selector}["boundary"="administrative"]["name"];`;
  return `[out:json][timeout:70];${prefix}(`
    + `nwr${selector}["place"~"^(neighbourhood|suburb|quarter|village|hamlet|town)$"]["name"];`
    + `nwr${selector}["landuse"="residential"]["name"];`
    + `way${selector}["highway"~"${STREET_HIGHWAY_RE}"]["name"];`
    + adminClause
    + ');out center tags;';
}

export function classifyDiscovery(item, scope = null) {
  if (!item?.tags?.name) return null;
  if (scope?.relationId && item.type === 'relation' && item.id === scope.relationId) return null;
  const place = String(item.tags.place || '').toLowerCase();
  if (item.tags.highway) return 'street';
  if (place === 'suburb') return 'suburb';
  if (['village', 'hamlet', 'town'].includes(place)) return 'settlement';
  if (place === 'neighbourhood' || place === 'quarter') return 'local_area';
  if (item.tags.boundary === 'administrative') return 'district';
  if (item.tags.landuse === 'residential' && RESIDENTIAL_COMPLEX_RE.test(` ${item.tags.name} `)) return 'residential_complex';
  if (item.tags.landuse === 'residential') return 'local_area';
  return null;
}

async function overpassPayload(request, endpoint, query) {
  const raw = await request('overpass', endpoint, {
    cache: true,
    minDelayMs: 350,
    serialize: true,
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'user-agent': '@whiteslove/geo-catalog geo-enrichment discovery',
    },
    body: new URLSearchParams({ data: query }).toString(),
    timeoutMs: 75_000,
  });
  return JSON.parse(raw);
}

async function resolveScope({ city, cityGeo, center, request, endpoint }) {
  if (cityGeo?.osm?.type === 'relation' && Number.isInteger(cityGeo.osm.id)) {
    return { mode: 'area', relationId: cityGeo.osm.id, source: 'catalog-osm' };
  }

  const lookup = `[out:json][timeout:35];is_in(${center.lat},${center.lng})->.cityAreas;rel(pivot.cityAreas)["boundary"="administrative"]["name"];out center tags;`;
  try {
    const payload = await overpassPayload(request, endpoint, lookup);
    const relation = selectCityBoundary(city, center, payload.elements || []);
    if (relation) {
      return {
        mode: 'area',
        relationId: relation.id,
        source: 'overpass-is-in',
        adminLevel: relation.tags?.admin_level || null,
        relationName: relation.tags?.name || null,
      };
    }
  } catch (error) {
    console.warn(`[discovery/${city}] city boundary lookup failed: ${error?.message || error}`);
  }

  if (cityGeo?.bbox) return { mode: 'bbox', bbox: cityGeo.bbox, source: 'catalog-bbox' };
  return { mode: 'radius', center, radiusM: discoveryRadiusM(cityGeo), source: 'catalog-center' };
}

export async function discoverOverpassScoped({ country, city, cityGeo, center = cityGeo?.center, request }) {
  if (!center || typeof request !== 'function') return [];
  const endpoint = process.env.OVERPASS_URL || 'https://overpass-api.de/api/interpreter';
  const scope = await resolveScope({ city, cityGeo, center, request, endpoint });
  console.log(`[${country}/${city}] overpass discovery scope: ${scope.mode}${scope.relationId ? ` relation:${scope.relationId}` : scope.radiusM ? ` radius:${scope.radiusM}m` : ''}`);
  const payload = await overpassPayload(request, endpoint, buildDiscoveryQuery(scope));
  const rows = [];
  for (const item of payload.elements || []) {
    const point = itemCenter(item);
    const typeHint = classifyDiscovery(item, scope);
    if (!point || !typeHint) continue;
    rows.push({
      provider: 'overpass',
      country,
      city,
      canonical: item.tags.name,
      typeHint,
      lat: point.lat,
      lng: point.lng,
      source: 'osm',
      osm: { type: item.type, id: item.id },
      scope: {
        mode: scope.mode,
        relationId: scope.relationId || null,
        source: scope.source,
      },
      tags: {
        place: item.tags.place || null,
        landuse: item.tags.landuse || null,
        highway: item.tags.highway || null,
        boundary: item.tags.boundary || null,
        adminLevel: item.tags.admin_level || null,
      },
    });
  }
  return rows;
}
