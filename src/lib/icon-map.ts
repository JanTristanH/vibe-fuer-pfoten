import type { Icon as LucideIcon } from 'lucide-react';
import {
  Drumstick,
  Banana,
  Fish,
  Beef,
  Carrot,
  Grape,
  Bird,
  Milk,
  IceCream,
  Leaf,
  Utensils,
  PawPrint, // Example, if needed
  Bone,     // Example, if needed
  Apple,    // Example, if needed
} from 'lucide-react';

export const iconStringMap: Record<string, LucideIcon | React.FC<React.SVGProps<SVGSVGElement>>> = {
  'Drumstick': Drumstick,
  'Banana': Banana,
  'Fish': Fish,
  'Beef': Beef,
  'Carrot': Carrot,
  'Grape': Grape, // Note: Grapes are often not safe for dogs. Data should be reviewed.
  'Bird': Bird,   // Represents Hühnchen (Chicken)
  'Milk': Milk,   // Can represent Joghurt (Yogurt)
  'IceCream': IceCream, // Represents Vanille or general ice cream
  'Leaf': Leaf,   // Represents Kokos-Ananas (Coconut-Pineapple)
  'Utensils': Utensils, // Represents Lebertran-Boost (Cod liver oil boost)
  'PawPrint': PawPrint,
  'Bone': Bone,
  'Apple': Apple,
  // Add any other icon string names from your JSON data here
};

export const DefaultFlavorIcon: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>> = IceCream;
