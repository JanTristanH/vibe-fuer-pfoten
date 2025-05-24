import Link from 'next/link';
import { Dog, IceCream, Bookmark } from 'lucide-react'; // Using IceCream icon for app logo
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
          <IceCream size={32} className="text-primary" />
          <h1 className="text-2xl font-semibold">Eis für Pfoten</h1>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild>
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Karte
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/bookmarks" className="text-foreground hover:text-primary transition-colors flex items-center gap-1">
              <Bookmark size={18} />
              Lesezeichen
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
