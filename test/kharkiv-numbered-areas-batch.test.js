import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoEntity, resolveLexiconGeoEntity } from '../src/index.js';

const expected = new Map([
  ['521 microdistrict', ['ua:kharkiv:microdistrict:521-microdistrict', { lat: 50.018611, lng: 36.338611 }]],
  ['522 microdistrict', ['ua:kharkiv:microdistrict:522-microdistrict', { lat: 50.022417, lng: 36.3269 }]],
  ['531 microdistrict', ['ua:kharkiv:microdistrict:531-microdistrict', { lat: 50.02402, lng: 36.358125 }]],
  ['533 microdistrict', ['ua:kharkiv:microdistrict:533-microdistrict', { lat: 50.020768, lng: 36.369651 }]],
  ['535A', ['ua:kharkiv:microdistrict:535a', { lat: 50.006539, lng: 36.350041 }]],
  ['601 microdistrict', ['ua:kharkiv:microdistrict:601-microdistrict', { lat: 49.993708, lng: 36.355008 }]],
  ['602 microdistrict', ['ua:kharkiv:microdistrict:602-microdistrict', { lat: 49.995156, lng: 36.360102 }]],
  ['603 microdistrict', ['ua:kharkiv:microdistrict:603-microdistrict', { lat: 49.9998, lng: 36.346295 }]],
  ['604 microdistrict', ['ua:kharkiv:microdistrict:604-microdistrict', { lat: 49.992747, lng: 36.345315 }]],
  ['605 microdistrict', ['ua:kharkiv:microdistrict:605-microdistrict', { lat: 50.003992, lng: 36.337249 }]],
  ['606A', ['ua:kharkiv:microdistrict:606a', { lat: 50.013434, lng: 36.364499 }]],
  ['607 microdistrict', ['ua:kharkiv:microdistrict:607-microdistrict', { lat: 50.016404, lng: 36.350418 }]],
  ['608 microdistrict', ['ua:kharkiv:microdistrict:608-microdistrict', { lat: 50.0148, lng: 36.3375 }]],
  ['615 microdistrict', ['ua:kharkiv:microdistrict:615-microdistrict', { lat: 50.00373, lng: 36.332136 }]],
  ['616 microdistrict', ['ua:kharkiv:microdistrict:616-microdistrict', { lat: 50.000049, lng: 36.327987 }]],
  ['624 microdistrict', ['ua:kharkiv:microdistrict:624-microdistrict', { lat: 49.984227, lng: 36.349499 }]],
  ['625 microdistrict', ['ua:kharkiv:microdistrict:625-microdistrict', { lat: 49.986944, lng: 36.355 }]],
  ['626 microdistrict', ['ua:kharkiv:microdistrict:626-microdistrict', { lat: 49.9825, lng: 36.360833 }]],
  ['627 microdistrict', ['ua:kharkiv:microdistrict:627-microdistrict', { lat: 49.98232, lng: 36.3501 }]],
  ['656 microdistrict', ['ua:kharkiv:microdistrict:656-microdistrict', { lat: 49.995908, lng: 36.323145 }]],
]);

test('Kharkiv numbered areas resolve to explicit manual spatial anchors', () => {
  for (const [canonical, [id, center]] of expected) {
    const entity = resolveLexiconGeoEntity({ country: 'UA', city: 'Kharkiv', type: 'microdistrict', canonical });
    assert.equal(entity?.id, id);
    assert.equal(entity?.source, 'manual');
    assert.ok(/^https:\/\//.test(entity?.sourceUrl ?? ''));
    assert.deepEqual(entity?.center, center);
  }
});

test('manual numbered anchors retain their source families', () => {
  assert.match(getGeoEntity('ua:kharkiv:microdistrict:521-microdistrict')?.sourceUrl ?? '', /wikimapia\.org/);
  assert.equal(getGeoEntity('ua:kharkiv:microdistrict:535a')?.sourceUrl, 'https://yandex.com/maps/147/kharkiv/geo/535_y_mikroraion/1508584520/');
  assert.match(getGeoEntity('ua:kharkiv:microdistrict:616-microdistrict')?.sourceUrl ?? '', /yandex\.com\/maps/);
  assert.equal(getGeoEntity('ua:kharkiv:microdistrict:625-microdistrict')?.sourceUrl, 'https://wikimapia.org/12748817/ru/');
  assert.equal(getGeoEntity('ua:kharkiv:microdistrict:626-microdistrict')?.sourceUrl, 'https://wikimapia.org/7387022/ru/');
  assert.match(getGeoEntity('ua:kharkiv:microdistrict:627-microdistrict')?.sourceUrl ?? '', /streetmaps\.ru/);
  assert.match(getGeoEntity('ua:kharkiv:microdistrict:601-microdistrict')?.sourceUrl ?? '', /locator\.in\.ua/);
  assert.match(getGeoEntity('ua:kharkiv:microdistrict:615-microdistrict')?.sourceUrl ?? '', /urbanplaces\.su/);
  assert.match(getGeoEntity('ua:kharkiv:microdistrict:656-microdistrict')?.sourceUrl ?? '', /locator\.in\.ua/);
  assert.match(getGeoEntity('ua:kharkiv:microdistrict:606a')?.sourceUrl ?? '', /urbanplaces\.su/);
  assert.match(getGeoEntity('ua:kharkiv:microdistrict:624-microdistrict')?.sourceUrl ?? '', /urbanplaces\.su/);
});

test('representative member and infrastructure anchors keep deliberately wide accuracy', () => {
  for (const id of [
    'ua:kharkiv:microdistrict:601-microdistrict',
    'ua:kharkiv:microdistrict:606a',
    'ua:kharkiv:microdistrict:615-microdistrict',
    'ua:kharkiv:microdistrict:624-microdistrict',
    'ua:kharkiv:microdistrict:656-microdistrict',
  ]) {
    assert.equal(getGeoEntity(id)?.accuracyM, 900);
  }
  assert.equal(getGeoEntity('ua:kharkiv:microdistrict:627-microdistrict')?.accuracyM, 1000);
});

test('direct 535 locality and approximate 608 anchors keep honest accuracy', () => {
  assert.equal(getGeoEntity('ua:kharkiv:microdistrict:535a')?.accuracyM, 650);
  assert.equal(getGeoEntity('ua:kharkiv:microdistrict:608-microdistrict')?.accuracyM, 900);
});

test('535 normalization does not create a second physical geo owner', () => {
  assert.equal(getGeoEntity('ua:kharkiv:microdistrict:535-microdistrict'), null);
});
