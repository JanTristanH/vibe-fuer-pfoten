"use client";

import { useBookmarks } from '@/context/bookmark-context';
import LocationCard from '@/components/location/location-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BookmarkX } from 'lucide-react';

export default function BookmarksPage() {
  const { bookmarkedLocations } = useBookmarks();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-primary">Meine Lesezeichen</h1>
        {bookmarkedLocations.length > 0 && (
          <p className="text-muted-foreground">{bookmarkedLocations.length} Standort(e) gespeichert</p>
        )}
      </div>

      {bookmarkedLocations.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg bg-card">
          <BookmarkX size={64} className="mx-auto text-muted-foreground mb-6" />
          <h2 className="text-2xl font-semibold mb-3 text-foreground">Noch keine Lesezeichen</h2>
          <p className="text-muted-foreground mb-6">
            Speichere deine Lieblingsorte, um sie hier schnell wiederzufinden.
          </p>
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/">Zur Karte & Orte entdecken</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedLocations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      )}
    </div>
  );
}
