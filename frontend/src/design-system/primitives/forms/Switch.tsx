import React from 'react';
import { cn } from '../../../lib/utils';

export interface SwitchProps {
  id?: string;
  name?: string;
  label: string;
  description?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  id,
  name,
  label,
  description,
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  className,
}) => {
  const switchId = id || `switch-${name || label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <label
      htmlFor={switchId}
      className={cn(
        'inline-flex items-center justify-between gap-4 w-full min-h-[48px] p-2 rounded-md cursor-pointer select-none hover:bg-neutral-50 transition-colors',
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
    >
      <div className="flex flex-col">
        <span className="text-sm font-medium text-neutral-900">{label}</span>
        {description && <span className="text-xs text-neutral-700">{description}</span>}
      </div>

      <div className="relative flex items-center">
        <input
          type="checkbox"
          role="switch"
          id={switchId}
          name={name}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          aria-checked={checked}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-neutral-300 rounded-pill transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2 peer-checked:bg-primary-700">
          <div className="w-5 h-5 bg-white rounded-pill shadow-subtle transform transition-transform translate-x-0.5 translate-y-0.5 peer-checked:translate-x-5.5" />
        </div>
      </div>
    </label>
  );
};
