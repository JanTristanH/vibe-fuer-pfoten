"use client";

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getLocationById } from '@/data/locations';
import type { Location } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MapPin, Clock, Phone, Globe, ExternalLink, Heart, Utensils, Tags, Building } from 'lucide-react';
import FlavorTag from '@/components/location/flavor-tag';
import { useBookmarks } from '@/context/bookmark-context';
import { useEffect, useState } from 'react';

export default function LocationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchedLocation = getLocationById(id);
      if (fetchedLocation) {
        setLocation(fetchedLocation);
        setBookmarked(isBookmarked(id));
      }
      setIsLoading(false);
    }
  }, [id, isBookmarked]);

  useEffect(() => {
    if (location) {
      setBookmarked(isBookmarked(location.id));
    }
  }, [isBookmarked, location]);


  const handleBookmarkToggle = () => {
    if (!location) return;
    if (bookmarked) {
      removeBookmark(location.id);
    } else {
      addBookmark(location);
    }
    setBookmarked(!bookmarked);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl text-primary">Lade Details...</p>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="text-center py-10">
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
            data-ai-hint={location.dataAiHint}
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
