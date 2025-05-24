
"use client";

import type { Location, Flavor } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import type { Icon as LucideIcon } from 'lucide-react';

// Import all necessary icons for rehydration
import {
  Drumstick,
  Banana,
  Fish,
  Beef,
  Carrot,
  Grape,
  Bird,
  Milk,
  IceCream,
  Leaf,
  Utensils,
} from 'lucide-react';

interface BookmarkContextType {
  bookmarkedLocations: Location[];
  addBookmark: (location: Location) => void;
  removeBookmark: (locationId: string) => void;
  isBookmarked: (locationId: string) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

const BOOKMARKS_STORAGE_KEY = 'eisFuerPfotenBookmarks';

const iconMap: Record<string, LucideIcon | React.FC<React.SVGProps<SVGSVGElement>>> = {
  'Leberwurst': Drumstick,
  'Banane-Erdnuss': Banana,
  'Lachs': Fish,
  'Rindfleisch': Beef,
  'Karotte-Apfel': Carrot,
  'Joghurt-Beere': Grape,
  'Hühnchen': Bird,
  'Erdbeer-Joghurt': Milk,
  'Vanille (hundesicher)': IceCream,
  'Thunfisch': Fish,
  'Kokos-Ananas (Xylit-frei)': Leaf,
  'Lebertran-Boost': Utensils,
};

export const BookmarkProvider = ({ children }: { children: ReactNode }) => {
  const [bookmarkedLocations, setBookmarkedLocations] = useState<Location[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedBookmarks = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (storedBookmarks) {
        try {
          const parsedLocations: Omit<Location, 'flavors'> & { flavors: Omit<Flavor, 'icon'>[] }[] = JSON.parse(storedBookmarks);
          
          const rehydratedLocations: Location[] = parsedLocations.map(location => ({
            ...location,
            flavors: location.flavors.map(flavor => ({
              ...flavor,
              icon: iconMap[flavor.name],
            })),
          } as Location));
          setBookmarkedLocations(rehydratedLocations);
        } catch (error) {
          console.error("Error parsing or rehydrating bookmarks from localStorage:", error);
          localStorage.removeItem(BOOKMARKS_STORAGE_KEY);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarkedLocations));
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
