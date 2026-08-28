const neighborhood = (slug, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:chernivtsi:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UA',
  canonicalName,
  parentId: 'ua:chernivtsi',
  center: Object.freeze({ lat, lng }),
  source: extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : extra.source ?? 'manual',
  accuracy: 'neighborhood',
  accuracyM,
  ...extra,
});

export const UA_CHERNIVTSI_NEIGHBORHOOD_ENTITIES = Object.freeze([
  neighborhood('kalichanka', 'Kalichanka', 48.298889, 25.970561, 900, { wikidataId: 'Q16700730' }),
  neighborhood('sadhora', 'Sadgora', 48.35, 25.966667, 1700, { wikidataId: 'Q2005381' }),
  neighborhood('rosha', 'Roscha', 48.29315, 25.89105, 1100, { wikidataId: 'Q16714801', osm: Object.freeze({ type: 'node', id: 2377048990 }) }),
  neighborhood('klokuchka', 'Klokuchka', 48.30546, 25.91431, 1100, { source: 'manual', sourceUrl: 'https://mapcarta.com/13756902' }),
  neighborhood('lenkivtsi', 'Lenkivtsi', 48.325841, 25.900117, 1300, { source: 'manual', sourceUrl: 'https://www.geonames.org/advanced-search.html?q=Ukraine%2C+Chernivtsi' }),
  neighborhood('hraviton', 'Hraviton', 48.27592, 25.99461, 1100, { osm: Object.freeze({ type: 'node', id: 10650273334 }) }),
  neighborhood('rosha-stynka', 'Roscha-Stynka', 48.275699, 25.891529, 1200, { source: 'manual', sourceUrl: 'https://bukowina.org.ua/blog/budynok-folkloru-rosha-stynka/' }),
  neighborhood('tsetsyno', 'Tsetsyno', 48.298134, 25.887101, 1500, { source: 'manual', sourceUrl: 'https://maps.visicom.ua/c/25.88708%2C48.29826%2C17/f/STR3KJH06MO0?lang=uk' }),
  neighborhood('tsentr', 'Tsentr', 48.29205, 25.93554, 1200, { source: 'manual', sourceUrl: 'https://dom.ria.com/uk/rate-region-stat/15266/' }),
  neighborhood('prospekt', 'Prospekt', 48.26934, 25.94243, 1400, { source: 'manual', sourceUrl: 'https://dom.ria.com/uk/realty-prodaja-pomescheniya-svobodnogo-naznacheniya-chernovtsy-prospekt-nezavisimosti-prospekt-23355776.html' }),
  neighborhood('komarova', 'Komarova', 48.260307, 25.9309, 1300, { source: 'manual', sourceUrl: 'https://dom.ria.com/uk/realty-dolgosrochnaya-arenda-komnata-chernovtsy-komarova-krasnoarmeyskaya-sergeya-skalda-komarova-vladimira-ulitsa-34248784.html' }),
  neighborhood('pivdenno-kiltseva', 'Pivdenno-Kiltseva', 48.253492, 25.93813, 1700, { source: 'manual', sourceUrl: 'https://gb.city.cv.ua/projects/archive/82/show/22' }),
  neighborhood('fastivska', 'Fastivska', 48.286939, 25.974594, 1200, { source: 'manual', sourceUrl: 'https://dom.ria.com/uk/realty-prodaja-spetsialnoe-pomeschenie-chernovtsy-fastovskaya-russkaya-ulitsa-31859706.html' }),
]);
