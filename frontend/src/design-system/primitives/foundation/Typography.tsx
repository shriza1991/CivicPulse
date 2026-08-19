import React from 'react';
import { cn } from '../../../lib/utils';
import type { ColorTone } from '../../tokens';

export type TypographyVariant = 'display' | 'heading' | 'subheading' | 'body' | 'caption' | 'label' | 'mono';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  as?: React.ElementType;
  tone?: ColorTone;
  truncate?: boolean;
  children: React.ReactNode;
}

const defaultElementMap: Record<TypographyVariant, React.ElementType> = {
  display: 'h1',
  heading: 'h2',
  subheading: 'h3',
  body: 'p',
  caption: 'span',
  label: 'label',
  mono: 'code',
};

const variantClasses: Record<TypographyVariant, string> = {
  display: 'font-sans text-[28px] md:text-[32px] font-bold leading-[1.2] tracking-tight',
  heading: 'font-sans text-[20px] md:text-[24px] font-semibold leading-[1.3]',
  subheading: 'font-sans text-[18px] font-medium leading-[1.4]',
  body: 'font-sans text-[16px] font-normal leading-[1.5]',
  caption: 'font-sans text-[14px] font-normal leading-[1.4]', // 14px absolute floor
  label: 'font-sans text-[14px] font-medium leading-[1.4] select-none',
  mono: 'font-mono text-[14px] font-medium tracking-tight',
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

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  as,
  tone = 'default',
  truncate = false,
  className,
  children,
  ...props
}) => {
  const Component = as || defaultElementMap[variant];

  return (
    <Component
      className={cn(
        variantClasses[variant],
        toneClasses[tone],
        truncate && 'truncate max-w-full',
        'break-words', // Ensure Indic scripts and long copy wrap smoothly
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
