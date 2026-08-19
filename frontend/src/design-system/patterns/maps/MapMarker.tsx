import React from 'react';
import { MapPin, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { cn } from '../../../lib/utils';

export type MarkerStatus = 'active' | 'confirmed' | 'resolved' | 'restricted';

export interface MapMarkerProps {
  id: string;
  label: string;
  status?: MarkerStatus;
  latitude: number;
  longitude: number;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

const statusColorMap: Record<MarkerStatus, { bg: string; text: string; icon: React.ReactNode }> = {
  active: {
    bg: 'bg-amber-500 text-white',
    text: 'text-amber-900',
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  },
  confirmed: {
    bg: 'bg-government text-white',
    text: 'text-indigo-900',
    icon: <ShieldCheck className="w-3.5 h-3.5" />,
  },
  resolved: {
    bg: 'bg-success text-white',
    text: 'text-green-900',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  restricted: {
    bg: 'bg-neutral-700 text-white',
    text: 'text-neutral-900',
    icon: <MapPin className="w-3.5 h-3.5" />,
  },
};

export const MapMarker: React.FC<MapMarkerProps> = ({
  label,
  status = 'active',
  latitude,
  longitude,
  onClick,
  selected = false,
  className,
}) => {
  const config = statusColorMap[status];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Case marker ${label} at location ${latitude}, ${longitude}`}
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill shadow-premium font-sans text-xs font-semibold select-none transition-transform duration-fast',
        'hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary-500 min-h-[44px]',
        config.bg,
        selected && 'ring-4 ring-primary-500 scale-110',
        className
      )}
    >
      {config.icon}
      <span className="truncate max-w-[120px]">{label}</span>
    </button>
  );
};
