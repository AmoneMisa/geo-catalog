import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { LOCATION_DICTIONARIES } from '@whiteslove/parsing-lexicon/locations';
import { GEO_ENTITIES } from '../src/catalog.js';
import { resolveLexiconGeoEntityExact } from '../src/lexicon-bridge.js';
import { discoverOverpassScoped } from './geo-enrichment-discovery.js';
import { isAutoAcceptEligible } from './geo-enrichment-match.js';

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

// All supported providers are part of the same crawler. Providers that require
// credentials simply skip themselves when the corresponding key is absent.
const DEFAULT_PROVIDERS = Object.freeze([
  'nominatim',
  'easyway',
  'wikiroutes',
  'google',
  'yandex',
  '2gis',
  'maptiler',
  'geoapify',
  'mapbox',
]);
const ZERO_KEY_PROVIDERS = Object.freeze(['nominatim', 'easyway']);
const DEFAULT_OUTPUT_ROOT = '.cache/geo-enrichment';
const DEFAULT_TIMEOUT_MS = 12_000;
const DEFAULT_CITY_CONCURRENCY = 4;
const MAX_CITY_CONCURRENCY = 32;
const DISCOVERY_RADIUS_M = 24_000;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function parseArgs(argv) {
  const out = {
    country: null,
    city: null,
    allCities: false,
    concurrency: DEFAULT_CITY_CONCURRENCY,
    providers: [...DEFAULT_PROVIDERS],
    discover: false,
    refresh: false,
    periodic: false,
    minScore: 0.84,
    maxAliases: 2,
    output: null,
  };

  for (const arg of argv) {
    if (arg === '--all-cities') out.allCities = true;
    else if (arg === '--discover') out.discover = true;
    else if (arg === '--refresh') out.refresh = true;
    else if (arg === '--periodic') out.periodic = true;
    else if (arg.startsWith('--country=')) out.country = arg.slice('--country='.length).trim().toUpperCase();
    else if (arg.startsWith('--city=')) out.city = arg.slice('--city='.length).trim();
    else if (arg.startsWith('--concurrency=')) out.concurrency = Number.parseInt(arg.slice('--concurrency='.length), 10);
    else if (arg.startsWith('--providers=')) out.providers = arg.slice('--providers='.length).split(',').map((v) => v.trim().toLowerCase()).filter(Boolean);
    else if (arg.startsWith('--min-score=')) out.minScore = Number(arg.slice('--min-score='.length));
    else if (arg.startsWith('--max-aliases=')) out.maxAliases = Number.parseInt(arg.slice('--max-aliases='.length), 10);
    else if (arg.startsWith('--output=')) out.output = arg.slice('--output='.length).trim();
    else throw new Error(`Unknown argument: ${arg}`);
  }

  if (!out.country || (!out.city && !out.allCities)) {
    throw new Error(`Usage: npm run crawl:geo -- --country=UZ (--city=Tashkent | --all-cities [--concurrency=${DEFAULT_CITY_CONCURRENCY}]) [--discover] [--providers=${DEFAULT_PROVIDERS.join(',')}]`);
  }
  if (out.city && out.allCities) throw new Error('Use either --city=<name> or --all-cities, not both');
  if (out.allCities && out.output) throw new Error('--output is only supported for a single --city run; --all-cities writes one report per city');
  if (!Number.isInteger(out.concurrency) || out.concurrency < 1 || out.concurrency > MAX_CITY_CONCURRENCY) {
    throw new Error(`--concurrency must be an integer between 1 and ${MAX_CITY_CONCURRENCY}`);
  }
  if (!Number.isFinite(out.minScore) || out.minScore < 0 || out.minScore > 1) throw new Error('--min-score must be between 0 and 1');
  if (!Number.isInteger(out.maxAliases) || out.maxAliases < 0 || out.maxAliases > 10) throw new Error('--max-aliases must be 0..10');
  return out;
}

