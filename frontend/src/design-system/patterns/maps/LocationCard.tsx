import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { Surface } from '../../primitives/foundation/Surface';
import { StatusChip } from '../../composites/status/StatusChip';
import { Button } from '../../primitives/buttons/Button';
import { cn } from '../../../lib/utils';

export interface LocationCardProps {
  title: string;
  locality: string;
  statusLabel: string;
  category?: 'ai' | 'government' | 'community' | 'verified' | 'danger';
  thumbnailUrl?: string;
  onViewCase?: () => void;
  className?: string;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  title,
  locality,
  statusLabel,
  category = 'government',
  thumbnailUrl,
  onViewCase,
  className,
}) => {
  return (
    <Surface variant="card" elevation={2} className={cn('p-4 font-sans space-y-3', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <StatusChip category={category} label={statusLabel} size="sm" />
          <h4 className="text-base font-semibold text-neutral-900 leading-snug">{title}</h4>
          <p className="text-xs text-neutral-700 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-neutral-700" />
            {locality}
          </p>
        </div>

        {thumbnailUrl && (
          <img src={thumbnailUrl} alt={title} className="w-16 h-16 rounded-md object-cover border border-neutral-200 shrink-0" />
        )}
      </div>

      {onViewCase && (
        <div className="pt-2 border-t border-neutral-100 flex justify-end">
          <Button variant="ghost" size="sm" onClick={onViewCase} trailingIcon={<ArrowRight className="w-4 h-4" />}>
            View Case Timeline
          </Button>
        </div>
      )}
    </Surface>
  );
};
