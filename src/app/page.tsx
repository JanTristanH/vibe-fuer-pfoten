"use client";

import { useState, useMemo } from 'react';
import type { Location } from '@/types';
import { locations } from '@/data/locations';
import MapComponent from '@/components/map/map-component';
import LocationBottomSheet from '@/components/map/location-bottom-sheet';
import { GOOGLE_MAPS_API_KEY } from '@/lib/config';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function HomePage() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleSheetOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedLocation(null);
    }
  };
  
  const filteredLocations = useMemo(() => {
    if (!searchTerm) return locations;
    return locations.filter(location => 
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.brands.some(brand => brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      location.flavors.some(flavor => flavor.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

  if (!GOOGLE_MAPS_API_KEY) {
    // Message is handled by APIProviderWrapper, but we can add a fallback here if needed
    // or ensure the page structure is minimal if map isn't available.
    // For now, assuming APIProviderWrapper handles the primary user notification.
  }

  return (
    <div className="relative flex flex-col h-full">
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Suche nach Name, Adresse, Marke oder Sorte..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full max-w-lg mx-auto shadow-sm"
        />
      </div>
      <MapComponent
        locations={filteredLocations}
        onMarkerClick={handleMarkerClick}
        selectedLocationId={selectedLocation?.id}
      />
      <LocationBottomSheet
        location={selectedLocation}
        isOpen={!!selectedLocation}
        onOpenChange={handleSheetOpenChange}
      />
    </div>
  );
}