function normalize(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/\p{M}+/gu, '')
    .replace(/ı/g, 'i')
    .replace(/[’ʻʼ‘`´]/g, "'")
    .replace(/\b(?:mahalla(?:si)?|mfy|mpj|mavze(?:si)?|massiv|massivi|daha(?:si)?|mikrorayon|microdistrict|district|rayon|район|махалла|массив|квартал|street|ko'chasi|ko‘chasi|kóshesi|улица|ул)\b/giu, ' ')
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

function countryCities(country) {
  const cities = GEO_ENTITIES
    .filter((entity) => entity.country === country && entity.type === 'city')
    .map((entity) => entity.canonicalName)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
  if (!cities.length) throw new Error(`No city entities in geo catalog for country ${country}`);
  return cities;
}

function lexicalRows(country, city) {
  const cityData = LOCATION_DICTIONARIES[country]?.[city];
  if (!cityData) return [];

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
  return GEO_ENTITIES.find((entity) => entity.country === country && entity.type === 'city' && entity.canonicalName === city) || null;
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

const lastRequestAt = new Map();
const providerQueues = new Map();

async function throttle(provider, minDelayMs) {
  if (!minDelayMs) return;
  const elapsed = Date.now() - (lastRequestAt.get(provider) || 0);
  if (elapsed < minDelayMs) await sleep(minDelayMs - elapsed);
  lastRequestAt.set(provider, Date.now());
}

function enqueueProvider(provider, operation) {
  const previous = providerQueues.get(provider) || Promise.resolve();
  const current = previous.catch(() => {}).then(operation);
  providerQueues.set(provider, current.catch(() => {}));
  return current;
}

async function request(provider, url, options = {}) {
  const {
    cache = false,
    cacheExt = 'json',
    minDelayMs = 0,
    serialize = false,
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

  const execute = async () => {
    await throttle(provider, minDelayMs);
    const response = await fetch(url, { method, headers, body, signal: AbortSignal.timeout(timeoutMs) });
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
  };

  return serialize ? enqueueProvider(provider, execute) : execute();
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
  if (row.type === 'metro') return /station|subway|railway|public_transport|stop|transit/.test(type) ? 1 : 0.45;
  if (row.type === 'poi') return /amenity|tourism|shop|leisure|building|historic|office|place|stop|poi/.test(type) ? 0.9 : 0.55;
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

function cityBias(row) {
  return cityEntity(row.country, row.city) || null;
}

function applyNominatimCommon(url, row, cityGeo) {
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('namedetails', '1');
  url.searchParams.set('dedupe', '1');
  url.searchParams.set('limit', '8');
  url.searchParams.set('countrycodes', row.country.toLowerCase());
  if (cityGeo?.bbox) {
    url.searchParams.set('viewbox', `${cityGeo.bbox.west},${cityGeo.bbox.north},${cityGeo.bbox.east},${cityGeo.bbox.south}`);
    url.searchParams.set('bounded', '1');
  }
}

function nominatimUrls(row, query) {
  const endpoint = process.env.NOMINATIM_URL || 'https://nominatim.openstreetmap.org/search';
  const country = COUNTRY_NAME[row.country] || row.country;
  const cityGeo = cityBias(row);
  const texts = [
    row.parent ? `${query}, ${row.parent}, ${row.city}, ${country}` : `${query}, ${row.city}, ${country}`,
    `${query}, ${row.city}`,
  ];
  if (row.type === 'metro') texts.push(`${query} station, ${row.city}, ${country}`);
  if (['district', 'microdistrict', 'mahalla', 'local_area', 'suburb'].includes(row.type)) texts.push(`${query} district, ${row.city}, ${country}`);
  if (row.type === 'residential_complex') texts.push(`${query} residential complex, ${row.city}, ${country}`);

  const urls = texts.map((text) => {
    const url = new URL(endpoint);
    applyNominatimCommon(url, row, cityGeo);
    url.searchParams.set('q', text);
    return url;
  });

  if (row.type === 'street') {
    const url = new URL(endpoint);
    applyNominatimCommon(url, row, cityGeo);
    url.searchParams.set('street', query);
    url.searchParams.set('city', row.city);
    url.searchParams.set('country', country);
    urls.unshift(url);
  }
  if (['poi', 'metro', 'residential_complex'].includes(row.type)) {
    const url = new URL(endpoint);
    applyNominatimCommon(url, row, cityGeo);
    url.searchParams.set('amenity', query);
    url.searchParams.set('city', row.city);
    url.searchParams.set('country', country);
    urls.unshift(url);
  }

  return [...new Map(urls.map((url) => [url.toString(), url])).values()];
}

function isStrongCandidate(row, candidate) {
  const cityGeo = cityBias(row);
  return isAutoAcceptEligible(row, candidate, cityGeo) && candidateScore(row, candidate) >= 0.9;
}

async function nominatimCandidates(row, queries, args) {
  const rows = [];
  const minDelayMs = args.periodic ? 15_000 : 1_100;
  for (const query of queries) {
    for (const url of nominatimUrls(row, query)) {
      const payload = await cachedJson('nominatim', url.toString(), {
        cache: true,
        minDelayMs,
        serialize: true,
        headers: {
          'user-agent': process.env.NOMINATIM_USER_AGENT || '@whiteslove/geo-catalog geo-enrichment (+https://github.com/AmoneMisa/geo-catalog)',
        },
      });
      const current = [];
      for (const item of payload || []) {
        const candidate = candidateBase('nominatim', row, query, item.display_name, Number(item.lat), Number(item.lon), {
          city: item.address?.city || item.address?.town || item.address?.municipality || item.address?.village || null,
          rawType: item.type,
          persistable: true,
          source: 'osm',
          osm: item.osm_type && item.osm_id ? { type: item.osm_type, id: Number(item.osm_id) } : null,
          providerId: item.place_id ? String(item.place_id) : null,
          meta: { category: item.category || item.class || null, importance: item.importance ?? null },
        });
        if (candidate) {
          rows.push(candidate);
          current.push(candidate);
        }
      }
      if (current.some((candidate) => isStrongCandidate(row, candidate))) break;
    }
    if (rows.some((candidate) => isStrongCandidate(row, candidate))) break;
  }
  return rows;
}

function collectLatLngObjects(value, output = [], context = {}) {
  if (!value || typeof value !== 'object') return output;
  if (!Array.isArray(value)) {
    const lat = Number(value.lat ?? value.latitude ?? value.stopLat);
    const lng = Number(value.lng ?? value.lon ?? value.longitude ?? value.stopLon);
    const label = value.title ?? value.name ?? value.address ?? value.stopName ?? value.stop_name;
    if (Number.isFinite(lat) && Number.isFinite(lng) && label) output.push({ value, lat, lng, label: String(label), ...context });
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
    const html = await cachedText('easyway-public-routes', routesUrl, { cache: true, minDelayMs: 250, headers });
    const routeIds = extractEasyWayRouteIds(html);
    if (!routeIds.length) {
      console.warn(`  easyway: no data-route-id values found at ${routesUrl}`);
      return [];
    }

    const configuredMax = Number.parseInt(process.env.EASYWAY_MAX_ROUTES || '', 10);
    const selectedIds = Number.isInteger(configuredMax) && configuredMax > 0 ? routeIds.slice(0, configuredMax) : routeIds;
    const points = [];
    for (const routeId of selectedIds) {
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
    console.log(`  easyway: indexed ${dedupe.size} named route/stop points from ${selectedIds.length}/${routeIds.length} public route schemes`);
    return [...dedupe.values()];
  })();

  easyWaySnapshots.set(cacheKey, promise);
  return promise;
}

async function snapshotCandidates(provider, row, queries, snapshot, options = {}) {
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
    if (bestNameScore < (options.minNameScore ?? 0.55) || !bestQuery) continue;
    const candidate = candidateBase(provider, row, bestQuery, point.label, point.lat, point.lng, {
      city: row.city,
      rawType: options.rawType || 'public_transport_stop_or_route_point',
      persistable: Boolean(options.persistable),
      source: options.source || provider,
      providerId: options.providerId?.(point) || point.value?.id || null,
      meta: options.meta?.(point) || null,
    });
    if (candidate) ranked.push({ candidate, bestNameScore });
  }
  ranked.sort((a, b) => b.bestNameScore - a.bestNameScore);
  return ranked.slice(0, 12).map((item) => item.candidate);
}

async function easyWayCandidates(row, queries) {
  const snapshot = await loadEasyWayPublicSnapshot(row.country, row.city);
  return snapshotCandidates('easyway', row, queries, snapshot, {
    source: 'easyway-public',
    providerId: (point) => point.value?.id ? String(point.value.id) : `route:${point.routeId}`,
  });
}

const wikiRoutesSnapshots = new Map();
async function loadWikiRoutesSnapshot(row) {
  const apiKey = process.env.WIKIROUTES_API_KEY || process.env.BUSMAPS_API_KEY;
  if (!apiKey) return [];
  const cityGeo = cityBias(row);
  if (!cityGeo?.center) return [];
  const key = `${row.country}|${row.city}`;
  if (wikiRoutesSnapshots.has(key)) return wikiRoutesSnapshots.get(key);

  const promise = (async () => {
    const url = new URL('https://capi.busmaps.com:8443/v1/stopsInRadius');
    url.searchParams.set('location', `${cityGeo.center.lat},${cityGeo.center.lng}`);
    url.searchParams.set('radius', String(Number.parseInt(process.env.WIKIROUTES_RADIUS_M || '', 10) || DISCOVERY_RADIUS_M));
    url.searchParams.set('limit', String(Number.parseInt(process.env.WIKIROUTES_STOP_LIMIT || '', 10) || 3000));
    url.searchParams.set('lang', process.env.WIKIROUTES_LANG || 'en');
    const payload = await cachedJson('wikiroutes', url.toString(), {
      cache: true,
      minDelayMs: 150,
      headers: {
        'capi-key': `Bearer ${apiKey}`,
        'capi-host': 'wikiroutes.info',
        'user-agent': '@whiteslove/geo-catalog geo-enrichment',
      },
    });
    const points = [];
    collectLatLngObjects(payload?.stops || payload, points);
    const dedupe = new Map();
    for (const point of points) {
      const key = `${normalize(point.label)}|${point.lat.toFixed(6)}|${point.lng.toFixed(6)}`;
      if (!dedupe.has(key)) dedupe.set(key, point);
    }
    console.log(`  wikiroutes: indexed ${dedupe.size} stops around ${row.city}`);
    return [...dedupe.values()];
  })();
  wikiRoutesSnapshots.set(key, promise);
  return promise;
}

async function wikiRoutesCandidates(row, queries) {
  const snapshot = await loadWikiRoutesSnapshot(row);
  return snapshotCandidates('wikiroutes', row, queries, snapshot, {
    source: 'wikiroutes',
    rawType: 'public_transport_stop',
    providerId: (point) => String(point.value?.stopId || point.value?.id || point.value?.stopHash1 || ''),
    meta: (point) => ({ routes: point.value?.routes?.length ?? null }),
  });
}

function providerStorageFlag(name) {
  return process.env[`${name.toUpperCase()}_ALLOW_STORAGE`] === '1';
}

async function googleCandidates(row, queries) {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return [];
  const allowStorage = providerStorageFlag('google');
  const rows = [];
  const cityGeo = cityBias(row);
  for (const query of queries) {
    const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
    url.searchParams.set('address', row.parent ? `${query}, ${row.parent}, ${row.city}` : `${query}, ${row.city}`);
    url.searchParams.set('key', key);
    url.searchParams.set('region', row.country.toLowerCase());
    url.searchParams.set('components', `country:${row.country}`);
    if (cityGeo?.bbox) url.searchParams.set('bounds', `${cityGeo.bbox.south},${cityGeo.bbox.west}|${cityGeo.bbox.north},${cityGeo.bbox.east}`);
    const payload = await cachedJson('google', url.toString(), { cache: false, minDelayMs: 50 });
    for (const item of payload.results || []) {
      const point = item.geometry?.location;
      const locality = (item.address_components || []).find((part) => part.types?.some((t) => ['locality', 'administrative_area_level_2'].includes(t)));
      const candidate = candidateBase('google', row, query, item.formatted_address, Number(point?.lat), Number(point?.lng), {
        city: locality?.long_name || null,
        rawType: (item.types || []).join(','),
        persistable: allowStorage,
        source: 'google',
        providerId: item.place_id || null,
        meta: { locationType: item.geometry?.location_type || null },
      });
      if (candidate) rows.push(candidate);
    }
    if (rows.some((candidate) => isStrongCandidate(row, candidate))) break;
  }
  return rows;
}

async function yandexCandidates(row, queries) {
  const key = process.env.YANDEX_GEOCODER_API_KEY;
  if (!key) return [];
  const allowStorage = providerStorageFlag('yandex');
  const rows = [];
  for (const query of queries) {
    const url = new URL('https://geocode-maps.yandex.ru/v1/');
    url.searchParams.set('apikey', key);
    url.searchParams.set('geocode', row.parent ? `${query}, ${row.parent}, ${row.city}` : `${query}, ${row.city}, ${COUNTRY_NAME[row.country] || row.country}`);
    url.searchParams.set('lang', process.env.YANDEX_LANG || 'en_US');
    url.searchParams.set('format', 'json');
    url.searchParams.set('results', '8');
    const payload = await cachedJson('yandex', url.toString(), { cache: allowStorage, minDelayMs: 100 });
    const members = payload.response?.GeoObjectCollection?.featureMember || [];
    for (const member of members) {
      const object = member.GeoObject || {};
      const meta = object.metaDataProperty?.GeocoderMetaData || {};
      const [lng, lat] = String(object.Point?.pos || '').split(/\s+/).map(Number);
      const candidate = candidateBase('yandex', row, query, meta.text || object.name, lat, lng, {
        city: meta.Address?.Components?.find((part) => /locality/i.test(part.kind || ''))?.name || null,
        rawType: meta.kind || null,
        persistable: allowStorage,
        source: 'yandex',
        providerId: object.uri || null,
        meta: { precision: meta.precision || null },
      });
      if (candidate) rows.push(candidate);
    }
    if (rows.some((candidate) => isStrongCandidate(row, candidate))) break;
  }
  return rows;
}

async function twoGisCandidates(row, queries) {
  const key = process.env.DGIS_API_KEY;
  if (!key) return [];
  const allowStorage = providerStorageFlag('dgis');
  const rows = [];
  for (const query of queries) {
    const url = new URL('https://catalog.api.2gis.com/3.0/items/geocode');
    url.searchParams.set('q', `${query}, ${row.city}`);
    url.searchParams.set('fields', 'items.point,items.adm_div,items.geometry.centroid');
    url.searchParams.set('page_size', '8');
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
    if (rows.some((candidate) => isStrongCandidate(row, candidate))) break;
  }
  return rows;
}

async function mapTilerCandidates(row, queries) {
  const key = process.env.MAPTILER_API_KEY;
  if (!key) return [];
  const allowStorage = providerStorageFlag('maptiler');
  const rows = [];
  const cityGeo = cityBias(row);
  for (const query of queries) {
    const text = row.parent ? `${query}, ${row.parent}, ${row.city}` : `${query}, ${row.city}`;
    const url = new URL(`https://api.maptiler.com/geocoding/${encodeURIComponent(text)}.json`);
    url.searchParams.set('key', key);
    url.searchParams.set('limit', '8');
    url.searchParams.set('country', row.country.toLowerCase());
    if (cityGeo?.center) url.searchParams.set('proximity', `${cityGeo.center.lng},${cityGeo.center.lat}`);
    if (cityGeo?.bbox) url.searchParams.set('bbox', `${cityGeo.bbox.west},${cityGeo.bbox.south},${cityGeo.bbox.east},${cityGeo.bbox.north}`);
    const payload = await cachedJson('maptiler', url.toString(), { cache: allowStorage, minDelayMs: 75 });
    for (const item of payload.features || []) {
      const [lng, lat] = item.center || item.geometry?.coordinates || [];
      const candidate = candidateBase('maptiler', row, query, item.place_name || item.text, Number(lat), Number(lng), {
        city: item.context?.find((part) => /place|locality/i.test(part.id || ''))?.text || null,
        rawType: (item.place_type || []).join(','),
        persistable: allowStorage,
        source: 'maptiler',
        providerId: item.id || null,
      });
      if (candidate) rows.push(candidate);
    }
    if (rows.some((candidate) => isStrongCandidate(row, candidate))) break;
  }
  return rows;
}

