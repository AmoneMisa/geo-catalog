import fs from 'node:fs/promises';
import path from 'node:path';

const CATALOG_URL = 'https://ru.wikiroutes.info/tashkent/catalog';
const BASE_URL = new URL(CATALOG_URL).origin;
const DEFAULT_CONCURRENCY = 6;
const DEFAULT_TIMEOUT_MS = 12_000;
const DEFAULT_MATCH_RADIUS_M = 80;
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

const normalizeRouteRef = (value) => stripTags(value)
  .toLocaleUpperCase('ru')
  .replace(/[«»"'`’._\s-]+/g, '')
  .replace(/Т$/u, 'T')
  .replace(/М$/u, 'M')
  .replace(/И$/u, 'I');

const metroRouteKey = (value) => {
  const normalized = normalizeRouteRef(value);
  const aliases = new Map([
    ['ЛИНИЯТРИДЦАТИЛЕТИЯНЕЗАВИСИМОСТИУЗБЕКИСТАНА', 'CIRCLE'],
    ['УЗБЕКИСТАНСКАЯЛИНИЯ', 'OZBEKISTON'],
    ['ЧИЛАНЗАРСКАЯЛИНИЯ', 'CHILONZOR'],
    ['ЮНУСАБАДСКАЯЛИНИЯ', 'YUNUSOBOD'],
  ]);
  return aliases.get(normalized) ?? normalized;
};

const routeMatchKey = (mode, ref) => `${mode}:${mode === 'metro' ? metroRouteKey(ref) : normalizeRouteRef(ref)}`;

const normalizeStopName = (value) => stripTags(value)
  .toLocaleLowerCase('ru')
  .replace(/[«»"'`’.,()№]/g, ' ')
  .replace(/\b(?:остановка|станция|автобусная|метро|ул(?:ица)?|проспект|массив|ст\.?\s*м\.?)\b/gu, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const radians = (degrees) => degrees * Math.PI / 180;
const haversineM = (a, b) => {
  const dLat = radians(b.lat - a.lat);
  const dLng = radians(b.lng - a.lng);
  const lat1 = radians(a.lat);
  const lat2 = radians(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 6_371_000 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

const chooseStopMatch = (wikiStop, knownStops, matchRadiusM) => {
  if (!isValidWgs84(wikiStop.lat, wikiStop.lng)) return null;
  const wikiNames = new Set((wikiStop.names ?? [wikiStop.name]).map(normalizeStopName).filter(Boolean));
  const candidates = knownStops
    .filter((known) => known?.center && isValidWgs84(known.center.lat, known.center.lng))
    .map((known) => ({
      known,
      distanceM: haversineM(wikiStop, known.center),
      normalizedName: normalizeStopName(known.canonicalName),
    }))
    .filter(({ distanceM }) => distanceM <= matchRadiusM)
    .sort((a, b) => a.distanceM - b.distanceM);

  const exactName = candidates.find(({ normalizedName }) => normalizedName && wikiNames.has(normalizedName));
  return exactName ?? (candidates[0]?.distanceM <= 35 ? candidates[0] : null);
};

function reconcileStops(stops, knownStops, matchRadiusM) {
  const knownByMode = new Map();
  for (const stop of knownStops) {
    const rows = knownByMode.get(stop.mode) ?? [];
    rows.push(stop);
    knownByMode.set(stop.mode, rows);
  }

  return stops.map((stop) => {
    const modes = stop.modes?.length ? stop.modes : SUPPORTED_MODES;
    const candidates = [];
    const seen = new Set();
    for (const mode of modes) {
      for (const known of knownByMode.get(mode) ?? []) {
        if (seen.has(known.id)) continue;
        seen.add(known.id);
        candidates.push(known);
      }
    }

    const catalogMatch = chooseStopMatch(stop, candidates, matchRadiusM);
    const osmCandidates = candidates.filter((known) => known.source === 'osm' || known.osm);
    const osmMatch = chooseStopMatch(stop, osmCandidates, matchRadiusM);

    return {
      ...stop,
      catalogStopId: catalogMatch?.known.id ?? null,
      catalogStopMode: catalogMatch?.known.mode ?? null,
      catalogStopName: catalogMatch?.known.canonicalName ?? null,
      catalogStopSource: catalogMatch?.known.source ?? null,
      catalogStopDistanceM: catalogMatch ? Math.round(catalogMatch.distanceM * 10) / 10 : null,
      osmStopId: osmMatch?.known.id ?? null,
      osmStopDistanceM: osmMatch ? Math.round(osmMatch.distanceM * 10) / 10 : null,
      osmRef: osmMatch?.known.osm ?? null,
    };
  });
}

function reconcileRoutes(routes, knownRoutes, knownVariants) {
  const routeByKey = new Map(knownRoutes.map((route) => [routeMatchKey(route.mode, route.ref), route]));
  const variantsByKey = new Map();
  for (const variant of knownVariants) {
    const key = routeMatchKey(variant.mode, variant.ref);
    const variants = variantsByKey.get(key) ?? [];
    variants.push(variant);
    variantsByKey.set(key, variants);
  }

  return routes.map((route) => {
    const key = routeMatchKey(route.mode, route.ref);
    const knownRoute = routeByKey.get(key);
    const variants = variantsByKey.get(key) ?? [];
    return {
      ...route,
      catalogRouteId: knownRoute?.id ?? null,
      catalogCoverage: knownRoute?.coverage ?? null,
      catalogRouteSource: knownRoute?.source ?? null,
      catalogVariantCount: variants.length,
      catalogVariantSources: [...new Set(variants.map((variant) => variant.source).filter(Boolean))],
      catalogOsmRef: knownRoute?.osm ?? null,
    };
  });
}

async function loadTransportCatalog(enabled) {
  if (!enabled) return { enabled: false, loaded: false, stops: [], routes: [], variants: [], error: null };
  try {
    const transport = await import('../src/transport/catalog.js');
    const cityFilter = (row) => row.cityId === 'uz:tashkent';
    return {
      enabled: true,
      loaded: true,
      stops: transport.TRANSPORT_STOPS.filter(cityFilter),
      routes: transport.TRANSPORT_ROUTES.filter(cityFilter),
      variants: transport.TRANSPORT_ROUTE_VARIANTS.filter(cityFilter),
      error: null,
    };
  } catch (error) {
    return {
      enabled: true,
      loaded: false,
      stops: [],
      routes: [],
      variants: [],
      error: String(error?.message ?? error),
    };
  }
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
  const radiusArg = Number(process.argv.find((arg) => arg.startsWith('--match-radius='))?.split('=')[1] ?? DEFAULT_MATCH_RADIUS_M);
  const compareCatalog = !process.argv.includes('--no-compare-catalog');
  const concurrency = Number.isInteger(concurrencyArg) && concurrencyArg > 0 ? concurrencyArg : DEFAULT_CONCURRENCY;
  const timeoutMs = Number.isFinite(timeoutArg) && timeoutArg > 0 ? timeoutArg : DEFAULT_TIMEOUT_MS;
  const matchRadiusM = Number.isFinite(radiusArg) && radiusArg > 0 ? radiusArg : DEFAULT_MATCH_RADIUS_M;

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
        const current = uniqueStops.get(stop.sourceStopId);
        if (current) {
          current.modes.add(route.mode);
          current.names.add(stop.name);
          continue;
        }
        uniqueStops.set(stop.sourceStopId, {
          ...stop,
          modes: new Set([route.mode]),
          names: new Set([stop.name]),
        });
      }
    }
  }

  const stops = await mapConcurrent([...uniqueStops.values()].map((stop) => ({
    ...stop,
    modes: [...stop.modes],
    names: [...stop.names],
  })), concurrency, async (stop) => {
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

  const transportCatalog = await loadTransportCatalog(compareCatalog);
  const reconciledStops = transportCatalog.loaded
    ? reconcileStops(stops, transportCatalog.stops, matchRadiusM)
    : stops.map((stop) => ({
      ...stop,
      catalogStopId: null,
      catalogStopMode: null,
      catalogStopName: null,
      catalogStopSource: null,
      catalogStopDistanceM: null,
      osmStopId: null,
      osmStopDistanceM: null,
      osmRef: null,
    }));

  const stopById = new Map(reconciledStops.map((stop) => [stop.sourceStopId, stop]));
  const hydratedRoutes = routes.map((route) => ({
    ...route,
    directions: route.directions.map((direction) => ({
      ...direction,
      // Do not dedupe this array: repeated physical stops can be meaningful on loops.
      stops: direction.stops.map((stop) => stopById.get(stop.sourceStopId) ?? stop),
    })),
  }));
  const reconciledRoutes = transportCatalog.loaded
    ? reconcileRoutes(hydratedRoutes, transportCatalog.routes, transportCatalog.variants)
    : hydratedRoutes.map((route) => ({
      ...route,
      catalogRouteId: null,
      catalogCoverage: null,
      catalogRouteSource: null,
      catalogVariantCount: 0,
      catalogVariantSources: [],
      catalogOsmRef: null,
    }));

  const routeCountsByMode = countBy(reconciledRoutes, (route) => route.mode, emptyModeCounts());
  const routeCountsByScope = countBy(reconciledRoutes, (route) => route.scope ?? 'unknown');
  const coordinateCountsBySource = countBy(
    reconciledStops.filter((stop) => stop.coordinateStatus === 'ok'),
    (stop) => stop.coordinateSource,
  );
  const missingStops = reconciledStops.filter((stop) => stop.coordinateStatus !== 'ok');
  const routesNotInCatalog = transportCatalog.loaded
    ? reconciledRoutes.filter((route) => !route.catalogRouteId)
    : [];
  const stopsNotInCatalog = transportCatalog.loaded
    ? reconciledStops.filter((stop) => !stop.catalogStopId)
    : [];
  const stopsWithoutOsmMatch = transportCatalog.loaded
    ? reconciledStops.filter((stop) => !stop.osmStopId)
    : [];

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
    routeCount: reconciledRoutes.length,
    routeErrorCount: routeErrors.length,
    routeParseMissCount: routeParseMisses.length,
    routeErrors: routeErrors.map(({ sourceRouteId, mode, ref, crawlError }) => ({ sourceRouteId, mode, ref, crawlError })),
    routeParseMisses: routeParseMisses.map(({ sourceRouteId, mode, ref, sourceRouteUrl }) => ({ sourceRouteId, mode, ref, sourceRouteUrl })),
    stopCount: reconciledStops.length,
    stopCoordinateCount: reconciledStops.filter((stop) => stop.coordinateStatus === 'ok').length,
    stopMissingCoordinateCount: missingStops.length,
    stopErrorCount: reconciledStops.filter((stop) => stop.coordinateStatus === 'error').length,
    coordinateCountsBySource,
    catalogComparison: {
      enabled: transportCatalog.enabled,
      loaded: transportCatalog.loaded,
      error: transportCatalog.error,
      matchRadiusM,
      knownRouteCount: transportCatalog.routes.length,
      knownVariantCount: transportCatalog.variants.length,
      knownStopCount: transportCatalog.stops.length,
      matchedRouteCount: reconciledRoutes.filter((route) => route.catalogRouteId).length,
      routesNotInCatalogCount: routesNotInCatalog.length,
      routesNotInCatalogByMode: countBy(routesNotInCatalog, (route) => route.mode, emptyModeCounts()),
      routesNotInCatalogByScope: countBy(routesNotInCatalog, (route) => route.scope ?? 'unknown'),
      matchedStopCount: reconciledStops.filter((stop) => stop.catalogStopId).length,
      stopsNotInCatalogCount: stopsNotInCatalog.length,
      osmMatchedStopCount: reconciledStops.filter((stop) => stop.osmStopId).length,
      stopsWithoutOsmMatchCount: stopsWithoutOsmMatch.length,
    },
    routesNotInCatalog: routesNotInCatalog.map(({ sourceRouteId, sourceRouteUrl, mode, scope, ref, label }) => ({
      sourceRouteId,
      sourceRouteUrl,
      mode,
      scope,
      ref,
      label,
    })),
    stopsNotInCatalog: stopsNotInCatalog.map(({ sourceStopId, sourceStopUrl, name, names, modes, lat, lng, coordinateSource }) => ({
      sourceStopId,
      sourceStopUrl,
      name,
      names,
      modes,
      lat,
      lng,
      coordinateSource,
    })),
    stops: reconciledStops,
    routes: reconciledRoutes,
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
    catalogComparison: snapshot.catalogComparison,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
