import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  CATALOG_URL,
  DEFAULT_CONCURRENCY,
  DEFAULT_TIMEOUT_MS,
  DEFAULT_MATCH_RADIUS_M,
  parseRoutePage,
  parseStopPage,
} from './refresh-tashkent-bus-wikiroutes.js';

export { CATALOG_URL, DEFAULT_CONCURRENCY, DEFAULT_TIMEOUT_MS, DEFAULT_MATCH_RADIUS_M };

const BASE_URL = new URL(CATALOG_URL).origin;
const MODE_LABELS = Object.freeze([
  ['Автобусы', 'bus'],
  ['Маршрутки', 'minibus'],
  ['Метро', 'metro'],
  ['Троллейбусы', 'trolleybus'],
  ['Трамваи', 'tram'],
  ['Фуникулёры', 'funicular'],
  ['Фуникулеры', 'funicular'],
  ['Фуникулёр', 'funicular'],
  ['Фуникулер', 'funicular'],
]);
export const SUPPORTED_WIKIROUTES_MODES = Object.freeze([
  'bus',
  'minibus',
  'metro',
  'trolleybus',
  'tram',
  'funicular',
]);

const decodeHtml = (value) => String(value ?? '')
  .replace(/&nbsp;/gi, ' ')
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&mdash;|&ndash;/gi, '—')
  .replace(/&amp;/gi, '&')
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)));

const stripTags = (value) => decodeHtml(String(value ?? '').replace(/<[^>]*>/g, ' '))
  .replace(/\s+/g, ' ')
  .trim();

