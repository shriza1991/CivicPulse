import React from 'react';
import { cn } from '../../../lib/utils';
import type { ColorTone } from '../../tokens';

export interface ProgressProps {
  value?: number; // 0 to 100 for determinate; undefined for indeterminate
  label?: string;
  tone?: ColorTone;
  showPercentage?: boolean;
  className?: string;
}

const toneBgMap: Record<ColorTone, string> = {
  default: 'bg-primary-700',
  muted: 'bg-neutral-700',
  primary: 'bg-primary-700',
  evidence: 'bg-evidence',
  government: 'bg-government',
  community: 'bg-community',
  ai: 'bg-ai',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

export const Progress: React.FC<ProgressProps> = ({
  value,
  label = 'Operation in progress',
  tone = 'primary',
  showPercentage = false,
  className,
}) => {
  const isIndeterminate = value === undefined || value === null;
  const clampedValue = isIndeterminate ? 0 : Math.min(100, Math.max(0, value));

  return (
    <div className={cn('w-full font-sans', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1 text-xs font-medium text-neutral-700">
          <span>{label}</span>
          {!isIndeterminate && showPercentage && <span>{Math.round(clampedValue)}%</span>}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : Math.round(clampedValue)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="w-full h-2 bg-neutral-200 rounded-pill overflow-hidden relative"
      >
        {isIndeterminate ? (
          <div
            className={cn('h-full w-1/3 rounded-pill animate-pulse', toneBgMap[tone])}
            style={{ animationDuration: '1.5s' }}
          />
        ) : (
          <div
            className={cn('h-full rounded-pill transition-all duration-base', toneBgMap[tone])}
            style={{ width: `${clampedValue}%` }}
          />
        )}
      </div>
    </div>
  );
};
