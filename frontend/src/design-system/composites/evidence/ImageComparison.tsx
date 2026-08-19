import React, { useState } from 'react';
import { cn } from '../../../lib/utils';

export interface ImageComparisonProps {
  beforeUrl: string;
  afterUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
  mode?: 'side-by-side' | 'slider';
  className?: string;
}

export const ImageComparison: React.FC<ImageComparisonProps> = ({
  beforeUrl,
  afterUrl,
  beforeLabel = 'Before (Reported Issue)',
  afterLabel = 'After (Department Repair)',
  mode = 'side-by-side',
  className,
}) => {
  const [sliderPos, setSliderPos] = useState(50);

  if (mode === 'slider') {
    return (
      <div className={cn('w-full font-sans space-y-2', className)}>
        <div className="relative rounded-lg overflow-hidden aspect-video bg-neutral-900 select-none">
          {/* Before image background */}
          <img src={beforeUrl} alt={beforeLabel} className="absolute inset-0 w-full h-full object-cover" />

          {/* After image overlay clipped by slider position */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <img src={afterUrl} alt={afterLabel} className="absolute inset-0 w-full h-full object-cover max-w-none" />
          </div>

          {/* Interactive divider bar */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-subtle"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="w-6 h-6 rounded-pill bg-primary-700 text-white flex items-center justify-center text-xs font-bold -translate-x-2.5 top-1/2 relative shadow-premium">
              ↔
            </div>
          </div>
        </div>

        <div className="flex justify-between text-xs font-semibold">
          <span className="text-neutral-700">{afterLabel} ({sliderPos}%)</span>
          <span className="text-neutral-700">{beforeLabel} ({100 - sliderPos}%)</span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={sliderPos}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          aria-label="Image comparison slider"
          className="w-full h-2 bg-neutral-200 rounded-pill accent-primary-700 cursor-pointer"
        />
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans', className)}>
      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-danger bg-red-50 px-2 py-0.5 rounded-sm border border-red-200">
          {beforeLabel}
        </span>
        <div className="rounded-lg overflow-hidden border border-neutral-200 aspect-video bg-neutral-900">
          <img src={beforeUrl} alt={beforeLabel} className="object-cover w-full h-full" />
        </div>
      </div>

      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-success bg-green-50 px-2 py-0.5 rounded-sm border border-green-200">
          {afterLabel}
        </span>
        <div className="rounded-lg overflow-hidden border border-neutral-200 aspect-video bg-neutral-900">
          <img src={afterUrl} alt={afterLabel} className="object-cover w-full h-full" />
        </div>
      </div>
    </div>
  );
};
