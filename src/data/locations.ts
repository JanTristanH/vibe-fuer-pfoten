import type { Location } from '@/types';
// This file is deprecated for providing static locations.
// Location data is now fetched from an external URL in the respective page components.

export const locations: Location[] = [];

export const getLocationById = (id: string): Location | undefined => {
  // This function is no longer the source of truth for location data.
  // Page components (src/app/location/[id]/page.tsx) now fetch data directly.
  console.warn('Deprecated: getLocationById from src/data/locations.ts was called. Data is now fetched dynamically.');
  return undefined;
};
