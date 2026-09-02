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

export const normalizeRouteRef = (value) => stripTags(value)
  .toLocaleUpperCase('ru')
  .replace(/Т/gu, 'T')
  .replace(/\s+/g, '');

export function parseCatalogRoutes(html, { mode = 'bus' } = {}) {
  const source = String(html);
  const busStart = source.search(/Автобусы(?:\s|&nbsp;|<)/i);
  const minibusStart = source.search(/Маршрутки(?:\s|&nbsp;|<)/i);
  const metroStart = source.search(/Метро(?:\s|&nbsp;|<)/i);
  const sectionEnd = [minibusStart, metroStart]
    .filter((value) => value >= 0)
    .sort((a, b) => a - b)[0] ?? source.length;

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
  .map((match) => ({ index: match.index ?? 0, text: stripTags(match[1]) }));

export function parseRoutePage(html, route) {
  const source = String(html);
  const directions = headingRows(source, 2)
    .filter(({ text }) => text.includes('—') || text.includes('→'));

  const parsed = directions.map((direction, directionIndex) => {
    const end = directions[directionIndex + 1]?.index ?? source.length;
    const section = source.slice(direction.index, end);
    const stops = anchorRows(section).flatMap(({ href, text }) => {
      const sourceStopUrl = absoluteUrl(href, route.sourceRouteUrl);
      const sourceStopId = stopIdFromUrl(sourceStopUrl);
      if (!sourceStopId) return [];
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
  const source = decodeHtml(String(html));
  const patterns = [
    {
      source: 'google_street_view',
      pattern: /[?&]cbll=(-?\d+(?:\.\d+)?)(?:%2C|,)(-?\d+(?:\.\d+)?)/gi,
      toPoint: (match) => ({ lat: Number(match[1]), lng: Number(match[2]) }),
    },
    {
      source: 'embedded_lat_lng',
      pattern: /["'](?:lat|latitude)["']\s*:\s*(-?\d+(?:\.\d+)?)[\s\S]{0,160}?["'](?:lng|lon|longitude)["']\s*:\s*(-?\d+(?:\.\d+)?)/gi,
      toPoint: (match) => ({ lat: Number(match[1]), lng: Number(match[2]) }),
    },
    {
      source: 'embedded_lng_lat',
      pattern: /["'](?:lng|lon|longitude)["']\s*:\s*(-?\d+(?:\.\d+)?)[\s\S]{0,160}?["'](?:lat|latitude)["']\s*:\s*(-?\d+(?:\.\d+)?)/gi,
      toPoint: (match) => ({ lat: Number(match[2]), lng: Number(match[1]) }),
    },
    {
      source: 'data_attributes',
      pattern: /data-lat(?:itude)?\s*=\s*["'](-?\d+(?:\.\d+)?)["'][\s\S]{0,160}?data-l(?:ng|on|ongitude)\s*=\s*["'](-?\d+(?:\.\d+)?)["']/gi,
      toPoint: (match) => ({ lat: Number(match[1]), lng: Number(match[2]) }),
    },
    {
      source: 'coordinate_array',
      pattern: /(?:center|coordinates)\s*[:=]\s*\[\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\]/gi,
      toPoint: (match) => ({ lat: Number(match[2]), lng: Number(match[1]) }),
    },
  ];

  const results = [];
  for (const candidate of patterns) {
    for (const match of source.matchAll(candidate.pattern)) {
      results.push({ ...candidate.toPoint(match), source: candidate.source });
    }
  }
  return results;
};

export function parseStopPage(html, stop) {
  const coordinates = candidateCoordinates(html).find(({ lat, lng }) => inTashkent(lat, lng));
  if (!coordinates) {
    return { ...stop, lat: null, lng: null, coordinateStatus: 'missing', coordinateSource: null };
  }
  return {
    ...stop,
    lat: coordinates.lat,
    lng: coordinates.lng,
    coordinateStatus: 'ok',
    coordinateSource: coordinates.source,
  };
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
    if (!inTashkent(stop.lat, stop.lng)) {
      return { ...stop, osmMatchId: null, osmMatchDistanceM: null };
    }
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

export function reconcileRoutes(routes, knownRoutes = [], knownVariants = []) {
  const routeByRef = new Map(knownRoutes.map((route) => [normalizeRouteRef(route.ref), route]));
  const variantsByRef = new Map();
  for (const variant of knownVariants) {
    const key = normalizeRouteRef(variant.ref);
    if (!variantsByRef.has(key)) variantsByRef.set(key, []);
    variantsByRef.get(key).push(variant);
  }

  return routes.map((route) => {
    const key = normalizeRouteRef(route.ref);
    const knownRoute = routeByRef.get(key);
    const variants = variantsByRef.get(key) ?? [];
    return {
      ...route,
      catalogRouteId: knownRoute?.id ?? null,
      catalogCoverage: knownRoute?.coverage ?? null,
      knownVariantIds: variants.map((variant) => variant.id),
      knownVariantSources: [...new Set(variants.map((variant) => variant.source).filter(Boolean))],
    };
  });
}

async function fetchText(url, { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'geo-catalog/0.7 wikiroutes transport refresh (+https://github.com/AmoneMisa/geo-catalog)',
    },
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
  for (const route of routes) {
    for (const direction of route.directions) {
      for (const stop of direction.stops) {
        if (!stops.has(stop.sourceStopId)) stops.set(stop.sourceStopId, stop);
      }
    }
  }
  return [...stops.values()];
};

export async function crawlWikiRoutes({
  catalogUrl = CATALOG_URL,
  concurrency = DEFAULT_CONCURRENCY,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  fetcher = fetchText,
  osmStops = [],
  knownRoutes = [],
  knownVariants = [],
} = {}) {
  const catalogHtml = await fetcher(catalogUrl, { timeoutMs });
  const catalogRoutes = parseCatalogRoutes(catalogHtml);
  const routeResults = await mapConcurrent(catalogRoutes, concurrency, async (route) => {
    try {
      const html = await fetcher(route.sourceRouteUrl, { timeoutMs });
      return parseRoutePage(html, route);
    } catch (error) {
      return { ...route, directions: [], crawlError: String(error?.message ?? error) };
    }
  });
  const routes = routeResults.filter((route) => route.directions.length);
  const routeErrors = routeResults.filter((route) => route.crawlError);

  const stopPages = await mapConcurrent(uniqueStops(routes), concurrency, async (stop) => {
    try {
      return parseStopPage(await fetcher(stop.sourceStopUrl, { timeoutMs }), stop);
    } catch (error) {
      return {
        ...stop,
        lat: null,
        lng: null,
        coordinateStatus: 'error',
        coordinateSource: null,
        error: String(error?.message ?? error),
      };
    }
  });
  const reconciledStops = reconcileStopsWithOsm(stopPages, osmStops);
  const stopById = new Map(reconciledStops.map((stop) => [stop.sourceStopId, stop]));
  const hydratedRoutes = routes.map((route) => ({
    ...route,
    directions: route.directions.map((direction) => ({
      ...direction,
      stops: direction.stops.map((stop) => stopById.get(stop.sourceStopId) ?? stop),
    })),
  }));
  const reconciledRoutes = reconcileRoutes(hydratedRoutes, knownRoutes, knownVariants);

  const wikiRefs = new Set(reconciledRoutes.map((route) => normalizeRouteRef(route.ref)));
  const knownRefs = new Map(knownRoutes.map((route) => [normalizeRouteRef(route.ref), route.ref]));
  const coordinatesResolved = reconciledStops.filter((stop) => stop.coordinateStatus === 'ok').length;
  const osmMatchedStops = reconciledStops.filter((stop) => stop.osmMatchId).length;

  return {
    source: 'wikiroutes',
    catalogUrl,
    fetchedAt: new Date().toISOString(),
    catalogRouteCount: catalogRoutes.length,
    routeCount: reconciledRoutes.length,
    routeErrorCount: routeErrors.length,
    stopCount: reconciledStops.length,
    stopCoordinateCount: coordinatesResolved,
    stopCoordinateMissingCount: reconciledStops.length - coordinatesResolved,
    osmMatchedStopCount: osmMatchedStops,
    reconciliation: {
      knownRouteCount: knownRoutes.length,
      matchedKnownRouteCount: reconciledRoutes.filter((route) => route.catalogRouteId).length,
      wikiRouteRefsMissingFromCatalog: reconciledRoutes
        .filter((route) => !route.catalogRouteId)
        .map((route) => route.ref),
      catalogRouteRefsMissingFromWiki: [...knownRefs]
        .filter(([ref]) => !wikiRefs.has(ref))
        .map(([, ref]) => ref),
    },
    routeErrors: routeErrors.map(({ sourceRouteId, sourceRouteUrl, ref, crawlError }) => ({
      sourceRouteId,
      sourceRouteUrl,
      ref,
      crawlError,
    })),
    routes: reconciledRoutes,
  };
}

const jsString = (value) => JSON.stringify(value, null, 2);

async function main() {
  const outputArg = process.argv.find((arg) => arg.startsWith('--output='));
  const output = outputArg?.slice('--output='.length)
    || 'src/transport/generated/tashkent-bus-wikiroutes-snapshot.js';

  let osmStops = [];
  let knownRoutes = [];
  let knownVariants = [];
  try {
    const [bus, osm, official] = await Promise.all([
      import('../src/transport/tashkent-bus.js'),
      import('../src/transport/tashkent-bus-osm.js'),
      import('../src/transport/tashkent-bus-official.js'),
    ]);
    osmStops = osm.TASHKENT_BUS_OSM_STOPS;
    knownRoutes = bus.TASHKENT_BUS_ROUTES;
    knownVariants = [
      ...osm.TASHKENT_BUS_OSM_ROUTE_VARIANTS,
      ...official.TASHKENT_BUS_OFFICIAL_ROUTE_VARIANTS,
    ];
  } catch (error) {
    console.warn(`[wikiroutes] local transport reconciliation unavailable: ${error?.message ?? error}`);
  }

  const snapshot = await crawlWikiRoutes({ osmStops, knownRoutes, knownVariants });
  const moduleSource = `// Generated by scripts/refresh-tashkent-bus-wikiroutes.js.\nexport default ${jsString(snapshot)};\n`;
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, moduleSource, 'utf8');

  console.log(
    `[wikiroutes] catalog=${snapshot.catalogRouteCount} parsed=${snapshot.routeCount} `
    + `routeErrors=${snapshot.routeErrorCount}`,
  );
  console.log(
    `[wikiroutes] uniqueStops=${snapshot.stopCount} coordinates=${snapshot.stopCoordinateCount} `
    + `osmMatched=${snapshot.osmMatchedStopCount}`,
  );
  console.log(
    `[wikiroutes] routeMatches=${snapshot.reconciliation.matchedKnownRouteCount}/${snapshot.reconciliation.knownRouteCount} `
    + `wikiOnly=${snapshot.reconciliation.wikiRouteRefsMissingFromCatalog.length} `
    + `catalogOnly=${snapshot.reconciliation.catalogRouteRefsMissingFromWiki.length}`,
  );
  console.log(`[wikiroutes] wrote ${output}`);
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : null;
if (invokedPath && import.meta.url === invokedPath) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