async function geoapifyCandidates(row, queries) {
  const key = process.env.GEOAPIFY_API_KEY;
  if (!key) return [];
  const allowStorage = providerStorageFlag('geoapify');
  const rows = [];
  const cityGeo = cityBias(row);
  for (const query of queries) {
    const url = new URL('https://api.geoapify.com/v1/geocode/search');
    url.searchParams.set('text', row.parent ? `${query}, ${row.parent}, ${row.city}` : `${query}, ${row.city}`);
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', '8');
    url.searchParams.set('filter', `countrycode:${row.country.toLowerCase()}`);
    if (cityGeo?.center) url.searchParams.set('bias', `proximity:${cityGeo.center.lng},${cityGeo.center.lat}`);
    url.searchParams.set('apiKey', key);
    const payload = await cachedJson('geoapify', url.toString(), { cache: allowStorage, minDelayMs: 75 });
    for (const item of payload.results || []) {
      const candidate = candidateBase('geoapify', row, query, item.formatted || item.address_line1 || item.name, Number(item.lat), Number(item.lon), {
        city: item.city || item.town || item.municipality || null,
        rawType: item.result_type || item.category || null,
        persistable: allowStorage,
        source: 'geoapify',
        providerId: item.place_id || null,
        meta: { category: item.category || null, confidence: item.rank?.confidence ?? null, datasource: item.datasource?.sourcename || null },
      });
      if (candidate) rows.push(candidate);
    }
    if (rows.some((candidate) => isStrongCandidate(row, candidate))) break;
  }
  return rows;
}

