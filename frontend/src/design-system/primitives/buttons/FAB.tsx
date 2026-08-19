import React from 'react';
import { Camera, Plus } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface FABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  expanded?: boolean;
  isShutter?: boolean; // 72px camera shutter target mode
  icon?: React.ReactNode;
}

export const FAB: React.FC<FABProps> = ({
  label = 'Report Issue',
  expanded = true,
  isShutter = false,
  icon,
  className,
  onClick,
  ...props
}) => {
  const IconComponent = icon || (isShutter ? <Camera className="w-8 h-8" aria-hidden="true" /> : <Plus className="w-6 h-6" aria-hidden="true" />);

  if (isShutter) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={label || 'Take Evidence Photo'}
        className={cn(
          'min-w-[72px] min-h-[72px] rounded-pill bg-primary-700 hover:bg-primary-500 text-white shadow-premium flex items-center justify-center border-4 border-white active:scale-95 transition-transform duration-fast focus-visible:ring-4 focus-visible:ring-primary-500',
          className
        )}
        {...props}
      >
        {IconComponent}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'min-h-[48px] rounded-pill bg-primary-700 hover:bg-primary-500 text-white font-semibold shadow-premium flex items-center justify-center px-4 gap-2 transition-all duration-fast active:scale-95 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        !expanded && 'px-3 min-w-[48px]',
        className
      )}
      {...props}
    >
      <span className="shrink-0">{IconComponent}</span>
      {expanded && <span className="text-base tracking-wide whitespace-nowrap">{label}</span>}
    </button>
  );
};
