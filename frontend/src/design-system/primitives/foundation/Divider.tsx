import React from 'react';
import { cn } from '../../../lib/utils';
import type { ColorTone } from '../../tokens';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  tone?: ColorTone;
  inset?: boolean;
}

const toneBorderClasses: Record<ColorTone, string> = {
  default: 'border-neutral-200',
  muted: 'border-neutral-200',
  primary: 'border-primary-500/30',
  evidence: 'border-evidence/30',
  government: 'border-government/30',
  community: 'border-community/30',
  ai: 'border-ai/30',
  success: 'border-success/30',
  warning: 'border-warning/30',
  danger: 'border-danger/30',
};

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  tone = 'default',
  inset = false,
  className,
  ...props
}) => {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        isHorizontal ? 'w-full border-b' : 'h-full border-r inline-block self-stretch',
        toneBorderClasses[tone],
        inset && (isHorizontal ? 'mx-4 w-[calc(100%-2rem)]' : 'my-2'),
        className
      )}
      {...props}
    />
  );
};
