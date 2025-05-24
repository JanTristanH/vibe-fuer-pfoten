
"use client";

import type { Location } from '@/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ExternalLink, Phone, Globe, Heart } from 'lucide-react';
import FlavorTag from '@/components/location/flavor-tag';
import { useBookmarks } from '@/context/bookmark-context';
import { useEffect, useState } from 'react';

interface LocationBottomSheetProps {
  location: Location | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function LocationBottomSheet({ location, isOpen, onOpenChange }: LocationBottomSheetProps) {
  const { addBookmark, removeBookmark, bookmarkedLocations } = useBookmarks();
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (isOpen && location) {
      const currentlyBookmarked = !!bookmarkedLocations.find(l => l.id === location.id);
      setBookmarked(currentlyBookmarked);
    } else if (!isOpen) {
      setBookmarked(false); 
    }
  }, [location, bookmarkedLocations, isOpen]);

  const handleBookmarkToggle = () => {
    if (!location) return;
    if (bookmarked) {
      removeBookmark(location.id);
    } else {
      addBookmark(location);
    }
    // Optimistic update removed: Let useEffect handle the state change
    // setBookmarked(!bookmarked); 
  };

  if (!location) return null;

  const mapsLink = `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates.lat},${location.coordinates.lng}`;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-lg shadow-xl max-h-[80vh] overflow-y-auto">
        <SheetHeader className="mb-4 text-left">
          <div className="flex justify-between items-start gap-2">
            <SheetTitle className="text-2xl text-primary">{location.name}</SheetTitle>
            <Button
              onClick={handleBookmarkToggle}
              variant="ghost"
              size="icon"
              className="text-primary hover:text-accent -mt-1 flex-shrink-0 mr-6"
              aria-label={bookmarked ? "Von Lesezeichen entfernen" : "Zu Lesezeichen hinzufügen"}
            >
              <Heart size={24} fill={bookmarked ? 'currentColor' : 'none'} />
            </Button>
          </div>
          <SheetDescription className="flex items-center gap-1 text-muted-foreground">
            <MapPin size={16} /> {location.address}
          </SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-1">
            <Image
              src={location.image}
              alt={location.name}
              width={300}
              height={200}
              className="rounded-lg object-cover w-full aspect-[3/2] shadow-md"
              data-ai-hint={location.dataAiHint}
            />
          </div>
          <div className="md:col-span-2 space-y-3">
            <p className="text-foreground">{location.description}</p>
            
            <div>
              <h4 className="font-semibold text-primary mb-1">Verfügbare Marken:</h4>
              <div className="flex flex-wrap gap-2">
                {location.brands.map((brand) => (
                  <span key={brand} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                    {brand}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-1">Eissorten:</h4>
              <div className="flex flex-wrap gap-2">
                {location.flavors.slice(0, 3).map((flavor) => ( 
                  <FlavorTag key={flavor.name} flavor={flavor} />
                ))}
                {location.flavors.length > 3 && <span className="text-xs text-muted-foreground self-end">... und mehr!</span>}
              </div>
            </div>

            {location.phone && (
              <p className="flex items-center gap-2 text-sm">
                <Phone size={16} className="text-primary" /> 
                <a href={`tel:${location.phone}`} className="hover:underline">{location.phone}</a>
              </p>
            )}
            {location.website && (
              <p className="flex items-center gap-2 text-sm">
                <Globe size={16} className="text-primary" />
                <a href={location.website} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                  {location.website}
                </a>
              </p>
            )}
          </div>
        </div>
        <SheetFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Schließen</Button>
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href={mapsLink} target="_blank" rel="noopener noreferrer">
              Route starten <ExternalLink size={16} className="ml-2" />
            </Link>
          </Button>
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href={`/location/${location.id}`}>
              Details ansehen <ExternalLink size={16} className="ml-2" />
            </Link>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
