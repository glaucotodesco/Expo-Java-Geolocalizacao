import type { SavedLocation } from './api';
export type Point = { latitude: number; longitude: number; accuracy: number | null };
export type LocationMapProps = { position: Point | null; savedLocations: SavedLocation[]; focusToken: number };
