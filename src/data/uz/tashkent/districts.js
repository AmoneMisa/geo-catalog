import { TASHKENT_DISTRICT_BOUNDARIES } from './district-boundaries.js';

const district = (slug, canonicalName, lat, lng) => {
  const boundary = TASHKENT_DISTRICT_BOUNDARIES[slug];
  return {
    id: `uz:tashkent:${slug}`,
    type: 'district',
    country: 'UZ',
    canonicalName,
    parentId: 'uz:tashkent',
    center: { lat, lng },
    source: boundary ? 'osm' : 'manual',
    accuracy: boundary ? 'district' : 'approximate',
    ...(boundary ? {
      boundary: boundary.geometry,
      osm: { type: 'relation', id: boundary.relId },
      sourceUrl: `https://www.openstreetmap.org/relation/${boundary.relId}`,
    } : {
      accuracyM: 4500,
    }),
  };
};

export const TASHKENT_ENTITIES = Object.freeze([
  // Centers are derived from the same OSM administrative relations used by the stored boundaries.
  // Stable catalog names are preserved where OSM transliteration differs.
  district('almazar','Almazar',41.340872,69.216042),
  district('bektemir','Bektemir',41.245250,69.349929),
  district('mirobod','Mirobod',41.277227,69.292649),
  district('mirzo-ulugbek','Mirzo Ulugbek',41.328152,69.319589),
  district('sergeli','Sergeli',41.246460,69.276878),
  district('uchtepa','Uchtepa',41.294002,69.158969),
  district('chilanzar','Chilanzar',41.276039,69.203023),
  district('shaykhantahur','Shaykhantahur',41.329460,69.219731),
  district('yunusabad','Yunusabad',41.334039,69.290622),
  district('yakkasaray','Yakkasaray',41.287289,69.248020),
  district('yangihayot','Yangihayot',41.196482,69.224760),
  district('yashnobod','Yashnobod',41.291279,69.327462),
]);
