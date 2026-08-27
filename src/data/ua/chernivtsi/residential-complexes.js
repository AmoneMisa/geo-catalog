const residential = (slug, canonicalName, lat, lng, sourceUrl, accuracyM = 180) => Object.freeze({
  id: `ua:chernivtsi:residential:${slug}`,
  type: 'residential_complex',
  country: 'UA',
  canonicalName,
  parentId: 'ua:chernivtsi',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  accuracy: 'building',
  accuracyM,
  sourceUrl,
});

export const UA_CHERNIVTSI_RESIDENTIAL_COMPLEX_ENTITIES = Object.freeze([
  residential('vodohrai', 'Vodohrai', 48.254233, 25.947482, 'https://novobudovy.com/novobudovy-chernivtsiv/novobudova-zhitlovij-kompleks-m-chernivci-vul-vorobkevicha-31-copy', 260),
  residential('compass', 'Compass', 48.285754, 25.952407, 'https://novobudovy.com/novobudovy-chernivtsiv/compass', 220),
  residential('comfort-hall', 'Comfort Hall', 48.280528, 25.984081, 'https://novobudovy.com/novobudovy-chernivtsiv/komfort-hol-2', 260),
  residential('panorama', 'Panorama', 48.276607, 25.985241, 'https://novobudovy.com/novobudovy-chernivtsiv/panorama-chernivci', 220),
  residential('park-avenue', 'Park Avenue', 48.265065, 25.919969, 'https://novobudovy.com/novobudovy-chernivtsiv/park-avenyu-chernivci', 300),
]);
