import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLexiconGeoEntity } from '../src/lexicon-bridge.js';

const expected = Object.freeze([
  ['mahalla', 'Juwazshı', 1009066255],
  ['mahalla', 'Bereket', 1009066241],
  ['mahalla', 'Qizil qum', 1227135157],
  ['mahalla', 'Gúzar', 1009066204],
  ['mahalla', 'Isbilermenler aymagi', 1009066208],
  ['mahalla', 'Darbent', 1009066243],
  ['mahalla', 'Abat makan', 1227135160],
  ['mahalla', "Jasil bag'", 1227135161],
  ['mahalla', 'Ata makan', 1009066186],
  ['mahalla', 'Jolshilar', 1009066256],
  ['mahalla', 'Qutli qonis', 1009066199],
  ['mahalla', 'Aydin jol', 1009066240],
  ['mahalla', 'Taslaq', 339799160],
  ['mahalla', 'Qum awil', 413793561],
  ['mahalla', 'Qutli makan', 1009066250],
  ['mahalla', "Botanika bag'i", 4571573171],
  ['mahalla', 'Shimbay shayxana', 9662439527],
  ['mahalla', 'Sarbinaz', 460790124],
  ['mahalla', 'Shayirlar awili', 1009066244],
  ['mahalla', 'Tungish qonis', 1009066246],
  ['mahalla', 'Qurilisshi', 1009066192],
  ['mahalla', 'Almazar', 1009066219],
  ['mahalla', 'Ornek', 1009066183],
  ['mahalla', 'Jana zaman', 1009066216],
  ['mahalla', 'Baqshiliq', 1009066187],
  ['mahalla', 'Dosliq', 1009066191],
  ['mahalla', 'Tinishliq', 1009066195],
  ['mahalla', 'Xaliqlar dosligi', 1009066201],
  ['mahalla', 'Boz awil', 6396972245],
  ['mahalla', 'Jas awlad', 1265717271],
  ['mahalla', 'Qos bulaq', 1009066236],
  ['mahalla', 'Aq jagis', 1009066217],
  ['mahalla', 'Shadli awil', 453532276],
  ['mahalla', 'Tele oray', 415541809],
  ['mahalla', 'Altin jagis', 1009066194],
  ['mahalla', 'Kok ozek', 1009066212],
  ['mahalla', 'Qumbiz awil', 1009066232],
  ['mahalla', 'Nawpir', 1009066200],
  ['local_area', 'Qizketken', 339795351],
]);

test('Nukus crawler-backed spatial entities resolve to direct OSM area representatives', () => {
  for (const [type, canonical, osmId] of expected) {
    const resolved = resolveLexiconGeoEntity({ country: 'UZ', city: 'Nukus', type, canonical });
    assert.ok(resolved, canonical);
    assert.equal(resolved.type, type, canonical);
    assert.equal(resolved.source, 'osm', canonical);
    assert.equal(resolved.osm?.id, osmId, canonical);
    assert.ok(Number.isFinite(resolved.center?.lat), canonical);
    assert.ok(Number.isFinite(resolved.center?.lng), canonical);
  }
});
