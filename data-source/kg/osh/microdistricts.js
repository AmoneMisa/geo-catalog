const osmMicrodistrict = (slug, canonicalName, lat, lng, osmWayId) => Object.freeze({
  id: `kg:osh:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'KG',
  canonicalName,
  parentId: 'kg:osh',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/way/${osmWayId}`,
  accuracy: 'neighborhood',
  accuracyM: 500,
  osm: Object.freeze({ type: 'way', id: osmWayId }),
});

const mappedMicrodistrict = (slug, canonicalName, lat, lng, sourceUrl) => Object.freeze({
  id: `kg:osh:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'KG',
  canonicalName,
  parentId: 'kg:osh',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: 'neighborhood',
  accuracyM: 500,
});

export const KG_OSH_MICRODISTRICT_ENTITIES = Object.freeze([
  osmMicrodistrict('anar', 'Anar', 40.5188631, 72.7664824, 452175726),
  osmMicrodistrict('tuleyken', 'Tuleyken', 40.5220382, 72.7657521, 452175725),
  osmMicrodistrict('kulatov', 'Кулатов', 40.5177032, 72.7605313, 452186589),
  mappedMicrodistrict('deu-21', 'ДЭУ-21', 40.479488, 72.755455, 'https://2gis.kg/osh/geo/70030077148492466'),
  mappedMicrodistrict('mzhk-2', 'МЖК-2', 40.516047, 72.776593, 'https://2gis.kg/osh/geo/70030077148486886'),
  mappedMicrodistrict('oshskiy', 'Ошский', 40.549866, 72.796728, 'https://2gis.kg/osh/geo/70030076149767632'),
]);
