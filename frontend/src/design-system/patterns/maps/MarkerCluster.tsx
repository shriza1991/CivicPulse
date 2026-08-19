import React from 'react';
import { cn } from '../../../lib/utils';

export interface MarkerClusterProps {
  count: number;
  onClick?: () => void;
  className?: string;
}

export const MarkerCluster: React.FC<MarkerClusterProps> = ({ count, onClick, className }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Cluster containing ${count} civic reports. Tap to expand.`}
      className={cn(
        'w-12 h-12 rounded-pill bg-primary-700 text-white font-bold text-sm shadow-modal border-2 border-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary-500 min-w-[48px] min-h-[48px]',
        className
      )}
    >
      {count}
    </button>
  );
};
