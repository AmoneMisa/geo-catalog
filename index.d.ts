export type GeoEntityType = 'country' | 'region' | 'city' | 'district' | 'microdistrict' | 'mahalla' | 'local_area' | 'suburb' | 'settlement' | 'street' | 'address' | 'residential_complex' | 'metro' | 'poi';
export type GeoSource = 'osm' | 'wikidata' | 'official' | 'manual';
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
  wikidataId?: string;
  accuracyM?: number;
  accuracy?: GeoAccuracy;
  source?: GeoSource;
  sourceUrl?: string;
  lookupKey?: string;
}

export interface GeoEntityFilters {
  country?: string;
  type?: GeoEntityType;
  parentId?: string;
}

export interface LexiconGeoEntityInput {
  country: string;
  city?: string;
  type?: GeoEntityType;
  canonical: string;
}

export interface GeoCoverageGap extends LexiconGeoEntityInput {
  reason: string;
}

export interface GeoLookupKeyParts {
  country: string;
  type?: GeoEntityType | string;
  city?: unknown;
  district?: unknown;
  street?: unknown;
  houseNumber?: unknown;
  building?: unknown;
  canonical?: unknown;
  name?: unknown;
}

export const GEO_ENTITIES: readonly Readonly<GeoEntity>[];
export const GEO_COVERAGE_GAPS: readonly Readonly<GeoCoverageGap>[];
export function getGeoEntity(id: string): Readonly<GeoEntity> | null;
export function getGeoEntityByLookupKey(lookupKey: string): Readonly<GeoEntity> | null;
export function hasGeoEntity(id: string): boolean;
export function findGeoEntities(filters?: GeoEntityFilters): readonly Readonly<GeoEntity>[];
export function getGeoChildren(parentId: string): readonly Readonly<GeoEntity>[];
export function isGeoCoverageGap(input: LexiconGeoEntityInput): boolean;
export function isValidCoordinate(point: GeoPoint | null | undefined): boolean;
export function containsPoint(point: GeoPoint, bbox: GeoBBox): boolean;
export function distanceKm(a: GeoPoint, b: GeoPoint): number;
export function nearestGeoEntity(point: GeoPoint, entities: readonly GeoEntity[], filters?: Pick<GeoEntityFilters, 'country' | 'type'>): { entity: GeoEntity; distanceKm: number } | null;
export function validateGeoCatalog(entities: readonly GeoEntity[]): { valid: boolean; errors: string[] };
export function geoEntityKey(input: LexiconGeoEntityInput): string;
export function resolveLexiconGeoEntity(input: LexiconGeoEntityInput): Readonly<GeoEntity> | null;
export function geoIdForLexiconEntity(input: LexiconGeoEntityInput): string | null;
export function hasLexiconGeoEntity(input: LexiconGeoEntityInput): boolean;
export function buildGeoLookupKey(parts?: GeoLookupKeyParts): string | null;
