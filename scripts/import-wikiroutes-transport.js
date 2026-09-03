import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE_URL = 'https://wikiroutes.info';
const DEFAULT_CONCURRENCY = Number(process.env.WIKIROUTES_CONCURRENCY || 10);
const TIMEOUT_MS = Number(process.env.WIKIROUTES_TIMEOUT_MS || 15_000);
const RETRIES = Number(process.env.WIKIROUTES_RETRIES || 2);
const SHAPE_TOLERANCE_M = Number(process.env.WIKIROUTES_SHAPE_TOLERANCE_M || 8);
const SOURCE_UPDATED_AT = new Date().toISOString().slice(0, 10);
const OUTPUT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/transport/generated/wikiroutes');

const MODE_CODE = Object.freeze({
  bus: 0,
  minibus: 1,
  trolleybus: 2,
  tram: 3,
  metro: 4,
});

const MODE_BY_HEADER = new Map([
  ['buses', 'bus'],
  ['minibuses', 'minibus'],
  ['trolleybuses', 'trolleybus'],
  ['trams', 'tram'],
  ['subways', 'metro'],
  ['subway', 'metro'],
  ['subway (metro)', 'metro'],
  ['metro', 'metro'],
]);

// WikiRoutes' page-scoped /api/wr/route payload offsets coordinates with a
// repeating 8-point mask. These exact offsets were recovered from the browser
// map payload and checked against public stop-page coordinates on 2026-09-03.
const COORDINATE_MASK = Object.freeze([
  Object.freeze({ lat: 5.331, lng: 7.882 }),
  Object.freeze({ lat: 6.812, lng: 7.050 }),
  Object.freeze({ lat: 9.315, lng: 3.840 }),
  Object.freeze({ lat: 0.233, lng: 1.770 }),
  Object.freeze({ lat: 5.187, lng: 0.210 }),
  Object.freeze({ lat: 4.778, lng: 4.410 }),
  Object.freeze({ lat: 4.163, lng: 4.012 }),
  Object.freeze({ lat: 5.886, lng: 1.366 }),
]);

