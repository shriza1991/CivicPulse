import React from 'react';
import { cn } from '../../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label: string;
  description?: string;
  error?: string;
  showCharacterCount?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
  name,
  label,
  description,
  error,
  showCharacterCount = false,
  maxLength,
  value,
  defaultValue,
  required,
  disabled,
  rows = 4,
  className,
  id,
  ...props
}) => {
  const inputId = id || `textarea-${name}`;
  const errorId = `${inputId}-error`;
  const descId = `${inputId}-desc`;

  const currentLength = typeof value === 'string' ? value.length : typeof defaultValue === 'string' ? defaultValue.length : 0;

  return (
    <div className={cn('w-full space-y-1 font-sans', className)}>
      <div className="flex justify-between items-baseline">
        <label htmlFor={inputId} className="block text-sm font-medium text-neutral-900 select-none">
          {label}
          {required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
        </label>

        {showCharacterCount && maxLength && (
          <span className="text-xs text-neutral-700 font-mono" aria-live="polite">
            {currentLength}/{maxLength}
          </span>
        )}
      </div>

      {description && (
        <p id={descId} className="text-xs text-neutral-700">
          {description}
        </p>
      )}

      <textarea
        id={inputId}
        name={name}
        rows={rows}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        required={required}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [error ? errorId : null, description ? descId : null].filter(Boolean).join(' ') || undefined
        }
        className={cn(
          'w-full p-3.5 text-base text-neutral-900 bg-white border border-neutral-200 rounded-md transition-colors font-sans resize-y',
          'placeholder:text-neutral-700',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'disabled:bg-neutral-100 disabled:text-neutral-700 disabled:cursor-not-allowed',
          error && 'border-danger focus:ring-danger focus:border-danger'
        )}
        {...props}
      />

      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-danger mt-1">
          {error}
        </p>
      )}
    </div>
  );
};
