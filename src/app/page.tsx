
"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import type { Location, CitySuggestion } from '@/types';
import { locations } from '@/data/locations';
import MapComponent from '@/components/map/map-component';
import LocationBottomSheet from '@/components/map/location-bottom-sheet';
import { GOOGLE_MAPS_API_KEY } from '@/lib/config';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Helper to extract city name from address (simple heuristic)
const extractCityName = (address: string): string | null => {
  const parts = address.split(',');
  if (parts.length > 1) {
    // Get the last part (usually "PostalCode City" or "City")
    const cityAndMaybeCode = parts[parts.length - 1].trim();
    // Remove 5-digit postal code if present
    return cityAndMaybeCode.replace(/^\d{5}\s*/, '').trim();
  }
  return null;
};

const defaultMapCenter = { lat: 51.1657, lng: 10.4515 }; // Germany
const defaultMapZoom = 6;

export default function HomePage() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const [mapCenter, setMapCenter] = useState(defaultMapCenter);
  const [mapZoom, setMapZoom] = useState(defaultMapZoom);

  const [citySuggestions, setCitySuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const uniqueCities = useMemo((): CitySuggestion[] => {
    const cityMap = new Map<string, CitySuggestion>();
    locations.forEach(location => {
      const cityName = extractCityName(location.address);
      if (cityName && !cityMap.has(cityName)) {
        cityMap.set(cityName, { name: cityName, coordinates: location.coordinates });
      }
    });
    return Array.from(cityMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location);
    setMapCenter(location.coordinates); 
    setMapZoom(14); // Zoom in on marker click
  };

  const handleSheetOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedLocation(null);
    }
  };
  
  const filteredLocations = useMemo(() => {
    if (!searchTerm) return locations;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return locations.filter(location => 
      location.name.toLowerCase().includes(lowerSearchTerm) ||
      location.address.toLowerCase().includes(lowerSearchTerm) ||
      location.brands.some(brand => brand.toLowerCase().includes(lowerSearchTerm)) ||
      location.flavors.some(flavor => flavor.name.toLowerCase().includes(lowerSearchTerm))
    );
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term) {
      const matchingCities = uniqueCities.filter(city => 
        city.name.toLowerCase().startsWith(term.toLowerCase())
      );
      setCitySuggestions(matchingCities);
      setShowSuggestions(matchingCities.length > 0);
    } else {
      setCitySuggestions([]);
      setShowSuggestions(false);
      // Optionally reset map to default view when search is cleared
      // setMapCenter(defaultMapCenter);
      // setMapZoom(defaultMapZoom);
    }
  };

  const handleSuggestionClick = (city: CitySuggestion) => {
    setSearchTerm(city.name);
    setMapCenter(city.coordinates);
    setMapZoom(11); // Zoom level for a city view
    setShowSuggestions(false);
  };

  const handleMapCameraChange = (newCenter: { lat: number; lng: number }, newZoom: number) => {
    setMapCenter(newCenter);
    setMapZoom(newZoom);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);


  return (
    <div className="relative flex flex-col h-full">
      <div className="relative mb-4 w-full max-w-lg mx-auto" ref={searchContainerRef}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
        <Input
          type="text"
          placeholder="Suche Stadt, Name, Adresse, Marke oder Sorte..."
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => searchTerm && citySuggestions.length > 0 && setShowSuggestions(true)}
          className="pl-10 w-full shadow-sm"
          aria-autocomplete="list"
          aria-controls="city-suggestions-list"
        />
        {showSuggestions && citySuggestions.length > 0 && (
          <ul 
            id="city-suggestions-list"
            className="absolute z-20 w-full bg-card border border-border rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto"
            role="listbox"
          >
            {citySuggestions.map((city) => (
              <li
                key={city.name}
                onClick={() => handleSuggestionClick(city)}
                className="px-4 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm"
                role="option"
                aria-selected={false}
              >
                {city.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      {GOOGLE_MAPS_API_KEY ? (
        <>
          <MapComponent
            locations={filteredLocations}
            onMarkerClick={handleMarkerClick}
            selectedLocationId={selectedLocation?.id}
            center={mapCenter}
            zoom={mapZoom}
            onCameraChange={handleMapCameraChange}
          />
          <LocationBottomSheet
            location={selectedLocation}
            isOpen={!!selectedLocation}
            onOpenChange={handleSheetOpenChange}
          />
        </>
      ) : (
        null // APIProviderWrapper already handles showing an error message
      )}
    </div>
  );
}
