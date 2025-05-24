"use client";

import type { Location } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BookmarkContextType {
  bookmarkedLocations: Location[];
  addBookmark: (location: Location) => void;
  removeBookmark: (locationId: string) => void;
  isBookmarked: (locationId: string) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

const BOOKMARKS_STORAGE_KEY = 'eisFuerPfotenBookmarks';

export const BookmarkProvider = ({ children }: { children: ReactNode }) => {
  const [bookmarkedLocations, setBookmarkedLocations] = useState<Location[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedBookmarks = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (storedBookmarks) {
        try {
          setBookmarkedLocations(JSON.parse(storedBookmarks));
        } catch (error) {
          console.error("Error parsing bookmarks from localStorage:", error);
          localStorage.removeItem(BOOKMARKS_STORAGE_KEY); // Clear corrupted data
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

  const addBookmark = (location: Location) => {
    setBookmarkedLocations((prev) => {
      if (prev.find(l => l.id === location.id)) return prev; // Avoid duplicates
      return [...prev, location];
    });
  };

  const removeBookmark = (locationId: string) => {
    setBookmarkedLocations((prev) => prev.filter((loc) => loc.id !== locationId));
  };

  const isBookmarked = (locationId: string): boolean => {
    return !!bookmarkedLocations.find((loc) => loc.id === locationId);
  };

  return (
    <BookmarkContext.Provider value={{ bookmarkedLocations, addBookmark, removeBookmark, isBookmarked }}>
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