async function mapboxCandidates(row, queries) {
  const token = process.env.MAPBOX_ACCESS_TOKEN;
  if (!token) return [];
  const permanent = process.env.MAPBOX_PERMANENT === '1';
  const rows = [];
  const cityGeo = cityBias(row);
  for (const query of queries) {
    const url = new URL('https://api.mapbox.com/search/geocode/v6/forward');
    url.searchParams.set('q', row.parent ? `${query}, ${row.parent}, ${row.city}` : `${query}, ${row.city}`);
    url.searchParams.set('country', row.country.toLowerCase());
    url.searchParams.set('limit', '8');
    if (cityGeo?.center) url.searchParams.set('proximity', `${cityGeo.center.lng},${cityGeo.center.lat}`);
    if (cityGeo?.bbox) url.searchParams.set('bbox', `${cityGeo.bbox.west},${cityGeo.bbox.south},${cityGeo.bbox.east},${cityGeo.bbox.north}`);
    if (permanent) url.searchParams.set('permanent', 'true');
    url.searchParams.set('access_token', token);
    const payload = await cachedJson('mapbox', url.toString(), { cache: permanent, minDelayMs: 75 });
    for (const item of payload.features || []) {
      const [lng, lat] = item.geometry?.coordinates || [];
      const props = item.properties || {};
      const candidate = candidateBase('mapbox', row, query, props.full_address || props.name || item.place_name || item.name, Number(lat), Number(lng), {
        city: props.context?.place?.name || props.context?.locality?.name || null,
        rawType: item.feature_type || props.feature_type || null,
        persistable: permanent,
        source: 'mapbox',
        providerId: item.id || props.mapbox_id || null,
      });
      if (candidate) rows.push(candidate);
    }
    if (rows.some((candidate) => isStrongCandidate(row, candidate))) break;
  }
  return rows;
}

