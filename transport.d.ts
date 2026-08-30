export type TransportMode = 'metro' | 'bus' | 'tram' | 'trolleybus' | 'minibus' | 'rail' | 'walk';
export type TransportSource = 'osm' | 'wikidata' | 'official' | 'manual' | 'geonames' | string;
export type TransportAccuracy = 'country' | 'region' | 'city' | 'district' | 'neighborhood' | 'street' | 'building' | 'poi' | 'entrance' | 'approximate';
export type TransportRouteCoverage = 'full' | 'terminals_only' | 'metadata_only';

export interface TransportPoint { lat: number; lng: number }
export interface TransportOsmRef { type: 'node' | 'way' | 'relation'; id: number }

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
  accuracy?: TransportAccuracy;
  accuracyM?: number;
  osm?: TransportOsmRef;
  wikidataId?: string;
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
  validFrom?: string;
  validTo?: string;
  coverage: TransportRouteCoverage;
  terminalNames?: readonly string[];
  stopIds: readonly string[];
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
}

export interface TransportRouteFilters extends TransportFilters {
  ref?: string;
  coverage?: TransportRouteCoverage;
}

export interface TransportCoverageSummary {
  total: number;
  full: number;
  terminalsOnly: number;
  metadataOnly: number;
}

export const TRANSPORT_STOPS: readonly Readonly<TransportStop>[];
export const TRANSPORT_ROUTES: readonly Readonly<TransportRoute>[];
export const TRANSPORT_TRANSFERS: readonly Readonly<TransportTransfer>[];

export function getTransportStop(id: string): Readonly<TransportStop> | null;
export function getTransportRoute(id: string): Readonly<TransportRoute> | null;
export function findTransportStops(filters?: TransportFilters): readonly Readonly<TransportStop>[];
export function findTransportRoutes(filters?: TransportRouteFilters): readonly Readonly<TransportRoute>[];
export function getRoutesForStop(stopId: string, options?: { requireFullSequence?: boolean }): readonly Readonly<TransportRoute>[];
export function getStopsForRoute(routeId: string): readonly Readonly<TransportStop>[];
export function getTransfersForStop(stopId: string): readonly Readonly<TransportTransfer>[];
export function getTransportCoverage(filters?: TransportRouteFilters): Readonly<TransportCoverageSummary>;
export function validateTransportCatalog(input?: {
  stops?: readonly TransportStop[];
  routes?: readonly TransportRoute[];
  transfers?: readonly TransportTransfer[];
}): { valid: boolean; errors: string[] };
