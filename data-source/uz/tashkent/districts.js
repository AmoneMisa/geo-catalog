import { TASHKENT_DISTRICT_BOUNDARIES } from './district-boundaries.js';

const district = (slug, canonicalName, lat, lng, accuracyM = 4500) => {
  const boundary = TASHKENT_DISTRICT_BOUNDARIES[slug];
  return {
    id: `uz:tashkent:${slug}`,
    type: 'district',
    country: 'UZ',
    canonicalName,
    parentId: 'uz:tashkent',
    center: { lat, lng },
    source: 'osm',
    accuracy: 'district',
    accuracyM,
    ...(boundary ? {
      boundary: boundary.geometry,
      osm: { type: 'relation', id: boundary.relId },
    } : {}),
  };
};

export const TASHKENT_ENTITIES = Object.freeze([
  // Representative centers are area centroids derived from each stored OSM boundary.
  district('almazar','Almazar',41.357716,69.223139),
  district('bektemir','Bektemir',41.224394,69.334250),
  district('mirobod','Mirobod',41.276883,69.292956),
  district('mirzo-ulugbek','Mirzo Ulugbek',41.344635,69.361239),
  district('sergeli','Sergeli',41.236180,69.256710),
  district('uchtepa','Uchtepa',41.295762,69.166476),
  district('chilanzar','Chilanzar',41.270121,69.200434),
  district('shaykhantahur','Shaykhantahur',41.325019,69.216329),
  district('yunusabad','Yunusabad',41.360602,69.285550),
  district('yakkasaray','Yakkasaray',41.280992,69.247897),
  district('yangihayot','Yangihayot',41.192804,69.235217),
  district('yashnobod','Yashnobod',41.300488,69.372703),
]);
