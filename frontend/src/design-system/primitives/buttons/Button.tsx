import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-700 hover:bg-primary-500 text-white font-medium shadow-subtle hover:shadow-premium active:scale-[0.99]',
  secondary:
    'bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200 font-medium active:scale-[0.99]',
  tertiary:
    'bg-transparent hover:bg-neutral-100 text-primary-700 font-medium underline underline-offset-4',
  danger:
    'bg-danger-base hover:bg-red-700 text-white font-medium shadow-subtle hover:shadow-premium active:scale-[0.99]',
  ghost:
    'bg-transparent hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900 font-medium',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-[40px] px-3 py-1.5 text-sm rounded-md gap-1.5',
  md: 'min-h-[48px] px-4 py-2.5 text-base rounded-md gap-2', // 48px standard touch target
  lg: 'min-h-[56px] px-6 py-3.5 text-lg rounded-lg gap-2.5',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText,
  leadingIcon,
  trailingIcon,
  fullWidth = false,
  disabled,
  className,
  onClick,
  children,
  ...props
}) => {
  const isButtonDisabled = disabled || loading;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isButtonDisabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      type="button"
      disabled={isButtonDisabled}
      onClick={handleClick}
      aria-busy={loading ? true : undefined}
      className={cn(
        'inline-flex items-center justify-center select-none outline-none transition-all duration-fast shrink-0',
        'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:shadow-none',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin shrink-0" aria-hidden="true" />
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          {leadingIcon && <span className="shrink-0">{leadingIcon}</span>}
          <span>{children}</span>
          {trailingIcon && <span className="shrink-0">{trailingIcon}</span>}
        </>
      )}
    </button>
  );
};
