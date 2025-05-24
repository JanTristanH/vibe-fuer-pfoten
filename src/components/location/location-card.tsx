import type { Location } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, ExternalLink, Heart } from 'lucide-react';
import FlavorTag from './flavor-tag';
import { useBookmarks } from '@/context/bookmark-context';

interface LocationCardProps {
  location: Location;
}

export default function LocationCard({ location }: LocationCardProps) {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const bookmarked = isBookmarked(location.id);

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click if button is inside
    e.preventDefault();
    if (bookmarked) {
      removeBookmark(location.id);
    } else {
      addBookmark(location);
    }
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <Link href={`/location/${location.id}`} className="block">
        <div className="relative w-full h-48">
          <Image
            src={location.image}
            alt={location.name}
            layout="fill"
            objectFit="cover"
            className="bg-muted"
            data-ai-hint={location.dataAiHint}
          />
        </div>
      </Link>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Link href={`/location/${location.id}`} className="block">
            <CardTitle className="text-xl text-primary hover:underline">{location.name}</CardTitle>
          </Link>
          <Button
            onClick={handleBookmarkToggle}
            variant="ghost"
            size="icon"
            className="text-primary hover:text-accent -mt-1 -mr-1"
            aria-label={bookmarked ? "Von Lesezeichen entfernen" : "Zu Lesezeichen hinzufügen"}
          >
            <Heart size={22} fill={bookmarked ? 'currentColor' : 'none'} />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground flex items-center gap-1 pt-1">
          <MapPin size={14} /> {location.address}
        </p>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-foreground mb-3 line-clamp-2">{location.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {location.flavors.slice(0, 2).map(flavor => ( // Show a couple of flavors
            <FlavorTag key={flavor.name} flavor={flavor} className="text-xs px-1.5 py-0.5"/>
          ))}
          {location.flavors.length > 2 && <Badge variant="outline" className="text-xs px-1.5 py-0.5 border-primary/30">+ {location.flavors.length - 2} mehr</Badge>}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full border-accent text-accent-foreground hover:bg-accent/10 hover:text-accent-foreground">
          <Link href={`/location/${location.id}`}>
            Details ansehen <ExternalLink size={16} className="ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
