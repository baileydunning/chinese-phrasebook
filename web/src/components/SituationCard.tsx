import { Situation } from '@/types/phrase';
import { 
  UtensilsCrossed, 
  Car, 
  Building2, 
  ShoppingBag, 
  ShieldAlert, 
  MessageCircle, 
  Heart,
  CloudSun,
  Trees,
  Wifi,
  Bath,
  Camera,
  LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const iconMap: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Car,
  Building2,
  ShoppingBag,
  ShieldAlert,
  MessageCircle,
  Heart,
  CloudSun,
  Trees,
  Wifi,
  Bath,
  Camera,
};

interface SituationCardProps {
  situation: Situation;
  className?: string;
  style?: React.CSSProperties;
}

export const SituationCard = ({ situation, className, style }: SituationCardProps) => {
  const Icon = iconMap[situation.icon] || MessageCircle;

  const colorClasses: Record<string, string> = {
    'situation-food': 'bg-situation-food',
    'situation-transport': 'bg-situation-transport',
    'situation-hotel': 'bg-situation-hotel',
    'situation-shopping': 'bg-situation-shopping',
    'situation-emergency': 'bg-situation-emergency',
    'situation-social': 'bg-situation-social',
    'situation-dating': 'bg-situation-dating',
    'situation-weather': 'bg-situation-weather',
    'situation-nature': 'bg-situation-nature',
    'situation-tech': 'bg-situation-tech',
    'situation-facilities': 'bg-situation-facilities',
    'situation-attractions': 'bg-situation-attractions',
  };

  return (
    <Link
      to={`/situation/${situation.id}`}
      className={cn(
        "situation-card block p-4 rounded-xl bg-card border border-border/50",
        "focus:outline-none focus:ring-2 focus:ring-primary/20",
        className
      )}
      style={style}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center",
          colorClasses[situation.color] || 'bg-primary'
        )}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-0.5">
            {situation.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {situation.description}
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            {situation.phrases.length} phrases
          </p>
        </div>
      </div>
    </Link>
  );
};
