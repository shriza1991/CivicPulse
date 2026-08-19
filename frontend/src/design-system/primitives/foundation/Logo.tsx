import React from 'react';
import { cn } from '../../../lib/utils';

export type LogoVariant = 'full' | 'mark' | 'monochrome' | 'reversed';

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: LogoVariant;
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  label?: string;
}

const sizeHeights: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-6',
  md: 'h-8',
  lg: 'h-10',
};

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  href = '/',
  label = 'Nivaran home',
  className,
  ...props
}) => {
  const isMarkOnly = variant === 'mark';
  const isReversed = variant === 'reversed';
  const isMonochrome = variant === 'monochrome';

  const markColor = isReversed
    ? '#FFFFFF'
    : isMonochrome
    ? 'currentColor'
    : '#0D9488'; // Primary 500 Teal

  const textColor = isReversed
    ? '#FFFFFF'
    : isMonochrome
    ? 'currentColor'
    : '#18181B'; // Neutral 900

  const badgeColor = isReversed
    ? 'rgba(255,255,255,0.2)'
    : '#1E3A8A'; // Indigo Government

  const logoSvg = (
    <div
      className={cn('inline-flex items-center gap-2 select-none', sizeHeights[size], className)}
      {...props}
    >
      {/* Nivaran Emblem SVG */}
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('h-full w-auto shrink-0')}
        aria-hidden="true"
      >
        <rect width="36" height="36" rx="8" fill={markColor} />
        {/* Shield / Evidence Beacon Symbol */}
        <path
          d="M18 6L9 10.5V17.5C9 23.5 13 28.5 18 30C23 28.5 27 23.5 27 17.5V10.5L18 6Z"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="18" cy="17" r="3" fill="#FFFFFF" />
      </svg>

      {!isMarkOnly && (
        <div className="flex flex-col justify-center leading-none">
          <span
            className="font-sans font-bold tracking-tight text-[1.1em]"
            style={{ color: textColor }}
          >
            Niv<span style={{ color: markColor }}>aran</span>
          </span>
          <span
            className="text-[0.55em] font-semibold uppercase tracking-widest mt-0.5"
            style={{ color: badgeColor }}
          >
            AI Civic Governance Platform
          </span>
        </div>
      )}
    </div>
  );


  if (href) {
    return (
      <a
        href={href}
        className="inline-flex items-center rounded-sm focus-visible:ring-2 focus-visible:ring-primary-500 transition-opacity hover:opacity-90 min-h-[48px] px-1"
        aria-label={label}
      >
        {logoSvg}
      </a>
    );
  }

  return logoSvg;
};
