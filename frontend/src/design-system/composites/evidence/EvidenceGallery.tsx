import React from 'react';
import { EvidenceCard, type EvidenceCardProps } from './EvidenceCard';
import { cn } from '../../../lib/utils';

export interface EvidenceGalleryProps {
  items: EvidenceCardProps[];
  onInspectItem?: (item: EvidenceCardProps) => void;
  layout?: 'grid' | 'strip';
  className?: string;
}

export const EvidenceGallery: React.FC<EvidenceGalleryProps> = ({
  items,
  onInspectItem,
  layout = 'grid',
  className,
}) => {
  if (items.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-neutral-700 bg-neutral-50 rounded-md border border-neutral-200">
        No evidence media attached yet.
      </div>
    );
  }

  return (
    <div
      className={cn(
        layout === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'
          : 'flex gap-3 overflow-x-auto pb-2 scrollbar-thin',
        className
      )}
    >
      {items.map((item) => (
        <div key={item.id} className={layout === 'strip' ? 'w-64 shrink-0' : undefined}>
          <EvidenceCard {...item} onInspect={() => onInspectItem?.(item)} />
        </div>
      ))}
    </div>
  );
};
