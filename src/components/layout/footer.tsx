export default function Footer() {
  return (
    <footer className="bg-card/50 border-t border-border/50">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Eis für Pfoten. Alle Rechte vorbehalten.</p>
        <p className="text-sm mt-1">Mit Liebe gemacht für unsere vierbeinigen Freunde!</p>
      </div>
    </footer>
  );
}
