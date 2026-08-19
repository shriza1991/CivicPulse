import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label: string;
  options: SelectOption[];
  description?: string;
  error?: string;
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  name,
  label,
  options,
  description,
  error,
  placeholder = 'Select an option...',
  required,
  disabled,
  className,
  id,
  value,
  defaultValue,
  ...props
}) => {
  const inputId = id || `select-${name}`;
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
        <select
          id={inputId}
          name={name}
          value={value}
          defaultValue={defaultValue}
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [error ? errorId : null, description ? descId : null].filter(Boolean).join(' ') || undefined
          }
          className={cn(
            'w-full min-h-[48px] px-3.5 pr-10 text-base text-neutral-900 bg-white border border-neutral-200 rounded-md appearance-none font-sans transition-colors cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'disabled:bg-neutral-100 disabled:text-neutral-700 disabled:cursor-not-allowed',
            error && 'border-danger focus:ring-danger focus:border-danger'
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}

          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute right-3 pointer-events-none text-neutral-700">
          <ChevronDown className="w-5 h-5" aria-hidden="true" />
        </div>
      </div>

      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-danger mt-1">
          {error}
        </p>
      )}
    </div>
  );
};
