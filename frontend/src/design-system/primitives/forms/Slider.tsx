import React from 'react';
import { cn } from '../../../lib/utils';

export interface SliderProps {
  name: string;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (val: number) => void;
  outputFormat?: (val: number) => string;
  disabled?: boolean;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  name,
  label,
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = 50,
  onChange,
  outputFormat,
  disabled = false,
  className,
}) => {
  const currentVal = value !== undefined ? value : defaultValue;
  const formattedOutput = outputFormat ? outputFormat(currentVal) : currentVal.toString();

  return (
    <div className={cn('w-full space-y-2 font-sans', className)}>
      <div className="flex justify-between items-center text-sm font-medium text-neutral-900 select-none">
        <label htmlFor={`slider-${name}`}>{label}</label>
        <span className="font-mono text-xs text-primary-700 bg-primary-500/10 px-2 py-0.5 rounded-sm">
          {formattedOutput}
        </span>
      </div>

      <div className="relative flex items-center min-h-[48px]">
        <input
          id={`slider-${name}`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className={cn(
            'w-full h-2 bg-neutral-200 rounded-pill appearance-none cursor-pointer outline-none',
            'accent-primary-700 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        />
      </div>
    </div>
  );
};
