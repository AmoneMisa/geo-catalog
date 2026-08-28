import test from 'node:test';
import assert from 'node:assert/strict';
import { findGeoEntities, getGeoEntity } from '../src/index.js';

test('all Ukrainian city entities are OSM-backed', () => {
  const cities = findGeoEntities({ country: 'UA', type: 'city' });
  assert.equal(cities.length, 88);
  assert.ok(cities.every((city) => city.source === 'osm' && city.osm), 'every UA city must have explicit OSM provenance');
});

test('all secondary Ukrainian city centers use verified OSM named-place nodes', () => {
  const expected = new Map([
    ['ua:kamianske', [{ lat: 48.5168, lng: 34.6069 }, 1756064253]],
    ['ua:nikopol', [{ lat: 47.5692, lng: 34.3917 }, 265058407]],
    ['ua:pavlohrad', [{ lat: 48.5317, lng: 35.8704 }, 265059962]],
    ['ua:kamianets-podilskyi', [{ lat: 48.6781, lng: 26.5854 }, 268081010]],
    ['ua:drohobych', [{ lat: 49.3514, lng: 23.5062 }, 313248206]],
    ['ua:stryi', [{ lat: 49.2559, lng: 23.8531 }, 247880583]],
    ['ua:kolomyia', [{ lat: 48.5259, lng: 25.0381 }, 284716726]],
    ['ua:kalush', [{ lat: 49.0289, lng: 24.3613 }, 312270776]],
    ['ua:fastiv', [{ lat: 50.07993, lng: 29.91628 }, 337535126]],
    ['ua:vasylkiv', [{ lat: 50.17814, lng: 30.3175 }, 337527490]],
    ['ua:boyarka', [{ lat: 50.33567, lng: 30.28476 }, 36507632]],
    ['ua:pereiaslav', [{ lat: 50.0644, lng: 31.44473 }, 337535557]],
    ['ua:chuhuiv', [{ lat: 49.83663, lng: 36.68994 }, 264282090]],
    ['ua:lozova', [{ lat: 48.8842, lng: 36.316 }, 337581295]],
    ['ua:izium', [{ lat: 49.19132, lng: 37.27841 }, 337568004]],
    ['ua:kupiansk', [{ lat: 49.7133, lng: 37.6142 }, 337548383]],
    ['ua:merefa', [{ lat: 49.81834, lng: 36.06287 }, 1685829433]],
    ['ua:liubotyn', [{ lat: 49.94356, lng: 35.91852 }, 337539733]],
    ['ua:chornomorsk', [{ lat: 46.3013, lng: 30.6549 }, 337690843]],
    ['ua:bilhorod-dnistrovskyi', [{ lat: 46.191, lng: 30.3458 }, 738536340]],
    ['ua:podilsk', [{ lat: 47.74974, lng: 29.5305 }, 337670266]],
    ['ua:sambir', [{ lat: 49.51822, lng: 23.19704 }, 337556659]],
    ['ua:truskavets', [{ lat: 49.2782, lng: 23.506 }, 254262743]],
    ['ua:boryslav', [{ lat: 49.28244, lng: 23.41388 }, 313246159]],
    ['ua:sheptytskyi', [{ lat: 50.394, lng: 24.2396 }, 260943265]],
    ['ua:kovel', [{ lat: 51.2121, lng: 24.7089 }, 146651245]],
    ['ua:dubno', [{ lat: 50.41879, lng: 25.7456 }, 337522487]],
    ['ua:berdychiv', [{ lat: 49.894, lng: 28.5815 }, 337541446]],
    ['ua:korosten', [{ lat: 50.9491, lng: 28.6418 }, 337513583]],
    ['ua:zviahel', [{ lat: 50.5918, lng: 27.6067 }, 146498192]],
    ['ua:zhmerynka', [{ lat: 49.03546, lng: 28.11473 }, 337574997]],
    ['ua:mohyliv-podilskyi', [{ lat: 48.44254, lng: 27.79911 }, 337598184]],
    ['ua:khmilnyk', [{ lat: 49.55618, lng: 27.94912 }, 1723694093]],
    ['ua:smila', [{ lat: 49.2337, lng: 31.8829 }, 337566618]],
    ['ua:myrhorod', [{ lat: 49.9658, lng: 33.6114 }, 337538836]],
    ['ua:konotop', [{ lat: 51.2398, lng: 33.2067 }, 337510526]],
    ['ua:shostka', [{ lat: 51.8644, lng: 33.4729 }, 337504305]],
    ['ua:hlukhiv', [{ lat: 51.67831, lng: 33.9093 }, 337505758]],
    ['ua:nizhyn', [{ lat: 51.0465, lng: 31.8806 }, 337512379]],
    ['ua:pervomaisk', [{ lat: 48.0457, lng: 30.8476 }, 337661270]],
    ['ua:voznesensk', [{ lat: 47.56796, lng: 31.33386 }, 313670944]],
    ['ua:yuzhnoukrainsk', [{ lat: 47.82427, lng: 31.17868 }, 337668729]],
    ['ua:melitopol', [{ lat: 46.8467, lng: 35.3827 }, 1756064266]],
    ['ua:berdiansk', [{ lat: 46.7557, lng: 36.7888 }, 258057686]],
    ['ua:mariupol', [{ lat: 47.0958, lng: 37.55 }, 29980666]],
    ['ua:kramatorsk', [{ lat: 48.7389, lng: 37.5844 }, 274929523]],
    ['ua:sloviansk', [{ lat: 48.8523, lng: 37.6058 }, 256613986]],
    ['ua:bakhmut', [{ lat: 48.5894, lng: 38.0021 }, 256613679]],
    ['ua:pokrovsk', [{ lat: 48.2771, lng: 37.1772 }, 256613916]],
    ['ua:kostiantynivka', [{ lat: 48.5349, lng: 37.6924 }, 256613898]],
    ['ua:toretsk', [{ lat: 48.39705, lng: 37.85014 }, 256613774]],
    ['ua:avdiivka', [{ lat: 48.13388, lng: 37.74667 }, 1602171866]],
    ['ua:luhansk', [{ lat: 48.5717, lng: 39.2973 }, 253874196]],
    ['ua:sievierodonetsk', [{ lat: 48.9479, lng: 38.4936 }, 337579368]],
    ['ua:lysychansk', [{ lat: 48.9173, lng: 38.4286 }, 337582086]],
    ['ua:alchevsk', [{ lat: 48.4702, lng: 38.801 }, 253877159]],
    ['ua:rubizhne', [{ lat: 49.0329, lng: 38.3726 }, 337576644]],
    ['ua:vynohradiv', [{ lat: 48.14042, lng: 23.03602 }, 337658507]],
  ]);

  assert.equal(expected.size, 58);
  for (const [id, [center, nodeId]] of expected) {
    const city = getGeoEntity(id);
    assert.equal(city?.source, 'osm', id);
    assert.equal(city?.accuracy, 'city', id);
    assert.deepEqual(city?.center, center, id);
    assert.deepEqual(city?.osm, { type: 'node', id: nodeId }, id);
  }
});
