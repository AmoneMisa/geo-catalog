export * from './index.d.ts';

import type {
  GeoEntity,
  GeoEntityType,
  LexiconGeoEntityInput,
} from './index.d.ts';

export type LexiconLocationBucketType =
  | 'districts'
  | 'microdistricts'
  | 'mahallas'
  | 'localAreas'
  | 'suburbs'
  | 'settlements'
  | 'developmentAreas'
  | 'metro'
  | 'residentialComplexes'
  | 'streets'
  | 'landmarks'
  | 'pois';

export type LexiconRuntimeGeoEntityInput = {
  country: string;
  city?: string;
  type?: GeoEntityType | LexiconLocationBucketType;
} & (
  | { canonical: string; name?: string }
  | { canonical?: string; name: string }
);

export function geoEntityKey(input: LexiconGeoEntityInput | LexiconRuntimeGeoEntityInput): string;
export function resolveLexiconGeoEntity(input: LexiconGeoEntityInput | LexiconRuntimeGeoEntityInput): Readonly<GeoEntity> | null;
export function geoIdForLexiconEntity(input: LexiconGeoEntityInput | LexiconRuntimeGeoEntityInput): string | null;
export function hasLexiconGeoEntity(input: LexiconGeoEntityInput | LexiconRuntimeGeoEntityInput): boolean;
