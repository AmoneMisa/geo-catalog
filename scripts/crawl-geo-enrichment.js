import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { LOCATION_DICTIONARIES } from '@whiteslove/parsing-lexicon/locations';
import { resolveLexiconGeoEntityExact } from '../src/lexicon-bridge.js';

const TYPE_BY_KEY = Object.freeze({
  districts: 'district',
  microdistricts: 'microdistrict',
  mahallas: 'mahalla',
  localAreas: 'local_area',
  suburbs: 'suburb',
  settlements: 'settlement',
  developmentAreas: 'development_area',
  metro: 'metro',
  residentialComplexes: 'residential_complex',
  streets: 'street',
  landmarks: 'poi',
  pois: 'poi',
});

const COUNTRY_NAME = Object.freeze({
  UZ: 'Uzbekistan',
  UA: 'Ukraine',
  KZ: 'Kazakhstan',
  RO: 'Romania',
  KG: 'Kyrgyzstan',
});

const EASYWAY_PUBLIC_HOST = Object.freeze({
  UZ: 'https://uz.easyway.info',
  KZ: 'https://kz.easyway.info',
});

// Zero-key path. Paid/API-key providers are opt-in via --providers.
const DEFAULT_PROVIDERS = Object.freeze(['nominatim', 'easyway']);
const DEFAULT_OUTPUT_ROOT = '.cache/geo-enrichment';
const DEFAULT_TIMEOUT_MS = 12_000;
const DISCOVERY_RADIUS_M = 24_000;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function parseArgs(argv) {
  const out = {
    country: null,
    city: null,
    providers: [...DEFAULT_PROVIDERS],
    discover: false,
    refresh: false,
    periodic: false,
    minScore: 0.84,
    maxAliases: 2,
    output: null,
  };

  for (const arg of argv) {
    if (arg === '--discover') out.discover = true;
    else if (arg === '--refresh') out.refresh = true;
    else if (arg === '--periodic') out.periodic = true;
    else if (arg.startsWith('--country=')) out.country = arg.slice('--country='.length).trim().toUpperCase();
    else if (arg.startsWith('--city=')) out.city = arg.slice('--city='.length).trim();
    else if (arg.startsWith('--providers=')) out.providers = arg.slice('--providers='.length).split(',').map((v) => v.trim().toLowerCase()).filter(Boolean);
    else if (arg.startsWith('--min-score=')) out.minScore = Number(arg.slice('--min-score='.length));
    else if (arg.startsWith('--max-aliases=')) out.maxAliases = Number.parseInt(arg.slice('--max-aliases='.length), 10);
    else if (arg.startsWith('--output=')) out.output = arg.slice('--output='.length).trim();
    else throw new Error(`Unknown argument: ${arg}`);
  }

  if (!out.country || !out.city) {
    throw new Error('Usage: npm run crawl:geo -- --country=UZ --city=Tashkent [--discover] [--providers=nominatim,easyway,2gis,yandex,google]');
  }
  if (!Number.isFinite(out.minScore) || out.minScore < 0 || out.minScore > 1) throw new Error('--min-score must be between 0 and 1');
  if (!Number.isInteger(out.maxAliases) || out.maxAliases < 0 || out.maxAliases > 10) throw new Error('--max-aliases must be 0..10');
  return out;
}

