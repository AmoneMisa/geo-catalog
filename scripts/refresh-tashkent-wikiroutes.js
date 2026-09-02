import fs from 'node:fs/promises';
import path from 'node:path';

const CATALOG_URL = 'https://ru.wikiroutes.info/tashkent/catalog';
const BASE_URL = new URL(CATALOG_URL).origin;
const DEFAULT_CONCURRENCY = 6;
const DEFAULT_TIMEOUT_MS = 12_000;
const DEFAULT_OUTPUT = '.cache/wikiroutes/tashkent-active.json';
const SUPPORTED_MODES = Object.freeze(['bus', 'minibus', 'metro', 'trolleybus', 'tram', 'funicular']);

const MODE_LABELS = new Map([
  ['автобусы', 'bus'],
  ['маршрутки', 'minibus'],
  ['метро', 'metro'],
  ['троллейбусы', 'trolleybus'],
  ['трамваи', 'tram'],
  ['фуникулёры', 'funicular'],
  ['фуникулеры', 'funicular'],
  ['фуникулёр', 'funicular'],
  ['фуникулер', 'funicular'],
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
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = String(attributes).match(new RegExp(`\\b${escaped}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? null;
};

const elementRows = (source, tag) => [...String(source).matchAll(new RegExp(`<${tag}\\b([^>]*)>([\\s\\S]*?)<\\/${tag}>`, 'gi'))]
  .map((match) => ({
    index: match.index ?? 0,
    attributes: match[1],
    text: stripTags(match[2]),
    classes: (htmlAttribute(match[1], 'class') ?? '').split(/\s+/).filter(Boolean),
  }));

const emptyModeCounts = () => Object.fromEntries(SUPPORTED_MODES.map((mode) => [mode, 0]));
const routeRefFromLabel = (label) => String(label ?? '').replace(/\s*\([^)]*\)\s*$/, '').trim();

function parseActiveCatalog(html) {
  const source = String(html);
  const starts = [...source.matchAll(/<div\b([^>]*)>/gi)].flatMap((match) => {
    const classes = (htmlAttribute(match[1], 'class') ?? '').split(/\s+/).filter(Boolean);
    return classes.includes('typeBlock') ? [{ index: match.index ?? 0 }] : [];
  });

  const routes = [];
  const seen = new Map();
  const declaredCountsByMode = {};
  const activeLinkCountsByMode = emptyModeCounts();
  const inactiveLinkCountsByMode = emptyModeCounts();
  const duplicateRouteLinks = [];

  for (let i = 0; i < starts.length; i += 1) {
    const section = source.slice(starts[i].index, starts[i + 1]?.index ?? source.length);
    const spans = elementRows(section.slice(0, 2400), 'span');
    const header = spans.find((row) => row.classes.includes('typeHeader-name'))?.text ?? '';
    const mode = MODE_LABELS.get(header.toLocaleLowerCase('ru'));
    if (!mode) continue;

    const countText = spans.find((row) => row.classes.includes('count'))?.text ?? '';
    const countMatch = countText.match(/(\d+)/);
    declaredCountsByMode[mode] = countMatch ? Number(countMatch[1]) : null;

    for (const match of section.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
      const href = htmlAttribute(match[1], 'href');
      if (!href) continue;

      const classes = (htmlAttribute(match[1], 'class') ?? '').split(/\s+/).filter(Boolean);
      const url = new URL(decodeHtml(href), BASE_URL);
      const sourceRouteId = url.searchParams.get('routes');
      if (url.pathname !== '/tashkent' || !sourceRouteId) continue;

      if (classes.includes('no-active')) {
        inactiveLinkCountsByMode[mode] += 1;
        continue;
      }

      activeLinkCountsByMode[mode] += 1;
      const label = stripTags(htmlAttribute(match[1], 'title') ?? match[2]);
      const route = {
        sourceRouteId,
        sourceRouteUrl: url.href,
        mode,
        active: true,
        scope: classes.find((value) => ['city', 'suburban', 'intercity'].includes(value)) ?? null,
        ref: routeRefFromLabel(label),
        label,
      };

      const existing = seen.get(sourceRouteId);
      if (existing) {
        duplicateRouteLinks.push({
          sourceRouteId,
          mode,
          ref: route.ref,
          label: route.label,
          scope: route.scope,
          duplicateOfMode: existing.mode,
          duplicateOfRef: existing.ref,
        });
        continue;
      }

      seen.set(sourceRouteId, route);
      routes.push(route);
    }
  }

  return {
    routes,
    declaredCountsByMode,
    activeLinkCountsByMode,
    inactiveLinkCountsByMode,
    duplicateRouteLinks,
  };
}

const anchorRows = (html) => [...String(html).matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
  .map((match) => ({ href: decodeHtml(match[1]), text: stripTags(match[2]) }));

const stopIdFromUrl = (url) => new URL(url, BASE_URL).pathname.match(/^\/stops\/(\d+)\/?$/)?.[1] ?? null;

function parseRoutePage(html, route) {
  const source = String(html);
  const headings = [...source.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)]
    .map((match) => ({ index: match.index ?? 0, text: stripTags(match[1]) }))
    .filter(({ text }) => text.includes('—') || text.includes('→'));

  const directions = headings.map((heading, index) => {
    const section = source.slice(heading.index, headings[index + 1]?.index ?? source.length);
    const stops = anchorRows(section).flatMap(({ href, text }) => {
      const sourceStopUrl = new URL(href, route.sourceRouteUrl).href;
      const sourceStopId = stopIdFromUrl(sourceStopUrl);
      return sourceStopId ? [{ sourceStopId, sourceStopUrl, name: text }] : [];
    });
    const [from = stops[0]?.name ?? '', to = stops.at(-1)?.name ?? ''] = heading.text
      .split(/\s+[—→]\s+/)
      .map((value) => value.trim());
    return { directionIndex: index, name: heading.text, from, to, stops };
  }).filter((direction) => direction.stops.length >= 2);

  return { ...route, directions };
}

const isValidWgs84 = (lat, lng) => Number.isFinite(lat) && Number.isFinite(lng)
  && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;

function parseStopPage(html, stop) {
  const source = decodeHtml(String(html));
  const candidates = [];

  for (const match of source.matchAll(/[?&]cbll=(-?\d+(?:\.\d+)?)(?:%2C|,)(-?\d+(?:\.\d+)?)/gi)) {
    candidates.push({ lat: Number(match[1]), lng: Number(match[2]), coordinateSource: 'google_street_view' });
  }
  for (const match of source.matchAll(/["'](?:lat|latitude)["']\s*:\s*(-?\d+(?:\.\d+)?)[\s\S]{0,160}?["'](?:lng|lon|longitude)["']\s*:\s*(-?\d+(?:\.\d+)?)/gi)) {
    candidates.push({ lat: Number(match[1]), lng: Number(match[2]), coordinateSource: 'embedded_lat_lng' });
  }
  for (const match of source.matchAll(/["'](?:lng|lon|longitude)["']\s*:\s*(-?\d+(?:\.\d+)?)[\s\S]{0,160}?["'](?:lat|latitude)["']\s*:\s*(-?\d+(?:\.\d+)?)/gi)) {
    candidates.push({ lat: Number(match[2]), lng: Number(match[1]), coordinateSource: 'embedded_lng_lat' });
  }
  for (const match of source.matchAll(/data-lat(?:itude)?\s*=\s*["'](-?\d+(?:\.\d+)?)["'][\s\S]{0,160}?data-l(?:ng|on|ongitude)\s*=\s*["'](-?\d+(?:\.\d+)?)["']/gi)) {
    candidates.push({ lat: Number(match[1]), lng: Number(match[2]), coordinateSource: 'data_attributes' });
  }

  const point = candidates.find(({ lat, lng }) => isValidWgs84(lat, lng));
  return point
    ? { ...stop, ...point, coordinateStatus: 'ok' }
    : { ...stop, lat: null, lng: null, coordinateSource: null, coordinateStatus: 'missing' };
}

async function fetchText(url, timeoutMs) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'geo-catalog manual WikiRoutes checker' },
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

const countBy = (items, keyOf, initial = {}) => {
  const counts = { ...initial };
  for (const item of items) {
    const key = keyOf(item) ?? 'unknown';
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
};

async function main() {
  const output = process.argv.find((arg) => arg.startsWith('--output='))?.slice('--output='.length) || DEFAULT_OUTPUT;
  const concurrencyArg = Number(process.argv.find((arg) => arg.startsWith('--concurrency='))?.split('=')[1] ?? DEFAULT_CONCURRENCY);
  const timeoutArg = Number(process.argv.find((arg) => arg.startsWith('--timeout='))?.split('=')[1] ?? DEFAULT_TIMEOUT_MS);
  const concurrency = Number.isInteger(concurrencyArg) && concurrencyArg > 0 ? concurrencyArg : DEFAULT_CONCURRENCY;
  const timeoutMs = Number.isFinite(timeoutArg) && timeoutArg > 0 ? timeoutArg : DEFAULT_TIMEOUT_MS;

  const catalog = parseActiveCatalog(await fetchText(CATALOG_URL, timeoutMs));
  const routeResults = await mapConcurrent(catalog.routes, concurrency, async (route) => {
    try {
      return parseRoutePage(await fetchText(route.sourceRouteUrl, timeoutMs), route);
    } catch (error) {
      return { ...route, directions: [], crawlError: String(error?.message ?? error) };
    }
  });

  const routes = routeResults.filter((route) => route.directions.length);
  const routeErrors = routeResults.filter((route) => route.crawlError);
  const routeParseMisses = routeResults.filter((route) => !route.crawlError && !route.directions.length);

  const uniqueStops = new Map();
  for (const route of routes) {
    for (const direction of route.directions) {
      for (const stop of direction.stops) {
        if (!uniqueStops.has(stop.sourceStopId)) uniqueStops.set(stop.sourceStopId, stop);
      }
    }
  }

  const stops = await mapConcurrent([...uniqueStops.values()], concurrency, async (stop) => {
    try {
      return parseStopPage(await fetchText(stop.sourceStopUrl, timeoutMs), stop);
    } catch (error) {
      return {
        ...stop,
        lat: null,
        lng: null,
        coordinateSource: null,
        coordinateStatus: 'error',
        error: String(error?.message ?? error),
      };
    }
  });

  const stopById = new Map(stops.map((stop) => [stop.sourceStopId, stop]));
  const hydratedRoutes = routes.map((route) => ({
    ...route,
    directions: route.directions.map((direction) => ({
      ...direction,
      // Do not dedupe this array: repeated physical stops can be meaningful on loops.
      stops: direction.stops.map((stop) => stopById.get(stop.sourceStopId) ?? stop),
    })),
  }));

  const routeCountsByMode = countBy(hydratedRoutes, (route) => route.mode, emptyModeCounts());
  const routeCountsByScope = countBy(hydratedRoutes, (route) => route.scope ?? 'unknown');
  const coordinateCountsBySource = countBy(
    stops.filter((stop) => stop.coordinateStatus === 'ok'),
    (stop) => stop.coordinateSource,
  );
  const missingStops = stops.filter((stop) => stop.coordinateStatus !== 'ok');

  const snapshot = {
    source: 'wikiroutes',
    activeOnly: true,
    catalogUrl: CATALOG_URL,
    fetchedAt: new Date().toISOString(),
    declaredCountsByMode: catalog.declaredCountsByMode,
    activeLinkCountsByMode: catalog.activeLinkCountsByMode,
    inactiveLinkCountsByMode: catalog.inactiveLinkCountsByMode,
    duplicateRouteLinkCount: catalog.duplicateRouteLinks.length,
    duplicateRouteLinks: catalog.duplicateRouteLinks,
    routeCountsByMode,
    routeCountsByScope,
    routeCount: hydratedRoutes.length,
    routeErrorCount: routeErrors.length,
    routeParseMissCount: routeParseMisses.length,
    routeErrors: routeErrors.map(({ sourceRouteId, mode, ref, crawlError }) => ({ sourceRouteId, mode, ref, crawlError })),
    routeParseMisses: routeParseMisses.map(({ sourceRouteId, mode, ref, sourceRouteUrl }) => ({ sourceRouteId, mode, ref, sourceRouteUrl })),
    stopCount: stops.length,
    stopCoordinateCount: stops.filter((stop) => stop.coordinateStatus === 'ok').length,
    stopMissingCoordinateCount: missingStops.length,
    stopErrorCount: stops.filter((stop) => stop.coordinateStatus === 'error').length,
    coordinateCountsBySource,
    stops,
    routes: hydratedRoutes,
  };

  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');

  console.log(JSON.stringify({
    output,
    declaredCountsByMode: snapshot.declaredCountsByMode,
    activeLinkCountsByMode: snapshot.activeLinkCountsByMode,
    inactiveLinkCountsByMode: snapshot.inactiveLinkCountsByMode,
    duplicateRouteLinkCount: snapshot.duplicateRouteLinkCount,
    routeCountsByMode: snapshot.routeCountsByMode,
    routeCountsByScope: snapshot.routeCountsByScope,
    routeCount: snapshot.routeCount,
    routeErrorCount: snapshot.routeErrorCount,
    routeParseMissCount: snapshot.routeParseMissCount,
    stopCount: snapshot.stopCount,
    stopCoordinateCount: snapshot.stopCoordinateCount,
    stopMissingCoordinateCount: snapshot.stopMissingCoordinateCount,
    stopErrorCount: snapshot.stopErrorCount,
    coordinateCountsBySource: snapshot.coordinateCountsBySource,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
