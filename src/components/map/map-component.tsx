
"use client";

import type { Location } from '@/types';
import { Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';
import { IceCream } from 'lucide-react';
import { useEffect } from 'react';

interface MapComponentProps {
  locations: Location[];
  onMarkerClick: (location: Location) => void;
  selectedLocationId?: string | null;
  center: { lat: number; lng: number }; // Now controlled
  zoom: number; // Now controlled
}

// Helper component to control map view imperatively if needed, though props usually suffice
// const MapViewController = ({ center, zoom }: { center: { lat: number; lng: number }, zoom: number }) => {
//   const map = useMap();
//   useEffect(() => {
//     if (map) {
//       map.moveCamera({ center, zoom });
//     }
//   }, [map, center, zoom]);
//   return null;
// };


export default function MapComponent({
  locations,
  onMarkerClick,
  selectedLocationId,
  center,
  zoom,
}: MapComponentProps) {

  return (
    <div className="h-[calc(100vh-200px)] md:h-[calc(100vh-250px)] w-full rounded-lg overflow-hidden shadow-lg border border-border">
      <Map
        center={center} // Controlled by prop
        zoom={zoom}     // Controlled by prop
        mapId="eis_fuer_pfoten_map"
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        style={{ width: '100%', height: '100%' }}
        // The Map component re-renders on prop changes, so an explicit controller might not be needed
        // Forcing re-render via key can also work: key={`${center.lat}-${center.lng}-${zoom}`}
      >
        {/* <MapViewController center={center} zoom={zoom} /> // Alternative if props don't re-center smoothly */}
        {locations.map((location) => (
          <AdvancedMarker
            key={location.id}
            position={location.coordinates}
            onClick={() => onMarkerClick(location)}
            title={location.name}
          >
            <Pin
              background={selectedLocationId === location.id ? 'hsl(var(--accent))' : 'hsl(var(--primary))'}
              borderColor={selectedLocationId === location.id ? 'hsl(var(--accent-foreground))' : 'hsl(var(--primary-foreground))'}
              glyphColor={selectedLocationId === location.id ? 'hsl(var(--accent-foreground))' : 'hsl(var(--primary-foreground))'}
              scale={selectedLocationId === location.id ? 1.2 : 1}
            >
              <IceCream size={18} />
            </Pin>
          </AdvancedMarker>
        ))}
      </Map>
    </div>
  );
}
