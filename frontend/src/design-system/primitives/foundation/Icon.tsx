import React from 'react';
import * as LucideIcons from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { ColorTone } from '../../tokens';

export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

export interface IconProps extends Omit<React.HTMLAttributes<SVGElement>, 'onClick'> {
  name: keyof typeof LucideIcons | React.ComponentType<{ className?: string; size?: number | string }>;
  size?: IconSize;
  tone?: ColorTone;
  label?: string;
  decorative?: boolean;
  interactive?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement | SVGElement>;
}

const sizePixels: Record<IconSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

const toneClasses: Record<ColorTone, string> = {
  default: 'text-neutral-900',
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

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  tone = 'default',
  label,
  decorative = true,
  interactive = false,
  className,
  onClick,
  ...props
}) => {
  const IconComponent = typeof name === 'string'
    ? (LucideIcons[name as keyof typeof LucideIcons] as React.ComponentType<{ className?: string; size?: number | string }>)
    : name;

  const px = sizePixels[size];

  if (!IconComponent) {
    console.warn(`[Icon] Lucide icon "${String(name)}" not found.`);
    return null;
  }

  const svgElement = (
    <IconComponent
      size={px}
      className={cn(toneClasses[tone], className)}
      aria-hidden={decorative ? true : undefined}
      aria-label={!decorative && label ? label : undefined}
      role={!decorative && label ? 'img' : undefined}
      {...props}
    />
  );

  if (interactive || onClick) {
    return (
      <button
        type="button"
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
        className="inline-flex items-center justify-center min-w-[48px] min-h-[48px] p-2 rounded-pill hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors"
        aria-label={label || 'Interactive icon'}
      >
        {svgElement}
      </button>
    );
  }

  return svgElement;
};
