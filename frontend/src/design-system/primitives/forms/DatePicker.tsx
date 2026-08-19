import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  description?: string;
  error?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  name,
  label,
  description,
  error,
  required,
  disabled,
  className,
  id,
  ...props
}) => {
  const inputId = id || `date-${name}`;

  return (
    <div className={cn('w-full space-y-1 font-sans', className)}>
      <label htmlFor={inputId} className="block text-sm font-medium text-neutral-900 select-none">
        {label}
        {required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
      </label>

      {description && <p className="text-xs text-neutral-700">{description}</p>}

      <div className="relative flex items-center">
        <input
          id={inputId}
          name={name}
          type="date"
          required={required}
          disabled={disabled}
          className={cn(
            'w-full min-h-[48px] px-3.5 pl-10 text-base text-neutral-900 bg-white border border-neutral-200 rounded-md font-sans transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'disabled:bg-neutral-100 disabled:text-neutral-700 disabled:cursor-not-allowed',
            error && 'border-danger focus:ring-danger'
          )}
          {...props}
        />
        <Calendar className="w-5 h-5 text-neutral-700 absolute left-3 pointer-events-none" />
      </div>

      {error && <p role="alert" className="text-xs font-medium text-danger mt-1">{error}</p>}
    </div>
  );
};

export interface TimePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  description?: string;
  error?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  name,
  label,
  description,
  error,
  required,
  disabled,
  className,
  id,
  ...props
}) => {
  const inputId = id || `time-${name}`;

  return (
    <div className={cn('w-full space-y-1 font-sans', className)}>
      <label htmlFor={inputId} className="block text-sm font-medium text-neutral-900 select-none">
        {label}
        {required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
      </label>

      {description && <p className="text-xs text-neutral-700">{description}</p>}

      <div className="relative flex items-center">
        <input
          id={inputId}
          name={name}
          type="time"
          required={required}
          disabled={disabled}
          className={cn(
            'w-full min-h-[48px] px-3.5 pl-10 text-base text-neutral-900 bg-white border border-neutral-200 rounded-md font-sans transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'disabled:bg-neutral-100 disabled:text-neutral-700 disabled:cursor-not-allowed',
            error && 'border-danger focus:ring-danger'
          )}
          {...props}
        />
        <Clock className="w-5 h-5 text-neutral-700 absolute left-3 pointer-events-none" />
      </div>

      {error && <p role="alert" className="text-xs font-medium text-danger mt-1">{error}</p>}
    </div>
  );
};
