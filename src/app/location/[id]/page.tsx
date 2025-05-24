
"use client";

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Location, RawLocation, Flavor } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MapPin, Clock, Phone, Globe, ExternalLink, Heart, Utensils, Tags, WifiOff, AlertTriangle } from 'lucide-react';
import FlavorTag from '@/components/location/flavor-tag';
import { useBookmarks } from '@/context/bookmark-context';
import { useEffect, useState } from 'react';
import { iconStringMap, DefaultFlavorIcon } from '@/lib/icon-map';
import { Skeleton } from '@/components/ui/skeleton';

const DATA_URL = 'https://raw.githubusercontent.com/JanTristanH/eis-f-r-pfoten-data/refs/heads/main/data.json';

// Helper to rehydrate a single location's icons
const rehydrateSingleLocation = (rawLoc: RawLocation | undefined): Location | null => {
  if (!rawLoc) return null;
  return {
    ...rawLoc,
    flavors: rawLoc.flavors.map(rawFlavor => ({
      name: rawFlavor.name,
      icon: iconStringMap[rawFlavor.icon] || DefaultFlavorIcon,
      iconColor: rawFlavor.iconColor,
    } as Flavor)),
  } as Location;
};

export default function LocationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addBookmark, removeBookmark, bookmarkedLocations } = useBookmarks();
  const [bookmarked, setBookmarked] = useState(false);

  const fetchData = async () => {
    if (!id) {
      setError("Keine Standort-ID vorhanden.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(DATA_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const rawData: RawLocation[] = await response.json();
      const foundRawLocation = rawData.find(loc => loc.id === id);
      const processedLocation = rehydrateSingleLocation(foundRawLocation);
      setLocation(processedLocation);
      if (!processedLocation) {
        setError("Standort nicht gefunden.");
      }
    } catch (e: any) {
      console.error("Failed to fetch location details:", e);
      setError(e.message || "Fehler beim Laden der Standortdetails.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (location) {
      const currentlyBookmarked = !!bookmarkedLocations.find(l => l.id === location.id);
      setBookmarked(currentlyBookmarked);
    } else {
      setBookmarked(false); 
    }
  }, [location, bookmarkedLocations]);

  const handleBookmarkToggle = () => {
    if (!location) return;
    if (bookmarked) {
      removeBookmark(location.id);
    } else {
      addBookmark(location);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Card className="overflow-hidden shadow-xl">
          <Skeleton className="w-full h-64 md:h-96 bg-muted" />
          <CardContent className="p-6 grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Skeleton className="h-8 w-3/4 mb-3" />
              <Skeleton className="h-20 w-full" />
              <Separator />
              <Skeleton className="h-8 w-1/2 mb-3" />
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-28 rounded-full" />
              </div>
              <Separator />
               <Skeleton className="h-8 w-1/3 mb-3" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
            </div>
            <div className="md:col-span-1 space-y-4">
              <Card className="shadow-md">
                <CardHeader><Skeleton className="h-6 w-3/5" /></CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </CardContent>
        </Card>
         <p className="text-center text-primary">Lade Details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
         <WifiOff size={64} className="text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-4 text-destructive">Fehler beim Laden</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Die Standortdetails konnten nicht geladen werden. Bitte versuche es später erneut.
        </p>
         <p className="text-xs text-muted-foreground mb-4">({error})</p>
        <Button onClick={fetchData} className="bg-accent hover:bg-accent/90 text-accent-foreground mr-2">
          Erneut versuchen
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Zurück zur Karte</Link>
        </Button>
      </div>
    );
  }
  
  if (!location) {
    return (
      <div className="text-center py-10">
        <AlertTriangle size={64} className="text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-4">Standort nicht gefunden</h2>
        <p className="text-muted-foreground mb-6">Der gesuchte Standort konnte leider nicht gefunden werden.</p>
        <Button asChild>
          <Link href="/">Zurück zur Karte</Link>
        </Button>
      </div>
    );
  }

  const mapsLink = `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates.lat},${location.coordinates.lng}`;

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden shadow-xl">
        <div className="relative w-full h-64 md:h-96">
          <Image
            src={location.image}
            alt={location.name}
            layout="fill"
            objectFit="cover"
            className="bg-muted"
            data-ai-hint={location.dataAiHint || 'storefront'}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6">
            <h1 className="text-4xl font-bold text-white shadow-lg">{location.name}</h1>
            <p className="text-lg text-gray-200 flex items-center gap-2 mt-1">
              <MapPin size={20} /> {location.address}
            </p>
          </div>
          <Button
            onClick={handleBookmarkToggle}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-white/80 hover:bg-white text-primary rounded-full w-12 h-12"
            aria-label={bookmarked ? "Von Lesezeichen entfernen" : "Zu Lesezeichen hinzufügen"}
          >
            <Heart size={24} fill={bookmarked ? 'currentColor' : 'none'} />
          </Button>
        </div>
        
        <CardContent className="p-6 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-primary mb-3">Über diesen Ort</h2>
              <p className="text-foreground leading-relaxed">{location.description}</p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-3 flex items-center gap-2"><Utensils /> Eissorten</h2>
              <div className="flex flex-wrap gap-3">
                {location.flavors.map((flavor) => (
                  <FlavorTag key={flavor.name} flavor={flavor} />
                ))}
              </div>
            </section>
            
            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-3 flex items-center gap-2"><Tags /> Marken</h2>
              <div className="flex flex-wrap gap-2">
                {location.brands.map((brand) => (
                  <span key={brand} className="px-3 py-1.5 bg-secondary text-secondary-foreground text-sm rounded-lg shadow-sm">
                    {brand}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <div className="md:col-span-1 space-y-4">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl text-accent-foreground">Informationen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Clock size={20} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold">Öffnungszeiten</h4>
                    <p>{location.openingHours}</p>
                  </div>
                </div>
                {location.phone && (
                  <div className="flex items-start gap-3">
                    <Phone size={20} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold">Telefon</h4>
                      <a href={`tel:${location.phone}`} className="hover:underline">{location.phone}</a>
                    </div>
                  </div>
                )}
                {location.website && (
                  <div className="flex items-start gap-3">
                    <Globe size={20} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold">Webseite</h4>
                      <a href={location.website} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">
                        {location.website}
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg">
              <Link href={mapsLink} target="_blank" rel="noopener noreferrer">
                Route starten <ExternalLink size={18} className="ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Zurück zur Karte</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
