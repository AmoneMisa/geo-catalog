import assert from 'node:assert/strict';
import test from 'node:test';
import {
  normalizeRouteRef,
  parseCatalogRoutes,
  parseRoutePage,
  parseStopPage,
  reconcileRoutes,
  reconcileStopsWithOsm,
} from '../scripts/refresh-tashkent-bus-wikiroutes.js';

test('catalog parser takes every bus route link and ignores later route sections', () => {
  const html = `
    <h2>Автобусы (2)</h2>
    <a href="/tashkent?routes=10600">1</a>
    <a href="/tashkent?routes=10601">101 (Ташкент - Дархан)</a>
    <h2>Маршрутки (1)</h2>
    <a href="/tashkent?routes=20000">1м</a>`;
  assert.deepEqual(parseCatalogRoutes(html).map(({ sourceRouteId, ref }) => [sourceRouteId, ref]), [
    ['10600', '1'],
    ['10601', '101'],
  ]);
});

test('route parser decodes WikiRoutes direction entities and preserves repeated stop ids', () => {
  const route = { sourceRouteUrl: 'https://ru.wikiroutes.info/tashkent?routes=10600', ref: '1' };
  const html = `
    <h2 class="route-direction__title">A &mdash; B</h2>
    <h3><a href="/stops/10">A</a></h3>
    <h3><a href="/stops/11">Middle</a></h3>
    <h3><a href="/stops/10">A again</a></h3>
    <h3><a href="/stops/12">B</a></h3>
    <h2 class="route-direction__title">B &ndash; A</h2>
    <h3><a href="/stops/12">B</a></h3>
    <h3><a href="/stops/13">Other</a></h3>
    <h3><a href="/stops/10">A</a></h3>`;
  const parsed = parseRoutePage(html, route);
  assert.deepEqual(parsed.directions.map((direction) => direction.name), ['A — B', 'B — A']);
  assert.deepEqual(parsed.directions.map((direction) => direction.stops.map((stop) => stop.sourceStopId)), [
    ['10', '11', '10', '12'],
    ['12', '13', '10'],
  ]);
});

test('stop parser reads live WikiRoutes Google Street View cbll coordinates', () => {
  const stop = { sourceStopId: '268007', name: 'Рынок "Юнусабад"' };
  const html = `
    <a href="https://www.google.com/maps?cbll=41.3649826%2C69.2873309&amp;cbp=0%2C-45%2C%2C%2C&amp;layer=c">
      Посмотреть
    </a>`;
  assert.deepEqual(parseStopPage(html, stop), {
    ...stop,
    lat: 41.3649826,
    lng: 69.2873309,
    coordinateStatus: 'ok',
    coordinateSource: 'google_street_view',
  });
});

test('stop parser keeps embedded coordinates as fallback and rejects unrelated coordinates', () => {
  const stop = { sourceStopId: '10', name: 'A' };
  assert.deepEqual(parseStopPage('<script>{"lat":41.311,"lng":69.279}</script>', stop), {
    ...stop,
    lat: 41.311,
    lng: 69.279,
    coordinateStatus: 'ok',
    coordinateSource: 'embedded_lat_lng',
  });
  assert.deepEqual(parseStopPage('<script>{"lat":55.75,"lng":37.61}</script>', stop), {
    ...stop,
    lat: null,
    lng: null,
    coordinateStatus: 'missing',
    coordinateSource: null,
  });
});

test('stop reconciliation prefers same-name nearby OSM stop and does not force ambiguous distant matches', () => {
  const wiki = [
    { sourceStopId: '10', name: 'ЦУМ "Ташкент"', lat: 41.31, lng: 69.27 },
    { sourceStopId: '11', name: 'Unknown', lat: 41.32, lng: 69.28 },
  ];
  const osm = [
    { id: 'osm:1', canonicalName: 'ЦУМ Ташкент', center: { lat: 41.3102, lng: 69.2701 } },
    { id: 'osm:2', canonicalName: 'Other', center: { lat: 41.3207, lng: 69.28 } },
  ];
  const result = reconcileStopsWithOsm(wiki, osm);
  assert.equal(result[0].osmMatchId, 'osm:1');
  assert.equal(result[1].osmMatchId, null);
});

test('route reconciliation normalizes WikiRoutes Cyrillic т refs and attaches existing variants', () => {
  assert.equal(normalizeRouteRef('8т'), '8T');
  const routes = [{ ref: '8т', directions: [] }, { ref: '204', directions: [] }];
  const knownRoutes = [{ id: 'route:8t', ref: '8T', coverage: 'full' }];
  const knownVariants = [
    { id: 'variant:8t:osm', ref: '8T', source: 'osm' },
    { id: 'variant:8t:official', ref: '8T', source: 'official' },
  ];
  const reconciled = reconcileRoutes(routes, knownRoutes, knownVariants);
  assert.deepEqual(reconciled[0], {
    ref: '8т',
    directions: [],
    catalogRouteId: 'route:8t',
    catalogCoverage: 'full',
    knownVariantIds: ['variant:8t:osm', 'variant:8t:official'],
    knownVariantSources: ['osm', 'official'],
  });
  assert.equal(reconciled[1].catalogRouteId, null);
});
