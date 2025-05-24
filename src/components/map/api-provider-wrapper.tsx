"use client";

import { APIProvider } from '@vis.gl/react-google-maps';
import { GOOGLE_MAPS_API_KEY } from '@/lib/config';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export function APIProviderWrapper({ children }: { children: React.ReactNode }) {
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Google Maps API Schlüssel fehlt</AlertTitle>
          <AlertDescription>
            Bitte hinterlegen Sie Ihren Google Maps API Schlüssel in der <code>.env.local</code> Datei als <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>, um die Kartenfunktionen zu nutzen.
          </AlertDescription>
        </Alert>
        {/* Render children anyway, some parts of the app might not depend on map */}
        {/* Or conditionally render children based on whether they strictly need the map */}
        <div className="mt-4">{children}</div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      {children}
    </APIProvider>
  );
}