// Only cities that already have canonical city entities in geo-catalog are
// imported here. Tashkent is intentionally omitted because it has dedicated
// official/OSM transport catalogs that are reconciled separately.
const CITIES = Object.freeze([
  { country: 'RO', cityId: 'ro:bucharest', slug: 'bucharest' },

  { country: 'UA', cityId: 'ua:kyiv', slug: 'kiev' },
  { country: 'UA', cityId: 'ua:kharkiv', slug: 'kharkov' },
  { country: 'UA', cityId: 'ua:odesa', slug: 'odessa' },
  { country: 'UA', cityId: 'ua:dnipro', slug: 'dnepropetrovsk' },
  { country: 'UA', cityId: 'ua:lviv', slug: 'lvov' },
  { country: 'UA', cityId: 'ua:zaporizhzhia', slug: 'zaporozhye' },
  { country: 'UA', cityId: 'ua:kryvyi-rih', slug: 'krivoy-rog' },
  { country: 'UA', cityId: 'ua:mykolaiv', slug: 'nikolaev' },
  { country: 'UA', cityId: 'ua:poltava', slug: 'poltava' },
  { country: 'UA', cityId: 'ua:chernihiv', slug: 'chernigov' },
  { country: 'UA', cityId: 'ua:cherkasy', slug: 'cherkassy' },
  { country: 'UA', cityId: 'ua:sumy', slug: 'sumy' },
  { country: 'UA', cityId: 'ua:zhytomyr', slug: 'zhitomir' },
  { country: 'UA', cityId: 'ua:chernivtsi', slug: 'chernovtsy' },
  { country: 'UA', cityId: 'ua:rivne', slug: 'rovno' },
  { country: 'UA', cityId: 'ua:ivano-frankivsk', slug: 'ivano-frankovsk' },
  { country: 'UA', cityId: 'ua:ternopil', slug: 'ternopol' },
  { country: 'UA', cityId: 'ua:lutsk', slug: 'lutsk' },
  { country: 'UA', cityId: 'ua:uzhhorod', slug: 'uzhgorod' },
  { country: 'UA', cityId: 'ua:kropyvnytskyi', slug: 'kirovograd' },
  { country: 'UA', cityId: 'ua:kremenchuk', slug: 'kremenchug' },
  { country: 'UA', cityId: 'ua:uman', slug: 'uman' },

  { country: 'UZ', cityId: 'uz:samarkand', slug: 'samarkand' },
  { country: 'UZ', cityId: 'uz:namangan', slug: 'namangan' },
  { country: 'UZ', cityId: 'uz:andijan', slug: 'andijan' },
  { country: 'UZ', cityId: 'uz:qarshi', slug: 'karshi' },
  { country: 'UZ', cityId: 'uz:nukus', slug: 'nukus' },
  { country: 'UZ', cityId: 'uz:urgench', slug: 'urgench' },
  { country: 'UZ', cityId: 'uz:navoiy', slug: 'navoi' },
  { country: 'UZ', cityId: 'uz:jizzakh', slug: 'jizzakh' },
  { country: 'UZ', cityId: 'uz:kokand', slug: 'kokand' },

  { country: 'KZ', cityId: 'kz:almaty', slug: 'almaty' },
  { country: 'KZ', cityId: 'kz:astana', slug: 'astana' },
  { country: 'KZ', cityId: 'kz:shymkent', slug: 'shymkent' },
  { country: 'KZ', cityId: 'kz:karaganda', slug: 'karaganda' },
  { country: 'KZ', cityId: 'kz:aktobe', slug: 'aktobe' },
  { country: 'KZ', cityId: 'kz:taraz', slug: 'taraz' },
  { country: 'KZ', cityId: 'kz:pavlodar', slug: 'pavlodar' },
  { country: 'KZ', cityId: 'kz:oskemen', slug: 'ust-kamenogorsk' },
  { country: 'KZ', cityId: 'kz:semey', slug: 'semipalatinsk' },
  { country: 'KZ', cityId: 'kz:atyrau', slug: 'atyrau' },
  { country: 'KZ', cityId: 'kz:kostanay', slug: 'kostanay' },
  { country: 'KZ', cityId: 'kz:kyzylorda', slug: 'kyzylorda' },
  { country: 'KZ', cityId: 'kz:aktau', slug: 'aktau' },
  { country: 'KZ', cityId: 'kz:petropavl', slug: 'petropavlovsk' },
  { country: 'KZ', cityId: 'kz:temirtau', slug: 'temirtau' },
  { country: 'KZ', cityId: 'kz:ekibastuz', slug: 'ekibastuz' },
  { country: 'KZ', cityId: 'kz:taldykorgan', slug: 'taldykorgan' },
  { country: 'KZ', cityId: 'kz:kokshetau', slug: 'kokshetau' },

  { country: 'KG', cityId: 'kg:bishkek', slug: 'bishkek' },
  { country: 'KG', cityId: 'kg:osh', slug: 'osh' },
  { country: 'KG', cityId: 'kg:karakol', slug: 'karakol' },
  { country: 'KG', cityId: 'kg:tokmok', slug: 'tokmok' },
]);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const clean = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();
const round6 = (value) => Math.round(Number(value) * 1e6) / 1e6;

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

const stripTags = (value) => clean(decodeHtml(String(value ?? '').replace(/<[^>]*>/g, ' ')));

