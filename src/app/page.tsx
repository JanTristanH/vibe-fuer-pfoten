
"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import type { Location, RawLocation, CitySuggestion, RawFlavor, Flavor } from '@/types';
import MapComponent from '@/components/map/map-component';
import LocationBottomSheet from '@/components/map/location-bottom-sheet';
import { GOOGLE_MAPS_API_KEY } from '@/lib/config';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, AlertTriangle, WifiOff } from "lucide-react";
import { iconStringMap, DefaultFlavorIcon } from '@/lib/icon-map';
import { Skeleton } from '@/components/ui/skeleton';

const DATA_URL = 'https://raw.githubusercontent.com/JanTristanH/eis-f-r-pfoten-data/refs/heads/main/data.json';

// Helper to rehydrate icons from string names to components
const rehydrateLocations = (rawLocations: RawLocation[]): Location[] => {
  return rawLocations.map(rawLoc => ({
    ...rawLoc,
    flavors: rawLoc.flavors.map(rawFlavor => ({
      name: rawFlavor.name,
      icon: iconStringMap[rawFlavor.icon] || DefaultFlavorIcon,
      iconColor: rawFlavor.iconColor,
    } as Flavor)),
  }));
};

const extractCityName = (address: string): string | null => {
  const parts = address.split(',');
  if (parts.length > 1) {
    const cityAndMaybeCode = parts[parts.length - 1].trim();
    return cityAndMaybeCode.replace(/^\d{5}\s*/, '').trim();
  }
  return null;
};

const defaultMapCenter = { lat: 51.1657, lng: 10.4515 }; // Germany
const defaultMapZoom = 6;

export default function HomePage() {
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const [mapCenter, setMapCenter] = useState(defaultMapCenter);
  const [mapZoom, setMapZoom] = useState(defaultMapZoom);

  const [citySuggestions, setCitySuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(DATA_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const rawData: RawLocation[] = await response.json();
      const processedLocations = rehydrateLocations(rawData);
      setAllLocations(processedLocations);
    } catch (e: any) {
      console.error("Failed to fetch locations:", e);
      setError(e.message || "Fehler beim Laden der Standorte. Bitte versuche es später erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const uniqueCities = useMemo((): CitySuggestion[] => {
    if (isLoading || error) return [];
    const cityMap = new Map<string, CitySuggestion>();
    allLocations.forEach(location => {
      const cityName = extractCityName(location.address);
      if (cityName && !cityMap.has(cityName)) {
        cityMap.set(cityName, { name: cityName, coordinates: location.coordinates });
      }
    });
    return Array.from(cityMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [allLocations, isLoading, error]);

  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location);
    setMapCenter(location.coordinates); 
    setMapZoom(14);
  };

  const handleSheetOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedLocation(null);
    }
  };
  
  const filteredLocations = useMemo(() => {
    if (!searchTerm) return allLocations;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return allLocations.filter(location => 
      location.name.toLowerCase().includes(lowerSearchTerm) ||
      location.address.toLowerCase().includes(lowerSearchTerm) ||
      location.brands.some(brand => brand.toLowerCase().includes(lowerSearchTerm)) ||
      location.flavors.some(flavor => flavor.name.toLowerCase().includes(lowerSearchTerm))
    );
  }, [searchTerm, allLocations]);

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
    }
  };

  const handleSuggestionClick = (city: CitySuggestion) => {
    setSearchTerm(city.name);
    setMapCenter(city.coordinates);
    setMapZoom(11);
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="relative w-full max-w-lg mx-auto">
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-[calc(100vh-200px)] md:h-[calc(100vh-250px)] w-full rounded-lg" />
        <p className="text-center text-primary">Lade Standorte...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-10 text-center">
        <WifiOff size={64} className="text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2 text-destructive">Laden fehlgeschlagen</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Die Standorte konnten nicht geladen werden. Bitte überprüfe deine Internetverbindung und versuche es erneut.
        </p>
        <p className="text-xs text-muted-foreground mb-4">({error})</p>
        <Button onClick={fetchData} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          Erneut versuchen
        </Button>
      </div>
    );
  }

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
        // APIProviderWrapper shows its own error, but we can add a placeholder here too
        <div className="flex flex-col items-center justify-center h-full text-center border-2 border-dashed rounded-lg p-8">
          <AlertTriangle size={48} className="text-destructive mb-4" />
          <h2 className="text-xl font-semibold text-destructive">Google Maps API Schlüssel fehlt</h2>
          <p className="text-muted-foreground">
            Die Karte kann nicht angezeigt werden, da der Google Maps API Schlüssel nicht konfiguriert ist.
          </p>
        </div>
      )}
    </div>
  );
}
