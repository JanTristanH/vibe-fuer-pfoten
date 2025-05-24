import type { Location } from '@/types';
import { Drumstick, Fish, IceCream, Leaf, Banana, Beef, Bird, Carrot, Utensils, Milk, Grape } from 'lucide-react';

export const locations: Location[] = [
  {
    id: '1',
    name: 'Pauls Pfoten-Eisdiele',
    address: 'Hauptstraße 10, 10115 Berlin',
    coordinates: { lat: 52.5200, lng: 13.4050 },
    brands: ['PfotenFreude Eis', 'Bello Gelato'],
    flavors: [
      { name: 'Leberwurst', icon: Drumstick, iconColor: 'text-red-600' },
      { name: 'Banane-Erdnuss', icon: Banana, iconColor: 'text-yellow-500' },
      { name: 'Lachs', icon: Fish, iconColor: 'text-pink-500' },
    ],
    description: 'Die beste Eisdiele für Hunde in Mitte! Große Auswahl und immer frische Zutaten.',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'dog icecream',
    openingHours: 'Mo-So: 12:00 - 18:00 Uhr',
    phone: '030 1234567',
    website: 'https://pauls-pfoteneis.de',
  },
  {
    id: '2',
    name: 'Wuffis Eisoase',
    address: 'Marktplatz 5, 80331 München',
    coordinates: { lat: 48.1351, lng: 11.5820 },
    brands: ['HappyTail Eiscreme'],
    flavors: [
      { name: 'Rindfleisch', icon: Beef, iconColor: 'text-red-700' },
      { name: 'Karotte-Apfel', icon: Carrot, iconColor: 'text-orange-500' },
      { name: 'Joghurt-Beere', icon: Grape, iconColor: 'text-purple-500' },
    ],
    description: 'Eine Oase für Hunde an heißen Tagen. Nur natürliche Zutaten.',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'happy dog',
    openingHours: 'Di-Sa: 11:00 - 19:00 Uhr',
    website: 'https://wuffis-eisoase.bayern',
  },
  {
    id: '3',
    name: 'Fidos Frostige Freude',
    address: 'Elbchaussee 100, 22763 Hamburg',
    coordinates: { lat: 53.5511, lng: 9.9937 },
    brands: ['PfotenFreude Eis', 'Kalt & Köstlich für Hunde'],
    flavors: [
      { name: 'Hühnchen', icon: Bird, iconColor: 'text-yellow-600' },
      { name: 'Erdbeer-Joghurt', icon: Milk, iconColor: 'text-pink-400' },
      { name: 'Vanille (hundesicher)', icon: IceCream, iconColor: 'text-yellow-300' },
    ],
    description: 'Leckeres Eis mit Blick auf die Elbe. Perfekt für einen Spaziergang.',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'icecream shop',
    openingHours: 'Mi-So: 13:00 - 17:00 Uhr',
    phone: '040 9876543',
  },
  {
    id: '4',
    name: 'Kölner Kläffer-Kremeis',
    address: 'Domplatz 1, 50667 Köln',
    coordinates: { lat: 50.9413, lng: 6.9583 },
    brands: ['Bello Gelato'],
    flavors: [
      { name: 'Thunfisch', icon: Fish, iconColor: 'text-blue-500' },
      { name: 'Kokos-Ananas (Xylit-frei)', icon: Leaf, iconColor: 'text-green-500' },
      { name: 'Lebertran-Boost', icon: Utensils, iconColor: 'text-gray-600' },
    ],
    description: 'Direkt am Dom gibt es die beste Abkühlung für deinen Liebling.',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'city park',
    openingHours: 'Mo-Fr: 10:00 - 18:00 Uhr; Sa: 10:00 - 16:00 Uhr',
  },
];

export const getLocationById = (id: string): Location | undefined => {
  return locations.find(location => location.id === id);
};