function normalize(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[’ʻʼ‘`´]/g, "'")
    .replace(/\b(?:mahalla(?:si)?|mfy|mavze(?:si)?|massiv|massivi|daha(?:si)?|mikrorayon|microdistrict|district|rayon|район|махалла|массив|квартал|street|ko'chasi|ko‘chasi|улица|ул)\b/giu, ' ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function slug(value) {
  return normalize(value).replace(/\s+/g, '-');
}

function tokenDice(a, b) {
  const left = new Set(normalize(a).split(' ').filter(Boolean));
  const right = new Set(normalize(b).split(' ').filter(Boolean));
  if (!left.size || !right.size) return 0;
  let common = 0;
  for (const token of left) if (right.has(token)) common += 1;
  return (2 * common) / (left.size + right.size);
}

function nameScore(query, label) {
  const a = normalize(query);
  const b = normalize(label);
  if (!a || !b) return 0;
  if (a === b) return 1;
  if (b.startsWith(`${a} `) || b.endsWith(` ${a}`)) return 0.95;
  if (b.includes(a) || a.includes(b)) return 0.9;
  return tokenDice(a, b);
}

function haversineM(a, b) {
  const rad = (deg) => deg * Math.PI / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const lat1 = rad(a.lat);
  const lat2 = rad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function lexicalRows(country, city) {
  const cityData = LOCATION_DICTIONARIES[country]?.[city];
  if (!cityData) throw new Error(`No LOCATION_DICTIONARIES entry for ${country}/${city}`);

  const rows = [];
  const seen = new Set();
  for (const [key, type] of Object.entries(TYPE_BY_KEY)) {
    for (const item of cityData[key] || []) {
      const canonical = item.canonical || item.name;
      if (!canonical) continue;
      const id = `${type}|${canonical}|${item.parent || ''}`;
      if (seen.has(id)) continue;
      seen.add(id);
      rows.push({
        country,
        city,
        type,
        canonical,
        parent: item.parent || null,
        aliases: [...new Set((item.aliases || []).filter(Boolean))],
      });
    }
  }
  return rows;
}

function cityEntity(country, city) {
  return resolveLexiconGeoEntityExact({ country, type: 'city', canonical: city });
}

function queryVariants(row, maxAliases) {
  const variants = [row.canonical];
  for (const alias of row.aliases) {
    if (variants.length > maxAliases) break;
    if (normalize(alias) !== normalize(row.canonical)) variants.push(alias);
  }
  return [...new Set(variants)];
}

function hash(value) {
  return createHash('sha256').update(value).digest('hex').slice(0, 24);
}

async function readIfExists(file) {
  try {
    return await readFile(file, 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
}

async function readJsonIfExists(file) {
  const raw = await readIfExists(file);
  return raw == null ? null : JSON.parse(raw);
}

const lastRequestAt = new Map();
async function throttle(provider, minDelayMs) {
  if (!minDelayMs) return;
  const elapsed = Date.now() - (lastRequestAt.get(provider) || 0);
  if (elapsed < minDelayMs) await sleep(minDelayMs - elapsed);
  lastRequestAt.set(provider, Date.now());
}

async function request(provider, url, options = {}) {
  const {
    cache = false,
    cacheExt = 'json',
    minDelayMs = 0,
    headers = {},
    method = 'GET',
    body,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = options;
  const cachePath = path.join(DEFAULT_OUTPUT_ROOT, 'http', provider, `${hash(`${method}:${url}:${body || ''}`)}.${cacheExt}`);
  if (cache) {
    const cached = await readIfExists(cachePath);
    if (cached != null) return cached;
  }

  await throttle(provider, minDelayMs);
  const response = await fetch(url, {
    method,
    headers,
    body,
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) {
    const responseBody = (await response.text()).replace(/\s+/g, ' ').slice(0, 300);
    throw new Error(`${provider}: HTTP ${response.status}: ${responseBody}`);
  }
  const raw = await response.text();
  if (cache) {
    await mkdir(path.dirname(cachePath), { recursive: true });
    await writeFile(cachePath, raw, 'utf8');
  }
  return raw;
}

async function cachedJson(provider, url, options = {}) {
  const raw = await request(provider, url, { ...options, cacheExt: 'json' });
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(`${provider}: response is not valid JSON`);
  }
}

async function cachedText(provider, url, options = {}) {
  return request(provider, url, { ...options, cacheExt: 'txt' });
}

function candidateBase(provider, row, query, label, lat, lng, extra = {}) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return {
    provider,
    query,
    label: label || query,
    lat,
    lng,
    city: extra.city || null,
    rawType: extra.rawType || null,
    persistable: Boolean(extra.persistable),
    source: extra.source || provider,
    osm: extra.osm || null,
    providerId: extra.providerId || null,
    meta: extra.meta || null,
    row,
  };
}

function providerTypeScore(row, candidate) {
  const type = `${candidate.rawType || ''} ${candidate.meta?.category || ''}`.toLowerCase();
  if (row.type === 'street') return /road|street|highway/.test(type) ? 1 : 0.45;
  if (row.type === 'metro') return /station|subway|railway|public_transport|stop/.test(type) ? 1 : 0.45;
  if (row.type === 'poi') return /amenity|tourism|shop|leisure|building|historic|office|place|stop/.test(type) ? 0.9 : 0.55;
  if (['district', 'microdistrict', 'mahalla', 'local_area', 'suburb', 'settlement', 'development_area'].includes(row.type)) {
    return /administrative|neighbou?rhood|suburb|quarter|residential|place|district|locality|stop/.test(type) ? 1 : 0.55;
  }
  return 0.65;
}

function candidateScore(row, candidate) {
  const n = nameScore(candidate.query, candidate.label);
  const cityText = normalize(`${candidate.city || ''} ${candidate.label || ''}`);
  const city = cityText.includes(normalize(row.city)) ? 1 : 0.45;
  const parent = row.parent
    ? (normalize(candidate.label).includes(normalize(row.parent)) ? 1 : 0.55)
    : 0.75;
  const type = providerTypeScore(row, candidate);
  return Math.min(1, n * 0.68 + city * 0.17 + type * 0.10 + parent * 0.05);
}

async function nominatimCandidates(row, queries, args) {
  const rows = [];
  const minDelayMs = args.periodic ? 15_000 : 1_100;
  for (const query of queries) {
    const url = new URL(process.env.NOMINATIM_URL || 'https://nominatim.openstreetmap.org/search');
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('q', `${query}, ${row.city}, ${COUNTRY_NAME[row.country] || row.country}`);
    url.searchParams.set('addressdetails', '1');
    url.searchParams.set('limit', '5');
    url.searchParams.set('countrycodes', row.country.toLowerCase());
    const payload = await cachedJson('nominatim', url.toString(), {
      cache: true,
      minDelayMs,
      headers: {
        'user-agent': process.env.NOMINATIM_USER_AGENT || '@whiteslove/geo-catalog geo-enrichment (+https://github.com/AmoneMisa/geo-catalog)',
      },
    });
    for (const item of payload || []) {
      const candidate = candidateBase('nominatim', row, query, item.display_name, Number(item.lat), Number(item.lon), {
        city: item.address?.city || item.address?.town || item.address?.municipality || null,
        rawType: item.type,
        persistable: true,
        source: 'osm',
        osm: item.osm_type && item.osm_id ? { type: item.osm_type, id: Number(item.osm_id) } : null,
        providerId: item.place_id ? String(item.place_id) : null,
        meta: { category: item.category || item.class || null, importance: item.importance ?? null },
      });
      if (candidate) rows.push(candidate);
    }
    if (rows.some((candidate) => nameScore(query, candidate.label) >= 0.95)) break;
  }
  return rows;
}

function collectLatLngObjects(value, output = [], context = {}) {
  if (!value || typeof value !== 'object') return output;
  if (!Array.isArray(value)) {
    const lat = Number(value.lat ?? value.latitude);
    const lng = Number(value.lng ?? value.lon ?? value.longitude);
    const label = value.title ?? value.name ?? value.address ?? value.stopName ?? value.stop_name;
    if (Number.isFinite(lat) && Number.isFinite(lng) && label) {
      output.push({ value, lat, lng, label: String(label), ...context });
    }
  }
  for (const child of Array.isArray(value) ? value : Object.values(value)) collectLatLngObjects(child, output, context);
  return output;
}

function easyWayPublicBase(country) {
  return process.env.EASYWAY_PUBLIC_BASE_URL || EASYWAY_PUBLIC_HOST[country] || null;
}

function easyWayCitySlug(city) {
  if (process.env.EASYWAY_CITY_SLUG) return process.env.EASYWAY_CITY_SLUG;
  if (process.env.EASYWAY_CITY_SLUGS) {
    try {
      const mapped = JSON.parse(process.env.EASYWAY_CITY_SLUGS)?.[city];
      if (mapped) return String(mapped);
    } catch {
      throw new Error('EASYWAY_CITY_SLUGS must be valid JSON, e.g. {"Tashkent":"tashkent"}');
    }
  }
  return slug(city);
}

function extractEasyWayRouteIds(html) {
  const ids = new Set();
  for (const match of html.matchAll(/data-route-id\s*=\s*["']?(\d+)["']?/giu)) ids.add(match[1]);
  return [...ids].sort((a, b) => Number(a) - Number(b));
}

const easyWaySnapshots = new Map();
async function loadEasyWayPublicSnapshot(country, city) {
  const cacheKey = `${country}|${city}`;
  if (easyWaySnapshots.has(cacheKey)) return easyWaySnapshots.get(cacheKey);

  const promise = (async () => {
    const base = easyWayPublicBase(country);
    if (!base) return [];
    const citySlug = easyWayCitySlug(city);
    const lang = process.env.EASYWAY_PUBLIC_LANG || 'en';
    const routesUrl = new URL(`/${lang}/cities/${citySlug}/routes`, base).toString();
    const headers = {
      accept: 'text/html,application/xhtml+xml',
      'user-agent': process.env.EASYWAY_USER_AGENT || '@whiteslove/geo-catalog geo-enrichment (+https://github.com/AmoneMisa/geo-catalog)',
    };
    const html = await cachedText('easyway-public-routes', routesUrl, {
      cache: true,
      minDelayMs: 250,
      headers,
    });
    const routeIds = extractEasyWayRouteIds(html);
    if (!routeIds.length) {
      console.warn(`  easyway: no data-route-id values found at ${routesUrl}`);
      return [];
    }

    const maxRoutes = Number.parseInt(process.env.EASYWAY_MAX_ROUTES || '500', 10);
    const selectedIds = routeIds.slice(0, Number.isFinite(maxRoutes) ? maxRoutes : 500);
    const points = [];
    for (let index = 0; index < selectedIds.length; index += 1) {
      const routeId = selectedIds[index];
      const schemeUrl = new URL(`/ajax/${citySlug}/routeScheme/${routeId}`, base).toString();
      try {
        const payload = await cachedJson('easyway-public-scheme', schemeUrl, {
          cache: true,
          minDelayMs: 120,
          headers: {
            accept: 'application/json, text/javascript, */*; q=0.01',
            'x-requested-with': 'XMLHttpRequest',
            referer: routesUrl,
            'user-agent': headers['user-agent'],
          },
        });
        collectLatLngObjects(payload, points, { routeId });
      } catch (error) {
        console.warn(`  easyway route ${routeId}: ${error?.message || error}`);
      }
    }

    const dedupe = new Map();
    for (const point of points) {
      const key = `${normalize(point.label)}|${point.lat.toFixed(6)}|${point.lng.toFixed(6)}`;
      if (!dedupe.has(key)) dedupe.set(key, point);
    }
    console.log(`  easyway: indexed ${dedupe.size} named route/stop points from ${selectedIds.length} public route schemes`);
    return [...dedupe.values()];
  })();

  easyWaySnapshots.set(cacheKey, promise);
  return promise;
}

async function easyWayCandidates(row, queries) {
  const snapshot = await loadEasyWayPublicSnapshot(row.country, row.city);
  if (!snapshot.length) return [];

  const ranked = [];
  for (const point of snapshot) {
    let bestQuery = null;
    let bestNameScore = 0;
    for (const query of queries) {
      const score = nameScore(query, point.label);
      if (score > bestNameScore) {
        bestNameScore = score;
        bestQuery = query;
      }
    }
    if (bestNameScore < 0.55 || !bestQuery) continue;
    const candidate = candidateBase('easyway', row, bestQuery, point.label, point.lat, point.lng, {
      city: row.city,
      rawType: 'public_transport_stop_or_route_point',
      // Public web/AJAX data is used as a verification signal. Persisted coordinates still come from storage-safe sources such as OSM.
      persistable: false,
      source: 'easyway-public',
      providerId: point.value?.id ? String(point.value.id) : `route:${point.routeId}`,
    });
    if (candidate) ranked.push({ candidate, bestNameScore });
  }

  ranked.sort((a, b) => b.bestNameScore - a.bestNameScore);
  return ranked.slice(0, 8).map((item) => item.candidate);
}

async function googleCandidates(row, queries) {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return [];
  const rows = [];
  for (const query of queries) {
    const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
    url.searchParams.set('address', `${query}, ${row.city}, ${COUNTRY_NAME[row.country] || row.country}`);
    url.searchParams.set('key', key);
    url.searchParams.set('region', row.country.toLowerCase());
    const payload = await cachedJson('google', url.toString(), { cache: false, minDelayMs: 50 });
    for (const item of payload.results || []) {
      const point = item.geometry?.location;
      const locality = (item.address_components || []).find((part) => part.types?.some((t) => ['locality', 'administrative_area_level_2'].includes(t)));
      const candidate = candidateBase('google', row, query, item.formatted_address, Number(point?.lat), Number(point?.lng), {
        city: locality?.long_name || null,
        rawType: (item.types || []).join(','),
        persistable: false,
        source: 'google',
        providerId: item.place_id || null,
      });
      if (candidate) rows.push(candidate);
    }
    if (rows.some((candidate) => nameScore(query, candidate.label) >= 0.95)) break;
  }
  return rows;
}

async function yandexCandidates(row, queries) {
  const key = process.env.YANDEX_GEOCODER_API_KEY;
  if (!key) return [];
  const allowStorage = process.env.YANDEX_ALLOW_STORAGE === '1';
  const rows = [];
  for (const query of queries) {
    const url = new URL('https://geocode-maps.yandex.ru/v1/');
    url.searchParams.set('apikey', key);
    url.searchParams.set('geocode', `${query}, ${row.city}, ${COUNTRY_NAME[row.country] || row.country}`);
    url.searchParams.set('lang', process.env.YANDEX_LANG || 'en_US');
    url.searchParams.set('format', 'json');
    url.searchParams.set('results', '5');
    const payload = await cachedJson('yandex', url.toString(), { cache: allowStorage, minDelayMs: 100 });
    const members = payload.response?.GeoObjectCollection?.featureMember || [];
    for (const member of members) {
      const object = member.GeoObject || {};
      const meta = object.metaDataProperty?.GeocoderMetaData || {};
      const [lng, lat] = String(object.Point?.pos || '').split(/\s+/).map(Number);
      const candidate = candidateBase('yandex', row, query, meta.text || object.name, lat, lng, {
        rawType: meta.kind || null,
        persistable: allowStorage,
        source: 'yandex',
        providerId: object.uri || null,
        meta: allowStorage ? { precision: meta.precision || null } : null,
      });
      if (candidate) rows.push(candidate);
    }
    if (rows.some((candidate) => nameScore(query, candidate.label) >= 0.95)) break;
  }
  return rows;
}

async function twoGisCandidates(row, queries) {
  const key = process.env.DGIS_API_KEY;
  if (!key) return [];
  const allowStorage = process.env.DGIS_ALLOW_STORAGE === '1';
  const rows = [];
  for (const query of queries) {
    const url = new URL('https://catalog.api.2gis.com/3.0/items/geocode');
    url.searchParams.set('q', `${query}, ${row.city}`);
    url.searchParams.set('fields', 'items.point,items.adm_div,items.geometry.centroid');
    url.searchParams.set('page_size', '5');
    url.searchParams.set('key', key);
    const payload = await cachedJson('2gis', url.toString(), { cache: allowStorage, minDelayMs: 100 });
    for (const item of payload.result?.items || []) {
      const point = item.point || item.geometry?.centroid;
      const city = (item.adm_div || []).find((part) => /city|locality/i.test(part.type || ''))?.name || null;
      const candidate = candidateBase('2gis', row, query, item.full_name || item.name || item.address_name, Number(point?.lat), Number(point?.lon), {
        city,
        rawType: item.type || null,
        persistable: allowStorage,
        source: '2gis',
        providerId: item.id || null,
      });
      if (candidate) rows.push(candidate);
    }
    if (rows.some((candidate) => nameScore(query, candidate.label) >= 0.95)) break;
  }
  return rows;
}

const PROVIDER_LOADERS = Object.freeze({
  nominatim: nominatimCandidates,
  easyway: easyWayCandidates,
  google: googleCandidates,
  yandex: yandexCandidates,
  '2gis': twoGisCandidates,
});

function consensusBoost(candidate, candidates, row) {
  const radius = ['poi', 'metro', 'street'].includes(row.type) ? 350 : 1400;
  const supporting = new Set();
  for (const other of candidates) {
    if (other.provider === candidate.provider) continue;
    if (haversineM(candidate, other) <= radius) supporting.add(other.provider);
  }
  return { boost: Math.min(0.08, supporting.size * 0.025), supporting: [...supporting].sort() };
}

function chooseCandidate(row, candidates, minScore) {
  const ranked = candidates
    .map((candidate) => {
      const baseScore = candidateScore(row, candidate);
      const consensus = consensusBoost(candidate, candidates, row);
      return { ...candidate, score: Math.min(1, baseScore + consensus.boost), supporting: consensus.supporting };
    })
    .sort((a, b) => b.score - a.score);

  const persistable = ranked.filter((candidate) => candidate.persistable);
  const best = persistable[0] || null;
  if (!best || best.score < minScore) return { accepted: null, ranked };

  const second = persistable[1];
  if (second && Math.abs(best.score - second.score) < 0.03 && haversineM(best, second) > 1800) {
    return { accepted: null, ranked, ambiguous: true };
  }
  return { accepted: best, ranked, ambiguous: false };
}

function sanitizeCandidate(candidate) {
  if (!candidate) return null;
  if (!candidate.persistable) {
    return {
      provider: candidate.provider,
      persistable: false,
      verificationOnly: true,
      ...(candidate.provider === 'google' && candidate.providerId ? { placeId: candidate.providerId } : {}),
    };
  }
  return {
    provider: candidate.provider,
    label: candidate.label,
    lat: candidate.lat,
    lng: candidate.lng,
    rawType: candidate.rawType,
    source: candidate.source,
    osm: candidate.osm,
    providerId: candidate.providerId,
    score: candidate.score,
    supporting: candidate.supporting || [],
  };
}

async function discoverOverpass(country, city, center) {
  if (!center) return [];
  const endpoint = process.env.OVERPASS_URL || 'https://overpass-api.de/api/interpreter';
  const query = `[out:json][timeout:70];(nwr(around:${DISCOVERY_RADIUS_M},${center.lat},${center.lng})["place"~"^(neighbourhood|suburb|quarter)$"]["name"];nwr(around:${DISCOVERY_RADIUS_M},${center.lat},${center.lng})["landuse"="residential"]["name"];nwr(around:${DISCOVERY_RADIUS_M},${center.lat},${center.lng})["boundary"="administrative"]["name"];);out center tags;`;
  const raw = await request('overpass', endpoint, {
    cache: true,
    minDelayMs: 350,
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'user-agent': '@whiteslove/geo-catalog geo-enrichment discovery',
    },
    body: new URLSearchParams({ data: query }).toString(),
    timeoutMs: 75_000,
  });
  const payload = JSON.parse(raw);
  const rows = [];
  for (const item of payload.elements || []) {
    const lat = Number(item.lat ?? item.center?.lat);
    const lng = Number(item.lon ?? item.center?.lon);
    const name = item.tags?.name;
    if (!name || !Number.isFinite(lat) || !Number.isFinite(lng)) continue;
    const place = item.tags?.place;
    const typeHint = item.tags?.boundary === 'administrative'
      ? 'district'
      : place === 'neighbourhood' || place === 'quarter'
        ? 'local_area'
        : place === 'suburb'
          ? 'suburb'
          : 'local_area';
    rows.push({
      provider: 'overpass',
      country,
      city,
      canonical: name,
      typeHint,
      lat,
      lng,
      source: 'osm',
      osm: { type: item.type, id: item.id },
      tags: {
        place: place || null,
        landuse: item.tags?.landuse || null,
        boundary: item.tags?.boundary || null,
        adminLevel: item.tags?.admin_level || null,
      },
    });
  }
  return rows;
}

function filterNewDiscoveries(discoveries, lexicon) {
  const known = new Set();
  for (const row of lexicon) {
    known.add(normalize(row.canonical));
    for (const alias of row.aliases) known.add(normalize(alias));
  }
  const dedupe = new Map();
  for (const item of discoveries) {
    const key = `${item.typeHint}|${normalize(item.canonical)}`;
    if (!normalize(item.canonical) || known.has(normalize(item.canonical))) continue;
    const existing = dedupe.get(key);
    if (!existing || (item.provider === 'overpass' && existing.provider !== 'overpass')) dedupe.set(key, item);
  }
  return [...dedupe.values()].sort((a, b) => a.canonical.localeCompare(b.canonical, 'en', { numeric: true }));
}

function providerNotes(providers) {
  const notes = [];
  if (providers.includes('nominatim')) notes.push('Nominatim is keyless. One-time crawler uses one thread, >=1.1s between requests and caches responses; --periodic slows this to >=15s/request.');
  if (providers.includes('easyway')) notes.push('EasyWay default path is keyless public HTTP: the city routes page provides data-route-id values and /ajax/<city>/routeScheme/<id> provides route/stop coordinates. It is verification-only in reports.');
  if (providers.includes('google')) notes.push(process.env.GOOGLE_MAPS_API_KEY ? 'Google Geocoding is enabled as verification-only; coordinate/address content is not persisted.' : 'Google requested but GOOGLE_MAPS_API_KEY is unset; provider will be skipped.');
  if (providers.includes('yandex')) notes.push(process.env.YANDEX_GEOCODER_API_KEY ? 'Yandex API is enabled; storage remains disabled unless YANDEX_ALLOW_STORAGE=1.' : 'Yandex requested but YANDEX_GEOCODER_API_KEY is unset; provider will be skipped.');
  if (providers.includes('2gis')) notes.push(process.env.DGIS_API_KEY ? '2GIS API is enabled; storage remains disabled unless DGIS_ALLOW_STORAGE=1.' : '2GIS requested but DGIS_API_KEY is unset; provider will be skipped.');
  return notes;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const lexicon = lexicalRows(args.country, args.city);
  const unresolved = args.refresh
    ? lexicon
    : lexicon.filter((row) => !resolveLexiconGeoEntityExact({ country: row.country, city: row.city, type: row.type, canonical: row.canonical }));

  const providers = args.providers.filter((provider) => PROVIDER_LOADERS[provider]);
  if (!providers.length) throw new Error(`No supported providers selected. Supported: ${Object.keys(PROVIDER_LOADERS).join(', ')}`);

  console.log(`Geo enrichment: ${args.country}/${args.city}; ${unresolved.length}/${lexicon.length} lexical entities to inspect.`);
  console.log(`Providers: ${providers.join(', ')}${providers.every((provider) => DEFAULT_PROVIDERS.includes(provider)) ? ' (zero-key default)' : ''}`);
  for (const note of providerNotes(providers)) console.log(`  policy: ${note}`);

  const results = [];
  for (let index = 0; index < unresolved.length; index += 1) {
    const row = unresolved[index];
    const queries = queryVariants(row, args.maxAliases);
    const candidates = [];
    console.log(`[${index + 1}/${unresolved.length}] ${row.type} ${row.canonical}`);

    for (const provider of providers) {
      try {
        const providerRows = await PROVIDER_LOADERS[provider](row, queries, args);
        candidates.push(...providerRows);
        if (providerRows.length) console.log(`  ${provider}: ${providerRows.length} candidates`);
      } catch (error) {
        console.warn(`  ${provider}: ${error?.message || error}`);
      }
    }

    const choice = chooseCandidate(row, candidates, args.minScore);
    const accepted = sanitizeCandidate(choice.accepted);
    const ranked = choice.ranked.slice(0, 8).map(sanitizeCandidate);
    results.push({
      entity: row,
      status: accepted ? 'accepted' : choice.ambiguous ? 'ambiguous' : candidates.length ? 'review' : 'not_found',
      accepted,
      candidates: ranked,
    });
    if (accepted) console.log(`  accepted: ${accepted.provider} ${accepted.lat},${accepted.lng} score=${accepted.score.toFixed(3)}`);
  }

  let discoveries = [];
  if (args.discover) {
    const center = cityEntity(args.country, args.city)?.center || null;
    try {
      discoveries.push(...await discoverOverpass(args.country, args.city, center));
    } catch (error) {
      console.warn(`overpass discovery: ${error?.message || error}`);
    }
    discoveries = filterNewDiscoveries(discoveries, lexicon);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    country: args.country,
    city: args.city,
    providers,
    zeroKeyDefault: providers.every((provider) => DEFAULT_PROVIDERS.includes(provider)),
    policyNotes: providerNotes(providers),
    counts: {
      lexicon: lexicon.length,
      inspected: unresolved.length,
      accepted: results.filter((row) => row.status === 'accepted').length,
      review: results.filter((row) => row.status === 'review').length,
      ambiguous: results.filter((row) => row.status === 'ambiguous').length,
      notFound: results.filter((row) => row.status === 'not_found').length,
      discoveries: discoveries.length,
    },
    results,
    discoveries,
  };

  const output = args.output || path.join(DEFAULT_OUTPUT_ROOT, `${args.country.toLowerCase()}-${slug(args.city)}.json`);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(`Report: ${output}`);
  console.log(`Accepted ${report.counts.accepted}; review ${report.counts.review}; ambiguous ${report.counts.ambiguous}; not found ${report.counts.notFound}; new discoveries ${report.counts.discoveries}.`);
}

await main();
