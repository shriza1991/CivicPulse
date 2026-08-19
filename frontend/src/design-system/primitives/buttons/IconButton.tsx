import React, { useState } from 'react';
import { cn } from '../../../lib/utils';
import type { ColorTone } from '../../tokens';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string; // Mandatory accessible label
  tone?: ColorTone;
  tooltip?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'min-w-[40px] min-h-[40px] p-2',
  md: 'min-w-[48px] min-h-[48px] p-3', // Standard 48px target
  lg: 'min-w-[56px] min-h-[56px] p-4',
};

const toneClasses: Record<ColorTone, string> = {
  default: 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100',
  muted: 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100',
  primary: 'text-primary-700 hover:bg-primary-500/10',
  evidence: 'text-evidence hover:bg-evidence/10',
  government: 'text-government hover:bg-government/10',
  community: 'text-community hover:bg-community/10',
  ai: 'text-ai hover:bg-ai/10',
  success: 'text-success hover:bg-success/10',
  warning: 'text-warning hover:bg-warning/10',
  danger: 'text-danger hover:bg-danger/10',
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  tone = 'default',
  tooltip,
  size = 'md',
  disabled,
  className,
  ...props
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipText = tooltip || label;

  return (
    <div className="relative inline-flex items-center justify-center">
      <button
        type="button"
        aria-label={label}
        disabled={disabled}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className={cn(
          'inline-flex items-center justify-center rounded-pill transition-colors duration-fast outline-none select-none',
          'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          'disabled:opacity-40 disabled:pointer-events-none',
          sizeClasses[size],
          toneClasses[tone],
          className
        )}
        {...props}
      >
        {icon}
      </button>

      {showTooltip && (
        <div
          role="tooltip"
          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 px-2.5 py-1 text-xs font-medium text-white bg-neutral-900 rounded-sm shadow-subtle whitespace-nowrap pointer-events-none animate-fade"
        >
          {tooltipText}
        </div>
      )}
    </div>
  );
};
