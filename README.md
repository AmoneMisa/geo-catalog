# @whiteslove/geo-catalog

Canonical geo entities and spatial helpers for address and housing parsing.

## Transport catalog

Public transport topology is exposed separately from `GEO_ENTITIES` through:

```js
import {
  TRANSPORT_STOPS,
  TRANSPORT_ROUTES,
  TRANSPORT_TRANSFERS,
  findTransportRoutes,
  findTransportStops,
  getRoutesForStop,
  getStopsForRoute,
  getTransportCoverage,
} from '@whiteslove/geo-catalog/transport';
```

Routes explicitly declare topology coverage:

- `full` — ordered stop sequence is available and may be used for route traversal;
- `terminals_only` — only verified endpoints are known; do not treat `stopIds` as a full route sequence;
- `metadata_only` — the route is present in the registry snapshot, but no spatial stop topology is asserted yet.

`getRoutesForStop(stopId, { requireFullSequence: true })` excludes partial routes from A→B routing consumers.

Tashkent metro stops are derived from the canonical metro geo entities so their centers and provenance cannot drift independently. Bus endpoints reuse canonical geo entities whenever an exact semantic owner exists; standalone endpoints require explicit spatial provenance.

## Geo catalog

The main package exports canonical entities, lookup helpers, distance/containment helpers and validators. Geo entities represent spatial objects with a meaningful center; route topology is intentionally kept in the transport subpath rather than represented as synthetic geo points.

See the package source and TypeScript declarations for the full API.
