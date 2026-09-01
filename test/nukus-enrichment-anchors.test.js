import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLexiconGeoEntity } from '../src/lexicon-bridge.js';

const expected = Object.freeze([
  ['Juwazshı', 1009066255],
  ['Bereket', 1009066241],
  ['Qizil qum', 1227135157],
  ['Gúzar', 1009066204],
  ['Isbilermenler aymagi', 1009066208],
  ['Darbent', 1009066243],
  ['Abat makan', 1227135160],
  ["Jasil bag'", 1227135161],
  ['Ata makan', 1009066186],
  ['Jolshilar', 1009066256],
  ['Qutli qonis', 1009066199],
  ['Aydin jol', 1009066240],
  ['Taslaq', 339799160],
  ['Qum awil', 413793561],
  ['Qutli makan', 1009066250],
  ['Shimbay shayxana', 9662439527],
  ['Sarbinaz', 460790124],
  ['Shayirlar awili', 1009066244],
  ['Tungish qonis', 1009066246],
  ['Qurilisshi', 1009066192],
  ['Almazar', 1009066219],
  ['Ornek', 1009066183],
  ['Jana zaman', 1009066216],
  ['Baqshiliq', 1009066187],
  ['Dosliq', 1009066191],
  ['Tinishliq', 1009066195],
  ['Xaliqlar dosligi', 1009066201],
  ['Boz awil', 6396972245],
  ['Jas awlad', 1265717271],
  ['Qos bulaq', 1009066236],
  ['Aq jagis', 1009066217],
  ['Shadli awil', 453532276],
]);

test('Nukus crawler-backed mahallas resolve to direct OSM area representatives', () => {
  for (const [canonical, osmId] of expected) {
    const resolved = resolveLexiconGeoEntity({ country: 'UZ', city: 'Nukus', type: 'mahalla', canonical });
    assert.ok(resolved, canonical);
    assert.equal(resolved.type, 'mahalla', canonical);
    assert.equal(resolved.source, 'osm', canonical);
    assert.equal(resolved.osm?.id, osmId, canonical);
    assert.ok(Number.isFinite(resolved.center?.lat), canonical);
    assert.ok(Number.isFinite(resolved.center?.lng), canonical);
  }
});
