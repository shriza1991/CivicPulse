import React from 'react';
import { cn } from '../../../lib/utils';

export type SurfaceVariant = 'page' | 'card' | 'inset' | 'dialog' | 'sheet' | 'interactive';
export type ElevationLevel = 0 | 1 | 2 | 3;
export type RadiusSize = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'pill';

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SurfaceVariant;
  elevation?: ElevationLevel;
  radius?: RadiusSize;
  bordered?: boolean;
  interactive?: boolean;
  children: React.ReactNode;
}

const variantDefaults: Record<SurfaceVariant, { elevation: ElevationLevel; radius: RadiusSize; bordered: boolean }> = {
  page: { elevation: 0, radius: 'none', bordered: false },
  card: { elevation: 1, radius: 'md', bordered: true },
  inset: { elevation: 0, radius: 'sm', bordered: true },
  dialog: { elevation: 3, radius: 'lg', bordered: true },
  sheet: { elevation: 2, radius: 'xl', bordered: false },
  interactive: { elevation: 1, radius: 'md', bordered: true },
};

const elevationClasses: Record<ElevationLevel, string> = {
  0: 'shadow-none',
  1: 'shadow-subtle',
  2: 'shadow-premium',
  3: 'shadow-modal',
};

const radiusClasses: Record<RadiusSize, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-t-xl rounded-b-none',
  pill: 'rounded-pill',
};

export const Surface: React.FC<SurfaceProps> = ({
  variant = 'card',
  elevation,
  radius,
  bordered,
  interactive,
  className,
  children,
  ...props
}) => {
  const defaults = variantDefaults[variant];
  const activeElevation = elevation ?? defaults.elevation;
  const activeRadius = radius ?? defaults.radius;
  const isBordered = bordered ?? defaults.bordered;
  const isInteractive = interactive || variant === 'interactive';

  return (
    <div
      className={cn(
        'bg-white text-neutral-900 transition-shadow transition-colors duration-fast',
        elevationClasses[activeElevation],
        radiusClasses[activeRadius],
        isBordered && 'border border-neutral-200',
        variant === 'page' && 'bg-neutral-50',
        variant === 'inset' && 'bg-neutral-100',
        isInteractive && 'cursor-pointer hover:border-neutral-300 hover:shadow-premium active:shadow-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
