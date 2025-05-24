"use client";

import type { Location } from '@/types';
import { Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { IceCream } from 'lucide-react';

interface MapComponentProps {
  locations: Location[];
  onMarkerClick: (location: Location) => void;
  selectedLocationId?: string | null;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
}

export default function MapComponent({
  locations,
  onMarkerClick,
  selectedLocationId,
  initialCenter = { lat: 51.1657, lng: 10.4515 }, // Default to center of Germany
  initialZoom = 6,
}: MapComponentProps) {

  return (
    <div className="h-[calc(100vh-200px)] md:h-[calc(100vh-250px)] w-full rounded-lg overflow-hidden shadow-lg border border-border">
      <Map
        defaultCenter={initialCenter}
        defaultZoom={initialZoom}
        mapId="eis_fuer_pfoten_map"
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        style={{ width: '100%', height: '100%' }}
      >
        {locations.map((location) => (
          <AdvancedMarker
            key={location.id}
            position={location.coordinates}
            onClick={() => onMarkerClick(location)}
            title={location.name}
          >
            <Pin
              background={selectedLocationId === location.id ? 'var(--colors-accent)' : 'var(--colors-primary)'}
              borderColor={selectedLocationId === location.id ? 'var(--colors-accent-foreground)' : 'var(--colors-primary-foreground)'}
              glyphColor={selectedLocationId === location.id ? 'var(--colors-accent-foreground)' : 'var(--colors-primary-foreground)'}
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
