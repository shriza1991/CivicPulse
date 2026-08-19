import React from 'react';
import { Surface } from '../../primitives/foundation/Surface';
import { cn } from '../../../lib/utils';

export interface StatCardProps {
  label: string;
  value: string | number;
  sourceText?: string;
  dateRange?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  sourceText = 'Audited Civic Data',
  dateRange,
  className,
}) => {
  return (
    <Surface variant="card" elevation={1} className={cn('p-4 font-sans space-y-2', className)}>
      <p className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">{label}</p>
      <div className="text-3xl font-bold font-sans text-neutral-900 tracking-tight">{value}</div>

      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-700 font-mono">
        <span>{sourceText}</span>
        {dateRange && <span>{dateRange}</span>}
      </div>
    </Surface>
  );
};

export interface TrendCardProps {
  label: string;
  value: string | number;
  trendPercentage: number;
  isPositiveGood?: boolean;
  periodLabel?: string;
  className?: string;
}

export const TrendCard: React.FC<TrendCardProps> = ({
  label,
  value,
  trendPercentage,
  isPositiveGood = true,
  periodLabel = 'vs last 30 days',
  className,
}) => {
  const isRising = trendPercentage >= 0;
  const isGood = isRising ? isPositiveGood : !isPositiveGood;

  return (
    <Surface variant="card" elevation={1} className={cn('p-4 font-sans space-y-2', className)}>
      <p className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">{label}</p>
      <div className="flex items-baseline justify-between">
        <span className="text-3xl font-bold text-neutral-900 tracking-tight">{value}</span>
        <span
          className={cn(
            'inline-flex items-center px-2 py-0.5 rounded-pill text-xs font-mono font-bold',
            isGood ? 'bg-green-100 text-success' : 'bg-red-100 text-danger'
          )}
        >
          {isRising ? `+${trendPercentage}%` : `${trendPercentage}%`}
        </span>
      </div>

      <p className="text-[11px] text-neutral-700 font-mono">{periodLabel}</p>
    </Surface>
  );
};