const htmlAttribute = (attributes, name) => {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = String(attributes).match(new RegExp(`\\b${escaped}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? null;
};

async function mapLimit(items, concurrency, worker) {
  const result = new Array(items.length);
  let next = 0;
  async function run() {
    while (true) {
      const index = next++;
      if (index >= items.length) return;
      result[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run));
  return result;
}

async function fetchRetry(url, options = {}) {
  let lastError;
  for (let attempt = 0; attempt <= RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        signal: controller.signal,
        ...options,
        headers: {
          'user-agent': 'Mozilla/5.0 (compatible; geo-catalog WikiRoutes importer/1.0)',
          accept: 'text/html,application/json;q=0.9,*/*;q=0.8',
          'accept-language': 'en-US,en;q=0.9',
          ...(options.headers ?? {}),
        },
      });
      clearTimeout(timeout);
      if (response.status >= 500 && attempt < RETRIES) {
        await delay(250 * 2 ** attempt);
        continue;
      }
      return response;
    } catch (error) {
      clearTimeout(timeout);
      lastError = error;
      if (attempt < RETRIES) {
        await delay(250 * 2 ** attempt);
        continue;
      }
    }
  }
  throw lastError;
}

function responseCookies(response) {
  const rows = response.headers.getSetCookie?.() ?? [];
  if (rows.length) return rows.map((row) => row.split(';')[0]).join('; ');
  const raw = response.headers.get('set-cookie');
  return raw ? raw.split(/,(?=\s*[^;,=\s]+=[^;,]+)/).map((row) => row.split(';')[0].trim()).join('; ') : '';
}

function parseCatalog(html, city) {
  const starts = [...String(html).matchAll(/<div\b([^>]*)>/gi)].flatMap((match) => {
    const classes = (htmlAttribute(match[1], 'class') ?? '').split(/\s+/).filter(Boolean);
    return classes.includes('typeBlock') ? [{ index: match.index ?? 0 }] : [];
  });
  const routes = [];
  const seen = new Set();
  for (let index = 0; index < starts.length; index += 1) {
    const section = html.slice(starts[index].index, starts[index + 1]?.index ?? html.length);
    const header = stripTags(section.match(/<span\b[^>]*class=["'][^"']*\btypeHeader-name\b[^"']*["'][^>]*>([\s\S]*?)<\/span>/i)?.[1] ?? '');
    const mode = MODE_BY_HEADER.get(header.toLowerCase());
    if (!mode) continue;
    for (const match of section.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
      const href = htmlAttribute(match[1], 'href');
      if (!href) continue;
      const classes = (htmlAttribute(match[1], 'class') ?? '').split(/\s+/).filter(Boolean);
      if (classes.includes('no-active')) continue;
      const url = new URL(decodeHtml(href), BASE_URL);
      const sourceRouteId = url.searchParams.get('routes');
      if (!sourceRouteId || seen.has(sourceRouteId)) continue;
      seen.add(sourceRouteId);
      routes.push({
        ...city,
        mode,
        sourceRouteId,
        ref: stripTags(htmlAttribute(match[1], 'title') ?? match[2]) || sourceRouteId,
        sourceUrl: url.href,
      });
    }
  }
  return routes;
}

function parseWrRouteConfig(html) {
  const block = String(html).match(/window\.WR_ROUTE\s*=\s*\{([\s\S]*?)\n\s*\};/)?.[1];
  if (!block) return null;
  const readString = (key) => block.match(new RegExp(`\\b${key}\\s*:\\s*['"]([^'"]+)['"]`))?.[1] ?? null;
  return { id: readString('id'), tk: readString('tk') };
}

function parseDirections(html) {
  const directions = [];
  for (const article of String(html).matchAll(/<article\b([^>]*)>([\s\S]*?)<\/article>/gi)) {
    const classes = (htmlAttribute(article[1], 'class') ?? '').split(/\s+/).filter(Boolean);
    if (!classes.includes('route-direction')) continue;
    const body = article[2];
    const title = stripTags(body.match(/<h2\b[^>]*class=["'][^"']*\broute-direction__title\b[^"']*["'][^>]*>([\s\S]*?)<\/h2>/i)?.[1] ?? '');
    const stops = [];
    for (const anchor of body.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
      const href = decodeHtml(htmlAttribute(anchor[1], 'href') ?? '');
      const id = href.match(/\/stops\/(\d+)/)?.[1];
      if (!id) continue;
      stops.push({ id, name: stripTags(anchor[2]) || `Stop ${id}` });
    }
    if (stops.length >= 2) directions.push({ title, stops });
  }
  return directions;
}

function normalizePoint(value) {
  if (Array.isArray(value) && value.length >= 2) {
    const lng = Number(value[0]);
    const lat = Number(value[1]);
    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
  }
  if (!value || typeof value !== 'object') return null;
  const lat = Number(value.lat ?? value.latitude ?? value.stopLat ?? value.stop_lat);
  const lng = Number(value.lng ?? value.lon ?? value.long ?? value.longitude ?? value.stopLng ?? value.stopLon ?? value.stop_lng ?? value.stop_lon);
  return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
}

function decodePoints(values) {
  return values.map((value, index) => {
    const point = normalizePoint(value);
    if (!point) throw new Error(`Invalid WikiRoutes coordinate at index ${index}.`);
    const mask = COORDINATE_MASK[index % COORDINATE_MASK.length];
    const decoded = { lat: round6(point.lat - mask.lat), lng: round6(point.lng - mask.lng) };
    if (decoded.lat < -90 || decoded.lat > 90 || decoded.lng < -180 || decoded.lng > 180) {
      throw new Error(`Decoded WikiRoutes coordinate is outside WGS84: ${decoded.lat},${decoded.lng}`);
    }
    return decoded;
  });
}

const radians = (degrees) => degrees * Math.PI / 180;
function distanceM(a, b) {
  const radius = 6_371_000;
  const dLat = radians(b.lat - a.lat);
  const dLng = radians(b.lng - a.lng);
  const lat1 = radians(a.lat);
  const lat2 = radians(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * radius * Math.asin(Math.min(1, Math.sqrt(h)));
}

function simplifyLine(points, toleranceM) {
  if (points.length <= 2 || toleranceM <= 0) return points;
  const meanLat = points.reduce((sum, point) => sum + point.lat, 0) / points.length;
  const scaleX = 111_320 * Math.cos(radians(meanLat));
  const scaleY = 110_540;
  const projected = points.map((point) => ({ x: point.lng * scaleX, y: point.lat * scaleY }));
  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  const toleranceSquared = toleranceM ** 2;
  while (stack.length) {
    const [start, end] = stack.pop();
    const a = projected[start];
    const b = projected[end];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const denominator = dx * dx + dy * dy;
    let maxDistanceSquared = -1;
    let maxIndex = -1;
    for (let index = start + 1; index < end; index += 1) {
      const point = projected[index];
      let distanceSquared;
      if (denominator === 0) {
        distanceSquared = (point.x - a.x) ** 2 + (point.y - a.y) ** 2;
      } else {
        const t = Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / denominator));
        const qx = a.x + t * dx;
        const qy = a.y + t * dy;
        distanceSquared = (point.x - qx) ** 2 + (point.y - qy) ** 2;
      }
      if (distanceSquared > maxDistanceSquared) {
        maxDistanceSquared = distanceSquared;
        maxIndex = index;
      }
    }
    if (maxIndex >= 0 && maxDistanceSquared > toleranceSquared) {
      keep[maxIndex] = 1;
      stack.push([start, maxIndex], [maxIndex, end]);
    }
  }
  return points.filter((_, index) => keep[index]);
}

async function scrapeRoute(route) {
  const pageResponse = await fetchRetry(route.sourceUrl);
  if (!pageResponse.ok) throw new Error(`${route.sourceUrl}: HTTP ${pageResponse.status}`);
  const cookies = responseCookies(pageResponse);
  const html = await pageResponse.text();
  const config = parseWrRouteConfig(html);
  const directions = parseDirections(html);
  if (!config?.id || !config?.tk || !directions.length) return null;
  const apiUrl = `${BASE_URL}/api/wr/route/${config.id}`;
  const apiResponse = await fetchRetry(apiUrl, {
    headers: {
      accept: 'application/json, text/plain, */*',
      'x-wr-t': config.tk,
      'x-requested-with': 'XMLHttpRequest',
      referer: route.sourceUrl,
      ...(cookies ? { cookie: cookies } : {}),
    },
  });
  if (!apiResponse.ok) throw new Error(`${apiUrl}: HTTP ${apiResponse.status}`);
  const data = await apiResponse.json();
  const trips = Array.isArray(data?.trips) ? data.trips : [];
  const variants = [];
  for (let index = 0; index < directions.length; index += 1) {
    const direction = directions[index];
    const trip = trips[index];
    const rawStops = Array.isArray(trip?.line?.stops) ? trip.line.stops : [];
    if (rawStops.length !== direction.stops.length || rawStops.length < 2) continue;
    const stopPoints = decodePoints(rawStops);
    const rawLine = Array.isArray(trip?.line?.coordinates) ? trip.line.coordinates : [];
    const linePoints = rawLine.length >= 2 ? decodePoints(rawLine) : stopPoints;
    if (distanceM(stopPoints[0], linePoints[0]) > 1_000 || distanceM(stopPoints.at(-1), linePoints.at(-1)) > 1_000) {
      throw new Error(`${route.sourceUrl}: decoded route endpoints do not match stops; coordinate mask may have changed.`);
    }
    variants.push({
      title: direction.title,
      stops: direction.stops.map((stop, stopIndex) => ({ ...stop, ...stopPoints[stopIndex] })),
      geometry: simplifyLine(linePoints, SHAPE_TOLERANCE_M),
    });
  }
  return variants.length ? { ...route, variants } : null;
}

function writeVarint(bytes, value) {
  let remaining = value;
  while (remaining >= 0x80) {
    bytes.push((remaining & 0x7f) | 0x80);
    remaining = Math.floor(remaining / 128);
  }
  bytes.push(remaining);
}

const zigzag = (value) => value >= 0 ? value * 2 : (-value * 2) - 1;

function encodeIndexes(indexes) {
  const bytes = [];
  for (const index of indexes) writeVarint(bytes, index);
  return Buffer.from(bytes).toString('base64');
}

function encodeGeometry(points) {
  const bytes = [];
  let previousLng = 0;
  let previousLat = 0;
  points.forEach((point, index) => {
    const lng = Math.round(point.lng * 1e5);
    const lat = Math.round(point.lat * 1e5);
    const deltaLng = index === 0 ? lng : lng - previousLng;
    const deltaLat = index === 0 ? lat : lat - previousLat;
    writeVarint(bytes, zigzag(deltaLng));
    writeVarint(bytes, zigzag(deltaLat));
    previousLng = lng;
    previousLat = lat;
  });
  return Buffer.from(bytes).toString('base64');
}

function buildCityRow(city, routes) {
  const stopMap = new Map();
  for (const route of routes) {
    for (const variant of route.variants) {
      for (const stop of variant.stops) {
        const key = `${route.mode}:${stop.id}`;
        const existing = stopMap.get(key);
        if (existing) {
          if (Math.abs(existing.lat - stop.lat) > 0.000002 || Math.abs(existing.lng - stop.lng) > 0.000002) {
            throw new Error(`${city.cityId}: inconsistent coordinates for WikiRoutes stop ${key}.`);
          }
          existing.names.set(stop.name, (existing.names.get(stop.name) ?? 0) + 1);
          continue;
        }
        stopMap.set(key, { id: stop.id, mode: route.mode, lat: stop.lat, lng: stop.lng, names: new Map([[stop.name, 1]]) });
      }
    }
  }
  const stopRows = [...stopMap.values()]
    .sort((a, b) => a.mode.localeCompare(b.mode) || a.id.localeCompare(b.id, undefined, { numeric: true }))
    .map((stop) => {
      const name = [...stop.names].sort((a, b) => b[1] - a[1])[0][0];
      return [stop.id, MODE_CODE[stop.mode], name, Math.round(stop.lat * 1e6), Math.round(stop.lng * 1e6)];
    });
  const modeByCode = Object.keys(MODE_CODE).sort((a, b) => MODE_CODE[a] - MODE_CODE[b]);
  const stopIndex = new Map(stopRows.map((row, index) => [`${modeByCode[row[1]]}:${row[0]}`, index]));
  const routeRows = routes.map((route) => [
    route.sourceRouteId,
    MODE_CODE[route.mode],
    route.ref,
    route.variants.map((variant) => [
      encodeIndexes(variant.stops.map((stop) => stopIndex.get(`${route.mode}:${stop.id}`))),
      encodeGeometry(variant.geometry),
    ]),
  ]);
  return [city.cityId, city.slug, SOURCE_UPDATED_AT, stopRows, routeRows];
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  console.log(`WikiRoutes import: ${CITIES.length} canonical cities, concurrency=${DEFAULT_CONCURRENCY}`);
  const catalogs = await mapLimit(CITIES, Math.min(DEFAULT_CONCURRENCY, 10), async (city, index) => {
    const url = `${BASE_URL}/en/${city.slug}/catalog`;
    const response = await fetchRetry(url);
    if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
    const routes = parseCatalog(await response.text(), city);
    console.log(`catalog ${index + 1}/${CITIES.length}: ${city.country}/${city.slug} -> ${routes.length}`);
    return { city, routes };
  });
  const tasks = catalogs.flatMap(({ routes }) => routes);
  let completed = 0;
  const scraped = await mapLimit(tasks, DEFAULT_CONCURRENCY, async (route) => {
    const result = await scrapeRoute(route);
    completed += 1;
    if (completed % 100 === 0 || completed === tasks.length) console.log(`routes ${completed}/${tasks.length}`);
    return result;
  });
  const byCity = new Map(CITIES.map((city) => [city.cityId, []]));
  for (const route of scraped.filter(Boolean)) byCity.get(route.cityId)?.push(route);
  const countryRows = new Map(['RO', 'UA', 'UZ', 'KZ', 'KG'].map((country) => [country, []]));
  let routeCount = 0;
  let stopCount = 0;
  let variantCount = 0;
  for (const city of CITIES) {
    const routes = byCity.get(city.cityId) ?? [];
    if (!routes.length) continue;
    const row = buildCityRow(city, routes);
    countryRows.get(city.country).push(row);
    routeCount += row[4].length;
    stopCount += row[3].length;
    variantCount += row[4].reduce((sum, route) => sum + route[3].length, 0);
  }
  if (routeCount < 3_000 || stopCount < 45_000 || variantCount < 6_000) {
    throw new Error(`WikiRoutes import coverage unexpectedly low: routes=${routeCount}, stops=${stopCount}, variants=${variantCount}`);
  }
  const bucharest = countryRows.get('RO')?.find((row) => row[0] === 'ro:bucharest');
  const anchor = bucharest?.[3].find((row) => row[0] === '1487092' && row[1] === MODE_CODE.bus);
  if (!anchor || Math.abs(anchor[3] / 1e6 - 44.4165783) > 0.00002 || Math.abs(anchor[4] / 1e6 - 26.1125815) > 0.00002) {
    throw new Error('WikiRoutes coordinate-mask anchor check failed for Bucharest stop 1487092.');
  }
  for (const [country, rows] of countryRows) {
    const output = `// Generated by scripts/import-wikiroutes-transport.js from WikiRoutes.\nexport default Object.freeze(${JSON.stringify(rows)});\n`;
    await fs.writeFile(path.join(OUTPUT_DIR, `${country.toLowerCase()}.js`), output, 'utf8');
  }
  const summary = {
    generatedAt: new Date().toISOString(),
    source: 'wikiroutes',
    cities: [...countryRows.values()].reduce((sum, rows) => sum + rows.length, 0),
    routes: routeCount,
    stops: stopCount,
    variants: variantCount,
    shapeToleranceM: SHAPE_TOLERANCE_M,
  };
  await fs.writeFile(path.join(OUTPUT_DIR, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
  console.log(summary);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
