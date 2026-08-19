import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { ColorTone } from '../../tokens';

export interface LoadingIndicatorProps {
  label?: string;
  variant?: 'spinner' | 'dots' | 'step';
  size?: 'sm' | 'md' | 'lg';
  tone?: ColorTone;
  className?: string;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
};

const toneClasses: Record<ColorTone, string> = {
  default: 'text-neutral-700',
  muted: 'text-neutral-700',
  primary: 'text-primary-700',
  evidence: 'text-evidence',
  government: 'text-government',
  community: 'text-community',
  ai: 'text-ai',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
};

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  label = 'Loading content...',
  variant = 'spinner',
  size = 'md',
  tone = 'primary',
  className,
}) => {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label}
      className={cn('inline-flex items-center gap-2 select-none font-sans text-sm', className)}
    >
      {variant === 'dots' ? (
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-pill bg-primary-700 animate-ping" />
          <span className="w-2 h-2 rounded-pill bg-primary-700 animate-ping delay-150" />
          <span className="w-2 h-2 rounded-pill bg-primary-700 animate-ping delay-300" />
        </div>
      ) : (
        <Loader2 className={cn('animate-spin shrink-0', sizeMap[size], toneClasses[tone])} aria-hidden="true" />
      )}
      {label && <span className="text-neutral-700 font-medium">{label}</span>}
    </div>
  );
};
