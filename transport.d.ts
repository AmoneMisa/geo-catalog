import type { GeoAccuracy, GeoPoint, GeoSource, OsmRef } from './index.d.ts';

export type TransportMode = 'metro' | 'bus' | 'tram' | 'trolleybus' | 'minibus' | 'rail' | 'walk';

export interface TransportStop {
  id: string;
  type: 'stop';
  mode: Exclude<TransportMode, 'walk'>;
  country: string;
  cityId: string;
  canonicalName: string;
  center: GeoPoint;
  geoEntityId?: string;
  source?: GeoSource | string;
  accuracy?: GeoAccuracy;
  accuracyM?: number;
  osm?: OsmRef;
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
  source?: GeoSource | string;
  sourceUpdatedAt?: string;
  validFrom?: string;
  validTo?: string;
  stopIds: readonly string[];
}

export interface TransportTransfer {
  id: string;
  type: 'transfer';
  mode: 'walk';
  country: string;
  cityId: string;
  source?: GeoSource | string;
  stopIds: readonly [string, string];
}

export interface TransportFilters {
  country?: string;
  cityId?: string;
  mode?: TransportMode;
}

export interface TransportRouteFilters extends TransportFilters {
  ref?: string;
}

export const TRANSPORT_STOPS: readonly Readonly<TransportStop>[];
export const TRANSPORT_ROUTES: readonly Readonly<TransportRoute>[];
export const TRANSPORT_TRANSFERS: readonly Readonly<TransportTransfer>[];

export function getTransportStop(id: string): Readonly<TransportStop> | null;
export function getTransportRoute(id: string): Readonly<TransportRoute> | null;
export function findTransportStops(filters?: TransportFilters): readonly Readonly<TransportStop>[];
export function findTransportRoutes(filters?: TransportRouteFilters): readonly Readonly<TransportRoute>[];
export function getRoutesForStop(stopId: string): readonly Readonly<TransportRoute>[];
export function getStopsForRoute(routeId: string): readonly Readonly<TransportStop>[];
export function getTransfersForStop(stopId: string): readonly Readonly<TransportTransfer>[];
export function validateTransportCatalog(input?: {
  stops?: readonly TransportStop[];
  routes?: readonly TransportRoute[];
  transfers?: readonly TransportTransfer[];
}): { valid: boolean; errors: string[] };
