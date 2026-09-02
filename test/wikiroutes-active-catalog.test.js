import assert from 'node:assert/strict';
import test from 'node:test';
import {
  normalizeRouteRef,
  parseActiveCatalog,
  routeMatchKey,
} from '../scripts/refresh-tashkent-wikiroutes.js';

const block = (number, name, count, links) => `
  <div class="typeBlock" data-number="${number}">
    <div class="typeHeader">
      <span class="typeHeader-name">${name}</span>
      <span class="count">(${count})</span>
    </div>
    <div class="wikiCatalogFilterListItem">${links}</div>
  </div>`;

const route = (id, title, classes = 'city tag-btn tag-btn--float') =>
  `<a class="${classes}" title="${title}" href="/tashkent?routes=${id}">${title}</a>`;

test('active catalog excludes no-active routes instead of importing hidden historical entries', () => {
  const html = block(1, 'Автобусы', 2, [
    route(10600, '1'),
    route(96644, '1м (METROBUS)', 'city tag-btn tag-btn--float no-active hidden'),
    route(10486, '2'),
  ].join(''));
  const parsed = parseActiveCatalog(html);
  assert.deepEqual(parsed.routes.map(({ sourceRouteId, ref, mode, active }) => ({ sourceRouteId, ref, mode, active })), [
    { sourceRouteId: '10600', ref: '1', mode: 'bus', active: true },
    { sourceRouteId: '10486', ref: '2', mode: 'bus', active: true },
  ]);
  assert.equal(parsed.declaredCountsByMode.bus, 2);
  assert.equal(parsed.routeCountsByMode.bus, 2);
});

test('active catalog imports bus, minibus, metro and funicular while ignoring trains', () => {
  const html = [
    block(1, 'Автобусы', 1, route(1, '1')),
    block(2, 'Маршрутки', 1, route(2, '1м')),
    block(4, 'Метро', 1, route(3, 'Чиланзарская линия')),
    block(5, 'Поезда', 1, route(4, '001Х')),
    block(8, 'Фуникулёры', 1, route(5, 'F1')),
  ].join('');
  const parsed = parseActiveCatalog(html);
  assert.deepEqual(parsed.routes.map(({ mode, ref }) => [mode, ref]), [
    ['bus', '1'],
    ['minibus', '1м'],
    ['metro', 'Чиланзарская линия'],
    ['funicular', 'F1'],
  ]);
  assert.equal(parsed.routeCountsByMode.tram, 0);
  assert.equal(parsed.routeCountsByMode.trolleybus, 0);
});

test('inactive tram, trolleybus and funicular routes are never imported', () => {
  const inactive = 'city tag-btn tag-btn--float no-active hidden';
  const html = [
    block(3, 'Троллейбусы', 0, route(31, '1', inactive)),
    block(6, 'Трамваи', 0, route(32, '2', inactive)),
    block(8, 'Фуникулёры', 0, route(33, 'F1', inactive)),
  ].join('');
  assert.deepEqual(parseActiveCatalog(html).routes, []);
});

test('route keys normalize Cyrillic minibus and bus suffixes', () => {
  assert.equal(normalizeRouteRef('8т'), '8T');
  assert.equal(normalizeRouteRef('1м'), '1M');
  assert.equal(normalizeRouteRef('4и'), '4I');
  assert.equal(routeMatchKey('minibus', '1м'), routeMatchKey('minibus', '1m'));
});

test('WikiRoutes Russian metro line names reconcile to local metro route refs', () => {
  assert.equal(routeMatchKey('metro', 'Чиланзарская линия'), routeMatchKey('metro', 'Chilonzor'));
  assert.equal(routeMatchKey('metro', 'Юнусабадская линия'), routeMatchKey('metro', 'Yunusobod'));
  assert.equal(routeMatchKey('metro', 'Узбекистанская линия'), routeMatchKey('metro', "O'zbekiston"));
  assert.equal(
    routeMatchKey('metro', 'Линия тридцатилетия независимости Узбекистана'),
    routeMatchKey('metro', 'Circle'),
  );
});
