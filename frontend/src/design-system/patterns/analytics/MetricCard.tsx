import React from 'react';
import { Surface } from '../../primitives/foundation/Surface';
import { Info } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface MetricCardProps {
  title: string;
  metricValue: string;
  denominatorText?: string;
  methodologyNote: string;
  sampleSize?: number;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  metricValue,
  denominatorText,
  methodologyNote,
  sampleSize,
  className,
}) => {
  return (
    <Surface variant="card" elevation={1} className={cn('p-4 font-sans space-y-3', className)}>
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-700">{title}</h4>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl font-bold text-neutral-900 font-sans tracking-tight">{metricValue}</span>
          {denominatorText && <span className="text-xs font-mono text-neutral-700">/ {denominatorText}</span>}
        </div>
      </div>

      <div className="p-2.5 bg-neutral-50 rounded-md border border-neutral-200 text-xs text-neutral-700 space-y-1">
        <div className="flex items-center gap-1 font-semibold text-neutral-900">
          <Info className="w-3.5 h-3.5 text-primary-700" /> Methodology Note
        </div>
        <p className="leading-snug">{methodologyNote}</p>
        {sampleSize !== undefined && (
          <p className="font-mono text-[11px] pt-1">Audited Sample Size: N = {sampleSize}</p>
        )}
      </div>
    </Surface>
  );
};