const PROVIDER_LOADERS = Object.freeze({
  nominatim: nominatimCandidates,
  easyway: easyWayCandidates,
  wikiroutes: wikiRoutesCandidates,
  google: googleCandidates,
  yandex: yandexCandidates,
  '2gis': twoGisCandidates,
  maptiler: mapTilerCandidates,
  geoapify: geoapifyCandidates,
  mapbox: mapboxCandidates,
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

function dedupeCandidates(candidates) {
  const dedupe = new Map();
  for (const candidate of candidates) {
    const osmIdentity = candidate.osm?.type && Number.isFinite(candidate.osm?.id)
      ? `${candidate.provider}|osm:${candidate.osm.type}:${candidate.osm.id}`
      : null;
    const key = osmIdentity
      || `${candidate.provider}|${candidate.providerId || ''}|${candidate.lat.toFixed(6)}|${candidate.lng.toFixed(6)}|${normalize(candidate.label)}`;
    if (!dedupe.has(key)) dedupe.set(key, candidate);
  }
  return [...dedupe.values()];
}

function chooseCandidate(row, candidates, minScore) {
  const cityGeo = cityBias(row);
  const ranked = dedupeCandidates(candidates)
    .map((candidate) => {
      const baseScore = candidateScore(row, candidate);
      const consensus = consensusBoost(candidate, candidates, row);
      return { ...candidate, score: Math.min(1, baseScore + consensus.boost), supporting: consensus.supporting };
    })
    .sort((a, b) => b.score - a.score);

  const persistable = ranked.filter((candidate) => candidate.persistable && isAutoAcceptEligible(row, candidate, cityGeo));
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
  return {
    provider: candidate.provider,
    label: candidate.label,
    lat: candidate.lat,
    lng: candidate.lng,
    rawType: candidate.rawType,
    source: candidate.source,
    osm: candidate.osm,
    providerId: candidate.providerId,
    persistable: candidate.persistable,
    verificationOnly: !candidate.persistable,
    score: candidate.score,
    supporting: candidate.supporting || [],
  };
}

async function discoverOverpass(country, city, center) {
  return discoverOverpassScoped({
    country,
    city,
    cityGeo: cityEntity(country, city),
    center,
    request,
  });
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
  if (providers.includes('nominatim')) notes.push('Nominatim: structured + free-form fallbacks, city bbox bias, one process-wide serialized queue, >=1.1s/request (>=15s with --periodic), cached; spatial auto-accepts require direct type/name/city evidence.');
  if (providers.includes('easyway')) notes.push('EasyWay: all public city route schemes are indexed by default; set EASYWAY_MAX_ROUTES only when an explicit cap is needed. Verification-only.');
  if (providers.includes('wikiroutes')) notes.push(process.env.WIKIROUTES_API_KEY || process.env.BUSMAPS_API_KEY ? 'WikiRoutes: BusMaps /v1/stopsInRadius enabled through capi-host=wikiroutes.info.' : 'WikiRoutes requested but WIKIROUTES_API_KEY/BUSMAPS_API_KEY is unset; provider will be skipped.');
  if (providers.includes('google')) notes.push(process.env.GOOGLE_MAPS_API_KEY ? `Google enabled${providerStorageFlag('google') ? ' with storage opt-in' : ' as verification-only'}; set GOOGLE_ALLOW_STORAGE=1 only when your terms permit persistence.` : 'Google requested but GOOGLE_MAPS_API_KEY is unset; provider will be skipped.');
  if (providers.includes('yandex')) notes.push(process.env.YANDEX_GEOCODER_API_KEY ? `Yandex enabled${providerStorageFlag('yandex') ? ' with storage opt-in' : ' as verification-only'}.` : 'Yandex requested but YANDEX_GEOCODER_API_KEY is unset; provider will be skipped.');
  if (providers.includes('2gis')) notes.push(process.env.DGIS_API_KEY ? `2GIS enabled${providerStorageFlag('dgis') ? ' with storage opt-in' : ' as verification-only'}.` : '2GIS requested but DGIS_API_KEY is unset; provider will be skipped.');
  if (providers.includes('maptiler')) notes.push(process.env.MAPTILER_API_KEY ? `MapTiler enabled${providerStorageFlag('maptiler') ? ' with storage opt-in' : ' as verification-only'}.` : 'MapTiler requested but MAPTILER_API_KEY is unset; provider will be skipped.');
  if (providers.includes('geoapify')) notes.push(process.env.GEOAPIFY_API_KEY ? `Geoapify enabled${providerStorageFlag('geoapify') ? ' with storage opt-in' : ' as verification-only'}.` : 'Geoapify requested but GEOAPIFY_API_KEY is unset; provider will be skipped.');
  if (providers.includes('mapbox')) notes.push(process.env.MAPBOX_ACCESS_TOKEN ? `Mapbox enabled${process.env.MAPBOX_PERMANENT === '1' ? ' with permanent geocoding' : ' as temporary/verification-only'}.` : 'Mapbox requested but MAPBOX_ACCESS_TOKEN is unset; provider will be skipped.');
  return notes;
}

async function mapWithConcurrency(items, concurrency, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function runWorker() {
    while (true) {
      const index = nextIndex;
      nextIndex += 1;
      if (index >= items.length) return;
      results[index] = await worker(items[index], index);
    }
  }

  const workerCount = Math.min(concurrency, items.length);
  await Promise.all(Array.from({ length: workerCount }, () => runWorker()));
  return results;
}

async function processCity(args, city, providers) {
  const lexiconAvailable = Boolean(LOCATION_DICTIONARIES[args.country]?.[city]);
  const lexicon = lexicalRows(args.country, city);
  const bootstrapDiscovery = !lexiconAvailable;
  const unresolved = args.refresh
    ? lexicon
    : lexicon.filter((row) => !resolveLexiconGeoEntityExact({ country: row.country, city: row.city, type: row.type, canonical: row.canonical }));
  const prefix = `[${args.country}/${city}]`;

  if (bootstrapDiscovery) console.log(`${prefix} no LOCATION_DICTIONARIES city entry; running catalog-backed discovery bootstrap.`);
  console.log(`${prefix} ${unresolved.length}/${lexicon.length} lexical entities to inspect.`);
  const results = [];
  for (let index = 0; index < unresolved.length; index += 1) {
    const row = unresolved[index];
    const queries = queryVariants(row, args.maxAliases);
    const candidates = [];
    console.log(`${prefix} [${index + 1}/${unresolved.length}] ${row.type} ${row.canonical}`);

    for (const provider of providers) {
      try {
        const providerRows = await PROVIDER_LOADERS[provider](row, queries, args);
        candidates.push(...providerRows);
        if (providerRows.length) console.log(`${prefix}   ${provider}: ${providerRows.length} candidates`);
      } catch (error) {
        console.warn(`${prefix}   ${provider}: ${error?.message || error}`);
      }
    }

    const choice = chooseCandidate(row, candidates, args.minScore);
    const accepted = sanitizeCandidate(choice.accepted);
    const ranked = choice.ranked.slice(0, 12).map(sanitizeCandidate);
    results.push({
      entity: row,
      status: accepted ? 'accepted' : choice.ambiguous ? 'ambiguous' : candidates.length ? 'review' : 'not_found',
      accepted,
      candidates: ranked,
    });
    if (accepted) console.log(`${prefix}   accepted: ${accepted.provider} ${accepted.lat},${accepted.lng} score=${accepted.score.toFixed(3)}`);
  }

  let discoveries = [];
  if (args.discover || bootstrapDiscovery) {
    const center = cityEntity(args.country, city)?.center || null;
    try {
      discoveries.push(...await discoverOverpass(args.country, city, center));
    } catch (error) {
      console.warn(`${prefix} overpass discovery: ${error?.message || error}`);
    }
    discoveries = filterNewDiscoveries(discoveries, lexicon);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    country: args.country,
    city,
    mode: bootstrapDiscovery ? 'discovery-bootstrap' : args.discover ? 'lexicon-and-discovery' : 'lexicon',
    lexiconAvailable,
    providers,
    keylessProviders: providers.filter((provider) => ZERO_KEY_PROVIDERS.includes(provider)),
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

  const output = args.output || path.join(DEFAULT_OUTPUT_ROOT, `${args.country.toLowerCase()}-${slug(city)}.json`);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(`${prefix} Report: ${output}`);
  console.log(`${prefix} Accepted ${report.counts.accepted}; review ${report.counts.review}; ambiguous ${report.counts.ambiguous}; not found ${report.counts.notFound}; new discoveries ${report.counts.discoveries}.`);
  return report;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const cities = args.allCities ? countryCities(args.country) : [args.city];
  const providers = args.providers.filter((provider) => PROVIDER_LOADERS[provider]);
  if (!providers.length) throw new Error(`No supported providers selected. Supported: ${Object.keys(PROVIDER_LOADERS).join(', ')}`);

  console.log(`Geo enrichment: ${args.country}; ${cities.length} city${cities.length === 1 ? '' : 'ies'}; city concurrency=${args.allCities ? args.concurrency : 1}.`);
  console.log(`Providers: ${providers.join(', ')}`);
  console.log(`Keyless providers: ${providers.filter((provider) => ZERO_KEY_PROVIDERS.includes(provider)).join(', ') || 'none'}`);
  for (const note of providerNotes(providers)) console.log(`  policy: ${note}`);

  if (!args.allCities) {
    await processCity(args, args.city, providers);
    return;
  }

  const outcomes = await mapWithConcurrency(cities, args.concurrency, async (city) => {
    try {
      return { city, report: await processCity(args, city, providers), error: null };
    } catch (error) {
      console.error(`[${args.country}/${city}] failed: ${error?.stack || error}`);
      return { city, report: null, error: error?.message || String(error) };
    }
  });

  const successful = outcomes.filter((outcome) => outcome.report);
  const failed = outcomes.filter((outcome) => outcome.error);
  const totals = successful.reduce((acc, outcome) => {
    for (const key of ['lexicon', 'inspected', 'accepted', 'review', 'ambiguous', 'notFound', 'discoveries']) {
      acc[key] += outcome.report.counts[key];
    }
    return acc;
  }, { lexicon: 0, inspected: 0, accepted: 0, review: 0, ambiguous: 0, notFound: 0, discoveries: 0 });

  console.log(`Country run ${args.country}: ${successful.length}/${cities.length} cities completed; accepted ${totals.accepted}; review ${totals.review}; ambiguous ${totals.ambiguous}; not found ${totals.notFound}; discoveries ${totals.discoveries}.`);
  if (failed.length) {
    console.error(`Failed cities: ${failed.map((outcome) => `${outcome.city}: ${outcome.error}`).join('; ')}`);
    process.exitCode = 1;
  }
}

await main();
