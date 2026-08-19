import React from 'react';
import { cn } from '../../../lib/utils';

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  description?: string;
  error?: string;
  leadingSlot?: React.ReactNode;
  trailingSlot?: React.ReactNode;
}

export const TextField: React.FC<TextFieldProps> = ({
  name,
  label,
  description,
  error,
  leadingSlot,
  trailingSlot,
  required,
  disabled,
  className,
  id,
  ...props
}) => {
  const inputId = id || `field-${name}`;
  const errorId = `${inputId}-error`;
  const descId = `${inputId}-desc`;

  return (
    <div className={cn('w-full space-y-1 font-sans', className)}>
      <label htmlFor={inputId} className="block text-sm font-medium text-neutral-900 select-none">
        {label}
        {required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
      </label>

      {description && (
        <p id={descId} className="text-xs text-neutral-700">
          {description}
        </p>
      )}

      <div className="relative flex items-center">
        {leadingSlot && (
          <div className="absolute left-3 text-neutral-700 pointer-events-none flex items-center justify-center">
            {leadingSlot}
          </div>
        )}

        <input
          id={inputId}
          name={name}
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [error ? errorId : null, description ? descId : null].filter(Boolean).join(' ') || undefined
          }
          className={cn(
            'w-full min-h-[48px] px-3.5 text-base text-neutral-900 bg-white border border-neutral-200 rounded-md transition-colors font-sans',
            'placeholder:text-neutral-700',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'disabled:bg-neutral-100 disabled:text-neutral-700 disabled:cursor-not-allowed',
            error && 'border-danger focus:ring-danger focus:border-danger',
            leadingSlot && 'pl-10',
            trailingSlot && 'pr-10'
          )}
          {...props}
        />

        {trailingSlot && (
          <div className="absolute right-3 text-neutral-700 flex items-center justify-center">
            {trailingSlot}
          </div>
        )}
      </div>

      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-danger mt-1">
          {error}
        </p>
      )}
    </div>
  );
};
