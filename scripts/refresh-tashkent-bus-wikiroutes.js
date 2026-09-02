import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const CATALOG_URL = 'https://ru.wikiroutes.info/tashkent/catalog';
export const DEFAULT_CONCURRENCY = 6;
export const DEFAULT_TIMEOUT_MS = 12_000;
export const DEFAULT_MATCH_RADIUS_M = 80;

const BASE_URL = new URL(CATALOG_URL).origin;
const TASHKENT_BOUNDS = Object.freeze({ south: 40.9, north: 41.6, west: 68.8, east: 69.8 });

const decodeHtml = (value) => String(value ?? '')
  .replace(/&nbsp;/gi, ' ')
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&amp;/gi, '&')
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)));

const stripTags = (value) => decodeHtml(String(value ?? '').replace(/<[^>]*>/g, ' '))
  .replace(/\s+/g, ' ')
  .trim();

const absoluteUrl = (href, base = BASE_URL) => new URL(decodeHtml(href), base).href;

const anchorRows = (html) => [...String(html).matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
  .map((match) => ({ href: decodeHtml(match[1]), text: stripTags(match[2]), index: match.index ?? 0 }));

const routeIdFromUrl = (url) => {
  try {
    return new URL(url).searchParams.get('routes');
  } catch {
    return null;
  }
};

const stopIdFromUrl = (url) => {
  const match = new URL(url, BASE_URL).pathname.match(/^\/stops\/(\d+)\/?$/);
  return match?.[1] ?? null;
};

export function parseCatalogRoutes(html, { mode = 'bus' } = {}) {
  const source = String(html);
  const busStart = source.search(/Автобусы(?:\s|&nbsp;|<)/i);
  const minibusStart = source.search(/Маршрутки(?:\s|&nbsp;|<)/i);
  const metroStart = source.search(/Метро(?:\s|&nbsp;|<)/i);
  const sectionEnd = [minibusStart, metroStart].filter((value) => value >= 0).sort((a, b) => a - b)[0] ?? source.length;

  const rows = anchorRows(source).filter(({ href, index }) => {
    if (mode === 'bus' && busStart >= 0 && (index < busStart || index >= sectionEnd)) return false;
    const url = new URL(href, BASE_URL);
    return url.pathname === '/tashkent' && Boolean(url.searchParams.get('routes'));
  });

  const seen = new Set();
  return rows.flatMap(({ href, text }) => {
    const url = absoluteUrl(href);
    const sourceRouteId = routeIdFromUrl(url);
    if (!sourceRouteId || seen.has(sourceRouteId)) return [];
    seen.add(sourceRouteId);
    const ref = text.replace(/\s*\([^)]*\)\s*$/, '').trim();
    return [{ source: 'wikiroutes', sourceRouteId, sourceRouteUrl: url, ref, label: text, mode }];
  });
}

const headingRows = (html, level) => [...String(html).matchAll(new RegExp(`<h${level}\\b[^>]*>([\\s\\S]*?)<\\/h${level}>`, 'gi'))]
  .map((match) => ({ index: match.index ?? 0, text: stripTags(match[1]), html: match[1] }));

export function parseRoutePage(html, route) {
  const source = String(html);
  const directions = headingRows(source, 2)
    .filter(({ text }) => text.includes('—') || text.includes('→'));

  const parsed = directions.map((direction, directionIndex) => {
    const end = directions[directionIndex + 1]?.index ?? source.length;
    const section = source.slice(direction.index, end);
    const seen = new Set();
    const stops = anchorRows(section).flatMap(({ href, text }) => {
      const sourceStopUrl = absoluteUrl(href, route.sourceRouteUrl);
      const sourceStopId = stopIdFromUrl(sourceStopUrl);
      if (!sourceStopId || seen.has(sourceStopId)) return [];
      seen.add(sourceStopId);
      return [{ sourceStopId, sourceStopUrl, name: text }];
    });
    const [from = stops[0]?.name ?? '', to = stops.at(-1)?.name ?? ''] = direction.text
      .split(/\s+[—→]\s+/)
      .map((value) => value.trim());
    return {
      sourceDirectionId: String(directionIndex),
      name: direction.text,
      from,
      to,
      stops,
    };
  }).filter((direction) => direction.stops.length >= 2);

  return { ...route, directions: parsed };
}

const inTashkent = (lat, lng) => Number.isFinite(lat) && Number.isFinite(lng)
  && lat >= TASHKENT_BOUNDS.south && lat <= TASHKENT_BOUNDS.north
  && lng >= TASHKENT_BOUNDS.west && lng <= TASHKENT_BOUNDS.east;

