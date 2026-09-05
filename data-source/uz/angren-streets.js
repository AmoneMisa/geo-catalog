const manualStreet = (slug, canonicalName, lat, lng, accuracyM = 900) => ({
  id: `uz:angren:street:${slug}`,
  type: 'street',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:angren',
  center: { lat, lng },
  source: 'manual',
  accuracy: 'street',
  accuracyM,
});

export const ANGREN_STREET_ENTITIES = Object.freeze([
  // Yandex exposes Amir Temur as two contiguous street cards (Gulzor and Yangihayot MFY);
  // this is their representative midpoint rather than a claimed boundary/OSM geometry.
  manualStreet('amir-temur', 'Amir Temur Street', 41.010864, 70.058935, 1000),
  manualStreet('bunyodkor', 'Bunyodkor Street', 41.007714, 70.074826, 900),
  manualStreet('ohangaron', 'Ohangaron Street', 41.009918, 70.097087, 1100),
]);
