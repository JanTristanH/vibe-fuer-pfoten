
"use client";

import type { Location, RawFlavor, Flavor } from '@/types'; // Updated to include RawFlavor
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { iconStringMap, DefaultFlavorIcon } from '@/lib/icon-map'; // Use shared icon map

interface BookmarkContextType {
  bookmarkedLocations: Location[];
  addBookmark: (location: Location) => void;
  removeBookmark: (locationId: string) => void;
  isBookmarked: (locationId: string) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

const BOOKMARKS_STORAGE_KEY = 'eisFuerPfotenBookmarks';

// Helper to rehydrate flavors (string icon to component icon)
const rehydrateLocationFlavors = (location: Omit<Location, 'flavors'> & { flavors: (RawFlavor | Flavor)[] }): Location => {
  return {
    ...location,
    flavors: location.flavors.map(flavor => {
      if (typeof (flavor as RawFlavor).icon === 'string') { // Check if icon is a string (RawFlavor)
        const IconComponent = iconStringMap[(flavor as RawFlavor).icon] || DefaultFlavorIcon;
        return {
          ...flavor,
          icon: IconComponent,
        } as Flavor;
      }
      // If flavor.icon is already a component or undefined, return as is (already a Flavor object)
      return flavor as Flavor;
    }),
  } as Location;
};


export const BookmarkProvider = ({ children }: { children: ReactNode }) => {
  const [bookmarkedLocations, setBookmarkedLocations] = useState<Location[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedBookmarks = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (storedBookmarks) {
        try {
          // Assume stored flavors might have string icons if old data, or component if re-saved
          const parsedLocations: (Omit<Location, 'flavors'> & { flavors: (RawFlavor | Flavor)[] })[] = JSON.parse(storedBookmarks);
          
          const rehydratedLocations: Location[] = parsedLocations.map(rehydrateLocationFlavors);
          setBookmarkedLocations(rehydratedLocations);
        } catch (error) {
          console.error("Error parsing or rehydrating bookmarks from localStorage:", error);
          localStorage.removeItem(BOOKMARKS_STORAGE_KEY); // Clear corrupted data
        }
      }
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      // Before saving, ensure flavor icons are strings if they are components
      const storableLocations = bookmarkedLocations.map(location => ({
        ...location,
        flavors: location.flavors.map(flavor => {
          const iconName = Object.keys(iconStringMap).find(key => iconStringMap[key] === flavor.icon);
          return {
            ...flavor,
            icon: iconName || (flavor.icon ? 'DefaultFlavorIconString' : undefined), // Store string representation
          };
        }),
      }));
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(storableLocations));
    }
  }, [bookmarkedLocations, isLoaded]);

  const addBookmark = useCallback((location: Location) => {
    setBookmarkedLocations((prev) => {
      if (prev.find(l => l.id === location.id)) return prev;
      return [...prev, location];
    });
  }, []);

  const removeBookmark = useCallback((locationId: string) => {
    setBookmarkedLocations((prev) => prev.filter((loc) => loc.id !== locationId));
  }, []);

  const isBookmarked = useCallback((locationId: string): boolean => {
    return !!bookmarkedLocations.find((loc) => loc.id === locationId);
  }, [bookmarkedLocations]);

  const contextValue = useMemo(() => ({
    bookmarkedLocations,
    addBookmark,
    removeBookmark,
    isBookmarked,
  }), [bookmarkedLocations, addBookmark, removeBookmark, isBookmarked]);

  return (
    <BookmarkContext.Provider value={contextValue}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = (): BookmarkContextType => {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
};