const htmlAttribute = (attributes, name) => {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = String(attributes).match(
    new RegExp(`\\b${escapedName}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'),
  );
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? null;
};

const elementRows = (source, tag) => [...String(source).matchAll(
  new RegExp(`<${tag}\\b([^>]*)>([\\s\\S]*?)<\\/${tag}>`, 'gi'),
)].map((match) => ({
  attributes: match[1],
  html: match[2],
  text: stripTags(match[2]),
  classes: (htmlAttribute(match[1], 'class') ?? '').split(/\s+/).filter(Boolean),
}));

const typeBlocks = (html) => {
  const source = String(html);
  const starts = [...source.matchAll(/<div\b([^>]*)>/gi)].flatMap((match) => {
    const classes = (htmlAttribute(match[1], 'class') ?? '').split(/\s+/).filter(Boolean);
    return classes.includes('typeBlock') ? [{ index: match.index ?? 0 }] : [];
  });

  return starts.flatMap((start, index) => {
    const section = source.slice(start.index, starts[index + 1]?.index ?? source.length);
    const spans = elementRows(section.slice(0, 2200), 'span');
    const header = spans.find((span) => span.classes.includes('typeHeader-name'))?.text ?? '';
    const mode = MODE_LABELS.find(([label]) => header.toLocaleLowerCase('ru') === label.toLocaleLowerCase('ru'))?.[1];
    if (!mode) return [];
    const countText = spans.find((span) => span.classes.includes('count'))?.text ?? '';
    const countMatch = countText.match(/\(?\s*(\d+)\s*\)?/);
    return [{ mode, header, declaredCount: countMatch ? Number(countMatch[1]) : null, section }];
  });
};

const routeAnchors = (section) => [...String(section).matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].flatMap((match) => {
  const attributes = match[1];
  const href = htmlAttribute(attributes, 'href');
  if (!href) return [];
  const url = new URL(decodeHtml(href), BASE_URL);
  if (url.pathname !== '/tashkent' || !url.searchParams.get('routes')) return [];
  const classes = (htmlAttribute(attributes, 'class') ?? '').split(/\s+/).filter(Boolean);
  if (classes.includes('no-active')) return [];
  return [{
    sourceRouteId: url.searchParams.get('routes'),
    sourceRouteUrl: url.href,
    label: stripTags(match[2]),
    title: stripTags(htmlAttribute(attributes, 'title') ?? match[2]),
    scope: classes.find((value) => ['city', 'suburban', 'intercity'].includes(value)) ?? null,
  }];
});

const routeRefFromLabel = (label) => String(label ?? '').replace(/\s*\([^)]*\)\s*$/, '').trim();

export function parseActiveCatalog(html, { modes = SUPPORTED_WIKIROUTES_MODES } = {}) {
  const allowedModes = new Set(modes);
  const blocks = typeBlocks(html).filter((block) => allowedModes.has(block.mode));
  const seen = new Set();
  const routes = [];
  const declaredCountsByMode = {};

  for (const block of blocks) {
    declaredCountsByMode[block.mode] = block.declaredCount;
    for (const anchor of routeAnchors(block.section)) {
      if (!anchor.sourceRouteId || seen.has(anchor.sourceRouteId)) continue;
      seen.add(anchor.sourceRouteId);
      routes.push({
        source: 'wikiroutes',
        active: true,
        mode: block.mode,
        sourceRouteId: anchor.sourceRouteId,
        sourceRouteUrl: anchor.sourceRouteUrl,
        ref: routeRefFromLabel(anchor.title || anchor.label),
        label: anchor.title || anchor.label,
        scope: anchor.scope,
      });
    }
  }

  return {
    routes,
    declaredCountsByMode,
    routeCountsByMode: Object.fromEntries(SUPPORTED_WIKIROUTES_MODES.map((mode) => [
      mode,
      routes.filter((route) => route.mode === mode).length,
    ])),
  };
}

export const normalizeRouteRef = (value) => stripTags(value)
  .toLocaleUpperCase('ru')
  .replace(/[\s'’`-]+/g, '')
  .replace(/Т$/u, 'T')
  .replace(/М$/u, 'M')
  .replace(/И$/u, 'I');

const metroMatchKey = (value) => {
  const normalized = normalizeRouteRef(value);
  const aliases = new Map([
    ['ЛИНИЯТРИДЦАТИЛЕТИЯНЕЗАВИСИМОСТИУЗБЕКИСТАНА', 'CIRCLE'],
    ['УЗБЕКИСТАНСКАЯЛИНИЯ', 'OZBEKISTON'],
    ['ЧИЛАНЗАРСКАЯЛИНИЯ', 'CHILONZOR'],
    ['ЮНУСАБАДСКАЯЛИНИЯ', 'YUNUSOBOD'],
  ]);
  return aliases.get(normalized) ?? normalized;
};

export const routeMatchKey = (mode, ref) => `${mode}:${mode === 'metro' ? metroMatchKey(ref) : normalizeRouteRef(ref)}`;

const radians = (degrees) => degrees * Math.PI / 180;
const haversineM = (a, b) => {
  const dLat = radians(b.lat - a.lat);
  const dLng = radians(b.lng - a.lng);
  const lat1 = radians(a.lat);
  const lat2 = radians(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 6_371_000 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

const normalizeStopName = (value) => stripTags(value)
  .toLocaleLowerCase('ru')
  .replace(/[«»"'`’.,()№]/g, ' ')
  .replace(/\b(?:остановка|станция|автобусная|метро|ул(?:ица)?|проспект|массив|ст\.?\s*м\.?)\b/gu, ' ')
  .replace(/\s+/g, ' ')
  .trim();

export function reconcileStops(stops, knownStops, { matchRadiusM = DEFAULT_MATCH_RADIUS_M } = {}) {
  return stops.map((stop) => {
    if (!Number.isFinite(stop.lat) || !Number.isFinite(stop.lng)) {
      return { ...stop, knownStopId: null, knownStopMode: null, knownStopDistanceM: null, knownStopSource: null };
    }
    const modes = new Set(stop.modes ?? []);
    const name = normalizeStopName(stop.name);
    const candidates = knownStops
      .filter((known) => known?.center && (!modes.size || modes.has(known.mode)))
      .map((known) => ({
        known,
        distanceM: haversineM(stop, known.center),
        name: normalizeStopName(known.canonicalName),
      }))
      .filter(({ distanceM }) => distanceM <= matchRadiusM)
      .sort((a, b) => a.distanceM - b.distanceM);
    const match = candidates.find((candidate) => name && candidate.name === name)
      ?? (candidates[0]?.distanceM <= 35 ? candidates[0] : null);
    return {
      ...stop,
      knownStopId: match?.known.id ?? null,
      knownStopMode: match?.known.mode ?? null,
      knownStopSource: match?.known.source ?? null,
      knownStopDistanceM: match ? Math.round(match.distanceM * 10) / 10 : null,
    };
  });
}

export function reconcileRoutes(routes, knownRoutes = [], knownVariants = []) {
  const routesByKey = new Map(knownRoutes.map((route) => [routeMatchKey(route.mode, route.ref), route]));
  const variantsByKey = new Map();
  for (const variant of knownVariants) {
    const key = routeMatchKey(variant.mode, variant.ref);
    if (!variantsByKey.has(key)) variantsByKey.set(key, []);
    variantsByKey.get(key).push(variant);
  }
  return routes.map((route) => {
    const key = routeMatchKey(route.mode, route.ref);
    const knownRoute = routesByKey.get(key);
    const variants = variantsByKey.get(key) ?? [];
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
      'user-agent': 'geo-catalog/0.7 active WikiRoutes transport refresh (+https://github.com/AmoneMisa/geo-catalog)',
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

const collectUniqueStops = (routes) => {
  const byId = new Map();
  for (const route of routes) {
    for (const direction of route.directions) {
      for (const stop of direction.stops) {
        const current = byId.get(stop.sourceStopId);
        if (current) {
          current.modes.add(route.mode);
          continue;
        }
        byId.set(stop.sourceStopId, { ...stop, modes: new Set([route.mode]) });
      }
    }
  }
  return [...byId.values()].map((stop) => ({ ...stop, modes: [...stop.modes] }));
};

export async function crawlWikiRoutes({
  catalogUrl = CATALOG_URL,
  modes = SUPPORTED_WIKIROUTES_MODES,
  concurrency = DEFAULT_CONCURRENCY,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  fetcher = fetchText,
  knownStops = [],
  knownRoutes = [],
  knownVariants = [],
} = {}) {
  const catalogHtml = await fetcher(catalogUrl, { timeoutMs });
  const catalog = parseActiveCatalog(catalogHtml, { modes });
  const routeResults = await mapConcurrent(catalog.routes, concurrency, async (route) => {
    try {
      return parseRoutePage(await fetcher(route.sourceRouteUrl, { timeoutMs }), route);
    } catch (error) {
      return { ...route, directions: [], crawlError: String(error?.message ?? error) };
    }
  });
  const parsedRoutes = routeResults.filter((route) => route.directions.length);
  const routeErrors = routeResults.filter((route) => route.crawlError);

  const stopPages = await mapConcurrent(collectUniqueStops(parsedRoutes), concurrency, async (stop) => {
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
  const reconciledStops = reconcileStops(stopPages, knownStops);
  const stopById = new Map(reconciledStops.map((stop) => [stop.sourceStopId, stop]));
  const hydratedRoutes = parsedRoutes.map((route) => ({
    ...route,
    directions: route.directions.map((direction) => ({
      ...direction,
      stops: direction.stops.map((stop) => stopById.get(stop.sourceStopId) ?? stop),
    })),
  }));
  const routes = reconcileRoutes(hydratedRoutes, knownRoutes, knownVariants);

  const routeCountsByMode = Object.fromEntries(SUPPORTED_WIKIROUTES_MODES.map((mode) => [
    mode,
    routes.filter((route) => route.mode === mode).length,
  ]));
  const knownKeys = new Set(knownRoutes.map((route) => routeMatchKey(route.mode, route.ref)));
  const wikiKeys = new Set(routes.map((route) => routeMatchKey(route.mode, route.ref)));

  return {
    source: 'wikiroutes',
    activeOnly: true,
    catalogUrl,
    fetchedAt: new Date().toISOString(),
    modes: [...modes],
    declaredCountsByMode: catalog.declaredCountsByMode,
    routeCountsByMode,
    routeCount: routes.length,
    routeErrorCount: routeErrors.length,
    stopCount: reconciledStops.length,
    stopCoordinateCount: reconciledStops.filter((stop) => stop.coordinateStatus === 'ok').length,
    knownStopMatchCount: reconciledStops.filter((stop) => stop.knownStopId).length,
    reconciliation: {
      knownRouteCount: knownRoutes.length,
      matchedKnownRouteCount: routes.filter((route) => route.catalogRouteId).length,
      wikiRouteKeysMissingFromCatalog: routes
        .filter((route) => !knownKeys.has(routeMatchKey(route.mode, route.ref)))
        .map((route) => ({ mode: route.mode, ref: route.ref })),
      catalogRouteKeysMissingFromWiki: knownRoutes
        .filter((route) => !wikiKeys.has(routeMatchKey(route.mode, route.ref)))
        .map((route) => ({ mode: route.mode, ref: route.ref })),
    },
    routeErrors: routeErrors.map(({ mode, sourceRouteId, sourceRouteUrl, ref, crawlError }) => ({
      mode,
      sourceRouteId,
      sourceRouteUrl,
      ref,
      crawlError,
    })),
    routes,
  };
}

async function localTransportData() {
  try {
    const [bus, osm, official, minibus, metro] = await Promise.all([
      import('../src/transport/tashkent-bus.js'),
      import('../src/transport/tashkent-bus-osm.js'),
      import('../src/transport/tashkent-bus-official.js'),
      import('../src/transport/tashkent-minibus.js'),
      import('../src/transport/tashkent-metro.js'),
    ]);
    return {
      knownStops: [
        ...osm.TASHKENT_BUS_OSM_STOPS,
        ...official.TASHKENT_BUS_OFFICIAL_STOPS,
        ...minibus.TASHKENT_MINIBUS_STOPS,
        ...metro.TASHKENT_METRO_STOPS,
      ],
      knownRoutes: [
        ...bus.TASHKENT_BUS_ROUTES,
        ...minibus.TASHKENT_MINIBUS_ROUTES,
        ...metro.TASHKENT_METRO_ROUTES,
      ],
      knownVariants: [
        ...osm.TASHKENT_BUS_OSM_ROUTE_VARIANTS,
        ...official.TASHKENT_BUS_OFFICIAL_ROUTE_VARIANTS,
        ...minibus.TASHKENT_MINIBUS_ROUTE_VARIANTS,
      ],
    };
  } catch (error) {
    console.warn(`[wikiroutes] local transport reconciliation unavailable: ${error?.message ?? error}`);
    return { knownStops: [], knownRoutes: [], knownVariants: [] };
  }
}

const jsString = (value) => JSON.stringify(value, null, 2);

async function main() {
  const outputArg = process.argv.find((arg) => arg.startsWith('--output='));
  const output = outputArg?.slice('--output='.length)
    || 'src/transport/generated/tashkent-wikiroutes-snapshot.js';
  const local = await localTransportData();
  const snapshot = await crawlWikiRoutes(local);
  const moduleSource = `// Generated by scripts/refresh-tashkent-wikiroutes.js.\nexport default ${jsString(snapshot)};\n`;
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, moduleSource, 'utf8');

  console.log(`[wikiroutes] active routes=${snapshot.routeCount} routeErrors=${snapshot.routeErrorCount}`);
  console.log(`[wikiroutes] by mode=${JSON.stringify(snapshot.routeCountsByMode)}`);
  console.log(`[wikiroutes] declared=${JSON.stringify(snapshot.declaredCountsByMode)}`);
  console.log(
    `[wikiroutes] uniqueStops=${snapshot.stopCount} coordinates=${snapshot.stopCoordinateCount} `
    + `knownStopMatches=${snapshot.knownStopMatchCount}`,
  );
  console.log(
    `[wikiroutes] routeMatches=${snapshot.reconciliation.matchedKnownRouteCount}/${snapshot.reconciliation.knownRouteCount} `
    + `wikiOnly=${snapshot.reconciliation.wikiRouteKeysMissingFromCatalog.length} `
    + `catalogOnly=${snapshot.reconciliation.catalogRouteKeysMissingFromWiki.length}`,
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
