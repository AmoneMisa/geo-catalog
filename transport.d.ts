export type TransportMode = 'metro' | 'bus' | 'tram' | 'trolleybus' | 'minibus' | 'rail' | 'walk';
export type TransportSource = 'osm' | 'wikidata' | 'official' | 'manual' | 'geonames' | string;
export type TransportAccuracy = 'country' | 'region' | 'city' | 'district' | 'neighborhood' | 'street' | 'building' | 'poi' | 'entrance' | 'approximate';
export type TransportRouteCoverage = 'full' | 'terminals_only' | 'metadata_only';

export interface TransportPoint { lat: number; lng: number }
export interface TransportBounds { west: number; south: number; east: number; north: number }
export interface TransportOsmRef { type: 'node' | 'way' | 'relation'; id: number }
export interface TransportMultiLineGeometry {
  type: 'MultiLineString';
  coordinates: readonly (readonly (readonly [number, number])[])[];
}
export interface TransportPointGeometry {
  type: 'Point';
  coordinates: readonly [number, number];
}

export interface TransportStop {
  id: string;
  type: 'stop';
  mode: Exclude<TransportMode, 'walk'>;
  country: string;
  cityId: string;
  canonicalName: string;
  center: TransportPoint;
  geoEntityId?: string;
  source?: TransportSource;
  sourceUpdatedAt?: string;
  accuracy?: TransportAccuracy;
  accuracyM?: number;
  osm?: TransportOsmRef;
  wikidataId?: string;
}

export interface TransportRouteVariant {
  id: string;
  type: 'route_variant';
  mode: Exclude<TransportMode, 'walk'>;
  country: string;
  cityId: string;
  canonicalName: string;
  ref?: string;
  variantIndex?: number;
  from?: string;
  to?: string;
  operator?: string;
  network?: string;
  source?: TransportSource;
  sourceUpdatedAt?: string;
  osm?: TransportOsmRef;
  geometry?: TransportMultiLineGeometry;
  bounds?: TransportBounds;
  geometrySource?: TransportSource;
  geometryUpdatedAt?: string;
  stopIds: readonly string[];
}

export interface TransportRoute {
  id: string;
  type: 'route';
  mode: Exclude<TransportMode, 'walk'>;
  country: string;
  cityId: string;
  canonicalName: string;
  ref?: string;
  source?: TransportSource;
  sourceUrl?: string;
  sourceUpdatedAt?: string;
  topologySource?: TransportSource;
  topologyUpdatedAt?: string;
  validFrom?: string;
  validTo?: string;
  coverage: TransportRouteCoverage;
  terminalNames?: readonly string[];
  geometry?: TransportMultiLineGeometry;
  bounds?: TransportBounds;
  geometrySource?: TransportSource;
  geometryUpdatedAt?: string;
  osm?: TransportOsmRef;
  stopIds: readonly string[];
  variants?: readonly Readonly<TransportRouteVariant>[];
}

export interface TransportTransfer {
  id: string;
  type: 'transfer';
  mode: 'walk';
  country: string;
  cityId: string;
  source?: TransportSource;
  stopIds: readonly [string, string];
}

export interface TransportFilters {
  country?: string;
  cityId?: string;
  mode?: TransportMode;
  bounds?: TransportBounds;
}

export interface TransportRouteFilters extends TransportFilters {
  ref?: string;
  coverage?: TransportRouteCoverage;
}

export interface TransportRouteVariantFilters extends TransportFilters {
  ref?: string;
  hasGeometry?: boolean;
}

export interface TransportCoverageSummary {
  total: number;
  full: number;
  terminalsOnly: number;
  metadataOnly: number;
}

export interface NearestTransportStopResult {
  stop: Readonly<TransportStop>;
  distanceM: number;
  routeRefs: readonly string[];
}

export interface NearestTransportStopOptions extends Omit<TransportFilters, 'bounds'> {
  maxDistanceM?: number;
  limit?: number;
  includeRoutes?: boolean;
}

export interface TransportRouteGeoJSONProperties {
  id: string;
  routeId: string;
  mode: Exclude<TransportMode, 'walk'>;
  ref: string | null;
  canonicalName: string;
  variantIndex: number | null;
  from: string | null;
  to: string | null;
  osmRelationId: number | null;
}

export interface TransportStopGeoJSONProperties {
  id: string;
  canonicalName: string;
  mode: Exclude<TransportMode, 'walk'>;
  geoEntityId: string | null;
  osmType: TransportOsmRef['type'] | null;
  osmId: number | null;
}

export interface TransportGeoJSONFeature<G, P> {
  type: 'Feature';
  id: string;
  geometry: G;
  properties: P;
}

export interface TransportGeoJSONFeatureCollection<F> {
  type: 'FeatureCollection';
  features: readonly F[];
}

export type TransportRouteGeoJSON = TransportGeoJSONFeatureCollection<
  TransportGeoJSONFeature<TransportMultiLineGeometry, TransportRouteGeoJSONProperties>
>;
export type TransportStopsGeoJSON = TransportGeoJSONFeatureCollection<
  TransportGeoJSONFeature<TransportPointGeometry, TransportStopGeoJSONProperties>
>;

export const TRANSPORT_STOPS: readonly Readonly<TransportStop>[];
export const TRANSPORT_ROUTES: readonly Readonly<TransportRoute>[];
export const TRANSPORT_ROUTE_VARIANTS: readonly Readonly<TransportRouteVariant>[];
export const TRANSPORT_TRANSFERS: readonly Readonly<TransportTransfer>[];

export function transportDistanceM(a: TransportPoint, b: TransportPoint): number;
export function getTransportStop(id: string): Readonly<TransportStop> | null;
export function getTransportRoute(id: string): Readonly<TransportRoute> | null;
export function getTransportRouteVariant(id: string): Readonly<TransportRouteVariant> | null;
export function findTransportStops(filters?: TransportFilters): readonly Readonly<TransportStop>[];
export function findTransportRoutes(filters?: TransportRouteFilters): readonly Readonly<TransportRoute>[];
export function findTransportRouteVariants(filters?: TransportRouteVariantFilters): readonly Readonly<TransportRouteVariant>[];
export function getRoutesForStop(stopId: string, options?: { requireFullSequence?: boolean }): readonly Readonly<TransportRoute>[];
export function nearestTransportStops(point: TransportPoint, options?: NearestTransportStopOptions): readonly Readonly<NearestTransportStopResult>[];
export function getStopsForRoute(routeId: string): readonly Readonly<TransportStop>[];
export function getRouteVariants(routeId: string): readonly Readonly<TransportRouteVariant>[];
export function getStopsForRouteVariant(routeId: string, variantId: string | number): readonly Readonly<TransportStop>[];
export function getTransfersForStop(stopId: string): readonly Readonly<TransportTransfer>[];
export function getTransportCoverage(filters?: TransportRouteFilters): Readonly<TransportCoverageSummary>;
export function getTransportRouteGeoJSON(routeId: string, options?: { bounds?: TransportBounds }): Readonly<TransportRouteGeoJSON>;
export function getTransportRoutesGeoJSON(filters?: TransportRouteFilters): Readonly<TransportRouteGeoJSON>;
export function getTransportStopsGeoJSON(filters?: TransportFilters): Readonly<TransportStopsGeoJSON>;
export function validateTransportCatalog(input?: {
  stops?: readonly TransportStop[];
  routes?: readonly TransportRoute[];
  transfers?: readonly TransportTransfer[];
}): { valid: boolean; errors: string[] };
