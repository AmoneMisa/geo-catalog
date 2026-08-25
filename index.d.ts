export type GeoEntityType = 'country' | 'region' | 'city' | 'district' | 'microdistrict' | 'mahalla' | 'suburb' | 'settlement' | 'street' | 'residential_complex' | 'metro' | 'poi';
export type GeoSource = 'osm' | 'official' | 'manual';
export type GeoAccuracy = 'country' | 'region' | 'city' | 'district' | 'neighborhood' | 'street' | 'building' | 'poi' | 'entrance' | 'approximate';

export interface GeoPoint { lat: number; lng: number }
export interface GeoBBox { south: number; west: number; north: number; east: number }
export interface OsmRef { type: 'node' | 'way' | 'relation'; id: number }

export interface GeoEntity {
  id: string;
  type: GeoEntityType;
  country: string;
  canonicalName: string;
  parentId?: string;
  center: GeoPoint;
  bbox?: GeoBBox;
  osm?: OsmRef;
  accuracyM?: number;
  accuracy?: GeoAccuracy;
  source?: GeoSource;
}

export interface GeoEntityFilters {
  country?: string;
  type?: GeoEntityType;
  parentId?: string;
}

export const GEO_ENTITIES: readonly Readonly<GeoEntity>[];
export function getGeoEntity(id: string): Readonly<GeoEntity> | null;
export function hasGeoEntity(id: string): boolean;
export function findGeoEntities(filters?: GeoEntityFilters): readonly Readonly<GeoEntity>[];
export function getGeoChildren(parentId: string): readonly Readonly<GeoEntity>[];
export function isValidCoordinate(point: GeoPoint | null | undefined): boolean;
export function containsPoint(point: GeoPoint, bbox: GeoBBox): boolean;
export function distanceKm(a: GeoPoint, b: GeoPoint): number;
export function nearestGeoEntity(point: GeoPoint, entities: readonly GeoEntity[], filters?: Pick<GeoEntityFilters, 'country' | 'type'>): { entity: GeoEntity; distanceKm: number } | null;
export function validateGeoCatalog(entities: readonly GeoEntity[]): { valid: boolean; errors: string[] };
