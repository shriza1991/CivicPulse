import React, { useEffect, useRef } from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
  indeterminate?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  name,
  label,
  description,
  checked,
  defaultChecked,
  indeterminate = false,
  disabled,
  className,
  onChange,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = id || `checkbox-${name || label.toLowerCase().replace(/\s+/g, '-')}`;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label
      htmlFor={inputId}
      className={cn(
        'inline-flex items-start gap-3 min-h-[48px] p-2 rounded-md select-none cursor-pointer group hover:bg-neutral-50 transition-colors',
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
    >
      <div className="relative flex items-center justify-center mt-0.5">
        <input
          ref={inputRef}
          type="checkbox"
          id={inputId}
          name={name}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={onChange}
          className="sr-only peer"
          {...props}
        />
        <div
          className={cn(
            'w-5 h-5 rounded-sm border-2 border-neutral-300 bg-white transition-all flex items-center justify-center',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2',
            'peer-checked:bg-primary-700 peer-checked:border-primary-700 text-white',
            indeterminate && 'bg-primary-700 border-primary-700 text-white'
          )}
        >
          {indeterminate ? (
            <Minus className="w-3.5 h-3.5 stroke-[3]" aria-hidden="true" />
          ) : (
            <Check className="w-3.5 h-3.5 stroke-[3] opacity-0 peer-checked:opacity-100 transition-opacity" aria-hidden="true" />
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <span className="text-sm font-medium text-neutral-900 group-hover:text-primary-700 transition-colors">
          {label}
        </span>
        {description && <span className="text-xs text-neutral-700 mt-0.5">{description}</span>}
      </div>
    </label>
  );
};
