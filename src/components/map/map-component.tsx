
"use client";

import type { Location } from '@/types';
import { Map, AdvancedMarker, Pin, useMap, MapCameraChangedEvent } from '@vis.gl/react-google-maps';
import { IceCream } from 'lucide-react';
import type { useEffect } from 'react'; // Import type for useEffect if it were used

interface MapComponentProps {
  locations: Location[];
  onMarkerClick: (location: Location) => void;
  selectedLocationId?: string | null;
  center: { lat: number; lng: number };
  zoom: number;
  onCameraChange: (newCenter: { lat: number; lng: number }, newZoom: number) => void;
}

export default function MapComponent({
  locations,
  onMarkerClick,
  selectedLocationId,
  center,
  zoom,
  onCameraChange,
}: MapComponentProps) {

  const handleCameraChanged = (ev: MapCameraChangedEvent) => {
    onCameraChange(ev.detail.center, ev.detail.zoom);
  };

  return (
    <div className="h-[calc(100vh-200px)] md:h-[calc(100vh-250px)] w-full rounded-lg overflow-hidden shadow-lg border border-border">
      <Map
        center={center}
        zoom={zoom}
        onCameraChanged={handleCameraChanged}
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