const candidateCoordinates = (html) => {
  const source = String(html);
  const patterns = [
    /["'](?:lat|latitude)["']\s*:\s*(-?\d+(?:\.\d+)?)[\s\S]{0,160}?["'](?:lng|lon|longitude)["']\s*:\s*(-?\d+(?:\.\d+)?)/gi,
    /["'](?:lng|lon|longitude)["']\s*:\s*(-?\d+(?:\.\d+)?)[\s\S]{0,160}?["'](?:lat|latitude)["']\s*:\s*(-?\d+(?:\.\d+)?)/gi,
    /data-lat(?:itude)?\s*=\s*["'](-?\d+(?:\.\d+)?)["'][\s\S]{0,160}?data-l(?:ng|on|ongitude)\s*=\s*["'](-?\d+(?:\.\d+)?)["']/gi,
    /(?:center|coordinates)\s*[:=]\s*\[\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\]/gi,
  ];
  const results = [];
  for (const [patternIndex, pattern] of patterns.entries()) {
    for (const match of source.matchAll(pattern)) {
      const a = Number(match[1]);
      const b = Number(match[2]);
      if (patternIndex === 1 || patternIndex === 3) results.push({ lat: b, lng: a });
      else results.push({ lat: a, lng: b });
    }
  }
  return results;
};

export function parseStopPage(html, stop) {
  const coordinates = candidateCoordinates(html).find(({ lat, lng }) => inTashkent(lat, lng));
  if (!coordinates) return { ...stop, lat: null, lng: null, coordinateStatus: 'missing' };
  return { ...stop, ...coordinates, coordinateStatus: 'ok' };
}

const normalizeName = (value) => stripTags(value)
  .toLocaleLowerCase('ru')
  .replace(/[«»"'`’.,()№]/g, ' ')
  .replace(/\b(?:остановка|станция|автобусная|метро|ул(?:ица)?|проспект|массив)\b/gu, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const haversineM = (a, b) => {
  const radians = (degrees) => degrees * Math.PI / 180;
  const dLat = radians(b.lat - a.lat);
  const dLng = radians(b.lng - a.lng);
  const lat1 = radians(a.lat);
  const lat2 = radians(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 6_371_000 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

export function reconcileStopsWithOsm(wikiStops, osmStops, { matchRadiusM = DEFAULT_MATCH_RADIUS_M } = {}) {
  return wikiStops.map((stop) => {
    if (!inTashkent(stop.lat, stop.lng)) return { ...stop, osmMatchId: null, osmMatchDistanceM: null };
    const wikiName = normalizeName(stop.name);
    const candidates = osmStops
      .filter((osm) => osm?.center && inTashkent(osm.center.lat, osm.center.lng))
      .map((osm) => ({ osm, distanceM: haversineM(stop, osm.center), name: normalizeName(osm.canonicalName) }))
      .filter(({ distanceM }) => distanceM <= matchRadiusM)
      .sort((a, b) => a.distanceM - b.distanceM);

    const exactName = candidates.find(({ name }) => wikiName && name === wikiName);
    const nearest = exactName ?? (candidates[0]?.distanceM <= 35 ? candidates[0] : null);
    return {
      ...stop,
      osmMatchId: nearest?.osm.id ?? null,
      osmMatchDistanceM: nearest ? Math.round(nearest.distanceM * 10) / 10 : null,
    };
  });
}

async function fetchText(url, { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'geo-catalog/0.7 wikiroutes transport refresh (+https://github.com/AmoneMisa/geo-catalog)' },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  return response.text();
}

async function mapConcurrent(items, concurrency, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  async function run() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run));
  return results;
}

const uniqueStops = (routes) => {
  const stops = new Map();
  for (const route of routes) for (const direction of route.directions) for (const stop of direction.stops) {
    if (!stops.has(stop.sourceStopId)) stops.set(stop.sourceStopId, stop);
  }
  return [...stops.values()];
};

export async function crawlWikiRoutes({
  catalogUrl = CATALOG_URL,
  concurrency = DEFAULT_CONCURRENCY,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  fetcher = fetchText,
  osmStops = [],
} = {}) {
  const catalogHtml = await fetcher(catalogUrl, { timeoutMs });
  const catalogRoutes = parseCatalogRoutes(catalogHtml);
  const routes = (await mapConcurrent(catalogRoutes, concurrency, async (route) => {
    const html = await fetcher(route.sourceRouteUrl, { timeoutMs });
    return parseRoutePage(html, route);
  })).filter((route) => route.directions.length);

  const stopPages = await mapConcurrent(uniqueStops(routes), concurrency, async (stop) => {
    try {
      return parseStopPage(await fetcher(stop.sourceStopUrl, { timeoutMs }), stop);
    } catch (error) {
      return { ...stop, lat: null, lng: null, coordinateStatus: 'error', error: String(error?.message ?? error) };
    }
  });
  const reconciledStops = reconcileStopsWithOsm(stopPages, osmStops);
  const stopById = new Map(reconciledStops.map((stop) => [stop.sourceStopId, stop]));

  return {
    source: 'wikiroutes',
    catalogUrl,
    fetchedAt: new Date().toISOString(),
    routeCount: routes.length,
    stopCount: reconciledStops.length,
    routes: routes.map((route) => ({
      ...route,
      directions: route.directions.map((direction) => ({
        ...direction,
        stops: direction.stops.map((stop) => stopById.get(stop.sourceStopId) ?? stop),
      })),
    })),
  };
}

const jsString = (value) => JSON.stringify(value, null, 2);

async function main() {
  const outputArg = process.argv.find((arg) => arg.startsWith('--output='));
  const output = outputArg?.slice('--output='.length)
    || 'src/transport/generated/tashkent-bus-wikiroutes-snapshot.js';

  let osmStops = [];
  try {
    ({ TASHKENT_BUS_OSM_STOPS: osmStops } = await import('../src/transport/tashkent-bus-osm.js'));
  } catch (error) {
    console.warn(`[wikiroutes] OSM reconciliation unavailable: ${error?.message ?? error}`);
  }

  const snapshot = await crawlWikiRoutes({ osmStops });
  const moduleSource = `// Generated by scripts/refresh-tashkent-bus-wikiroutes.js.\nexport default ${jsString(snapshot)};\n`;
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, moduleSource, 'utf8');
  const missingCoordinates = snapshot.routes.flatMap((route) => route.directions)
    .flatMap((direction) => direction.stops)
    .filter((stop) => stop.coordinateStatus !== 'ok').length;
  console.log(`[wikiroutes] routes=${snapshot.routeCount} uniqueStops=${snapshot.stopCount} unresolvedCoordinateRefs=${missingCoordinates}`);
  console.log(`[wikiroutes] wrote ${output}`);
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : null;
if (invokedPath && import.meta.url === invokedPath) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
