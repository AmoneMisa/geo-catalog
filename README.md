# @whiteslove/geo-catalog

Structured geographic data for location-aware Whiteslove services.

`@whiteslove/geo-catalog` is the spatial companion to `@whiteslove/parsing-lexicon`. The lexicon recognizes multilingual location text and resolves it to a stable canonical entity ID; this package resolves that ID to geographic metadata such as coordinates, bounds, hierarchy and optional OpenStreetMap references.

The package is deterministic, dependency-free and network-free at runtime. Nominatim, Overpass and other geocoders should remain consumer-side fallbacks for unknown or address-level entities.

## Responsibilities

This package owns:

- stable geographic entity IDs;
- center coordinates;
- bounding boxes and, later, polygons;
- administrative and locality hierarchy via `parentId`;
- cities, districts, microdistricts, mahallas, suburbs and settlements;
- residential complexes, metro stations and POIs;
- optional OSM node/way/relation metadata;
- spatial helpers such as distance, containment and nearest-entity lookup;
- catalog validation and data-quality invariants.

This package intentionally does **not** own multilingual aliases, regexes, parsing heuristics or free-text normalization. Those remain in `@whiteslove/parsing-lexicon`.

## Architecture

```text
raw listing text
  -> @whiteslove/parsing-lexicon
  -> stable entity id (for example: uz:tashkent)
  -> @whiteslove/geo-catalog
  -> center / bbox / hierarchy / OSM metadata
  -> consumer geocoder fallback for unknown exact addresses
```

## Usage

```js
import {
  getGeoEntity,
  findGeoEntities,
  nearestGeoEntity,
  containsPoint,
} from '@whiteslove/geo-catalog';

const tashkent = getGeoEntity('uz:tashkent');
console.log(tashkent.center);

const ukrainianCities = findGeoEntities({ country: 'UA', type: 'city' });

const nearest = nearestGeoEntity(
  { lat: 43.24, lng: 76.89 },
  findGeoEntities({ country: 'KZ', type: 'city' }),
);

if (tashkent.bbox) {
  containsPoint(tashkent.center, tashkent.bbox);
}
```

## Entity model

```ts
interface GeoEntity {
  id: string;
  type: GeoEntityType;
  country: string;
  canonicalName: string;
  parentId?: string;
  center: { lat: number; lng: number };
  bbox?: { south: number; west: number; north: number; east: number };
  osm?: { type: 'node' | 'way' | 'relation'; id: number };
  accuracyM?: number;
  accuracy?: GeoAccuracy;
  source?: 'osm' | 'official' | 'manual';
}
```

IDs are deliberately language-independent. Consumers should join parsed lexical entities to spatial entities by stable ID rather than by display name.

## Data-quality rules

- IDs are unique and stable once published.
- Country codes use ISO 3166-1 alpha-2 uppercase values.
- Centers must be valid WGS84 latitude/longitude coordinates.
- A center must lie inside its bbox when a bbox is supplied.
- `parentId` must resolve to another catalog entity.
- OSM references must identify a valid node, way or relation ID.
- Text aliases and transliterations must not be duplicated here.
- Approximate data must be marked as such instead of pretending to be building-level precision.
- Network geocoding is never performed during package import or lookup.

## Current scope

Version `0.1.x` establishes the schema, API and validation layer and includes an initial city-level seed for Uzbekistan, Kazakhstan and Ukraine. The next data phase is to migrate canonical spatial entities corresponding to the location IDs already maintained by `@whiteslove/parsing-lexicon`, starting with Tashkent housing geography and then the broader UA/UZ/KZ catalogs.

## License

MIT
