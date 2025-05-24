import type { Icon as LucideIcon } from 'lucide-react';

// Types for data as fetched from the JSON URL
export interface RawFlavor {
  name: string;
  icon: string; // Icon name as a string
  iconColor?: string;
}

export interface RawLocation {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  brands: string[];
  flavors: RawFlavor[];
  description: string;
  image: string;
  dataAiHint?: string;
  openingHours: string;
  phone?: string;
  website?: string;
}

// Types for processed data used within the application
export interface Flavor {
  name: string;
  icon?: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>>; // Lucide icons or custom SVGs
  iconColor?: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  brands: string[];
  flavors: Flavor[];
  description:string;
  image: string;
  dataAiHint?: string;
  openingHours: string;
  phone?: string;
  website?: string;
}

export interface CitySuggestion {
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}
