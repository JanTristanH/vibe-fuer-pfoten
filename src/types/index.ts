import type { Icon as LucideIcon } from 'lucide-react';

export interface Flavor {
  name: string;
  icon?: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>>; // Allow Lucide icons or custom SVGs
  iconColor?: string; // Optional color for the icon
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
  description: string;
  image: string;
  dataAiHint?: string; // For placeholder image generation
  openingHours: string;
  phone?: string;
  website?: string;
}
