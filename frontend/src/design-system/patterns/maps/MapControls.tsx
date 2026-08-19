import React from 'react';
import { Plus, Minus, Navigation } from 'lucide-react';
import { IconButton } from '../../primitives/buttons/IconButton';
import { cn } from '../../../lib/utils';

export interface MapControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onRecenter?: () => void;
  className?: string;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onRecenter,
  className,
}) => {
  return (
    <div
      role="toolbar"
      aria-label="Map navigation controls"
      className={cn('flex flex-col gap-1.5 p-1 bg-white rounded-md shadow-premium border border-neutral-200 z-10', className)}
    >
      {onZoomIn && <IconButton icon={<Plus className="w-4 h-4" />} label="Zoom in on map" size="sm" onClick={onZoomIn} />}
      {onZoomOut && <IconButton icon={<Minus className="w-4 h-4" />} label="Zoom out on map" size="sm" onClick={onZoomOut} />}
      {onRecenter && <IconButton icon={<Navigation className="w-4 h-4" />} label="Recenter on current location" size="sm" onClick={onRecenter} />}
    </div>
  );
};
