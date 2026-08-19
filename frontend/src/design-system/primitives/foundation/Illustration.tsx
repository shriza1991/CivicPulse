import React from 'react';
import { cn } from '../../../lib/utils';

export type IllustrationVariant = 'empty' | 'offline' | 'error' | 'resolved' | 'how-it-works';

export interface IllustrationProps extends React.SVGAttributes<SVGSVGElement> {
  variant?: IllustrationVariant;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const sizeDimensions: Record<'sm' | 'md' | 'lg', number> = {
  sm: 96,
  md: 144,
  lg: 200,
};

export const Illustration: React.FC<IllustrationProps> = ({
  variant = 'empty',
  size = 'md',
  label,
  className,
  ...props
}) => {
  const px = sizeDimensions[size];
  const isDecorative = !label;

  const renderContent = () => {
    switch (variant) {
      case 'offline':
        return (
          <g>
            <circle cx="72" cy="72" r="60" fill="#F4F4F5" />
            <path
              d="M48 60C48 53.3726 53.3726 48 60 48H84C90.6274 48 96 53.3726 96 60V84C96 90.6274 90.6274 96 84 96H60C53.3726 96 48 90.6274 48 84V60Z"
              fill="#E4E4E7"
            />
            <path
              d="M40 40L104 104"
              stroke="#64748B"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle cx="72" cy="72" r="12" fill="#D97706" />
          </g>
        );

      case 'error':
        return (
          <g>
            <circle cx="72" cy="72" r="60" fill="#FEF2F2" />
            <path
              d="M72 40V80M72 96H72.01"
              stroke="#B91C1C"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        );

      case 'resolved':
        return (
          <g>
            <circle cx="72" cy="72" r="60" fill="#F0FDF4" />
            <circle cx="72" cy="72" r="44" fill="#15803D" />
            <path
              d="M52 72L66 86L92 56"
              stroke="#FFFFFF"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        );

      case 'how-it-works':
        return (
          <g>
            <circle cx="72" cy="72" r="60" fill="#F0FDFA" />
            <rect x="42" y="42" width="60" height="60" rx="8" fill="#0D9488" />
            <path
              d="M54 58H90M54 72H80M54 86H70"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        );

      case 'empty':
      default:
        return (
          <g>
            <circle cx="72" cy="72" r="60" fill="#F4F4F5" />
            <rect x="44" y="44" width="56" height="56" rx="8" fill="#E4E4E7" />
            <circle cx="72" cy="72" r="16" stroke="#64748B" strokeWidth="4" fill="none" />
            <path d="M84 84L96 96" stroke="#64748B" strokeWidth="6" strokeLinecap="round" />
          </g>
        );
    }
  };

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 144 144"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={isDecorative}
      aria-label={label}
      role={!isDecorative ? 'img' : undefined}
      className={cn('select-none shrink-0', className)}
      {...props}
    >
      {renderContent()}
    </svg>
  );
};
