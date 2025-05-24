import type { Flavor } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { IceCream } from 'lucide-react'; // Default icon

interface FlavorTagProps {
  flavor: Flavor;
  className?: string;
}

export default function FlavorTag({ flavor, className }: FlavorTagProps) {
  const IconComponent = flavor.icon || IceCream;
  return (
    <Badge variant="outline" className={cn("flex items-center gap-1.5 py-1 px-2.5 border-primary/50 text-sm shadow-sm", className)}>
      <IconComponent size={16} className={cn(flavor.iconColor || 'text-primary')} />
      <span>{flavor.name}</span>
    </Badge>
  );
}
