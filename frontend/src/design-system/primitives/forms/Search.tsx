import React, { useState } from 'react';
import { Search as SearchIcon, X, Loader2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface SearchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  onSearchChange?: (query: string) => void;
  onClear?: () => void;
  loading?: boolean;
  suggestions?: React.ReactNode;
}

export const Search: React.FC<SearchProps> = ({
  label = 'Search civic reports or localities',
  onSearchChange,
  onClear,
  loading = false,
  suggestions,
  value,
  defaultValue,
  className,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState((value || defaultValue || '') as string);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalValue(val);
    onSearchChange?.(val);
  };

  const handleClear = () => {
    setInternalValue('');
    onSearchChange?.('');
    onClear?.();
  };

  return (
    <div className={cn('relative w-full font-sans', className)}>
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-neutral-700 pointer-events-none flex items-center justify-center">
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-primary-700" aria-hidden="true" />
          ) : (
            <SearchIcon className="w-5 h-5" aria-hidden="true" />
          )}
        </div>

        <input
          type="search"
          role="searchbox"
          aria-label={label}
          value={value !== undefined ? value : internalValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className={cn(
            'w-full min-h-[48px] pl-11 pr-10 text-base text-neutral-900 bg-white border border-neutral-200 rounded-md transition-colors font-sans',
            'placeholder:text-neutral-700',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
          )}
          {...props}
        />

        {internalValue && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search text"
            className="absolute right-2.5 p-1 rounded-pill text-neutral-700 hover:bg-neutral-100 min-w-[40px] min-h-[40px] inline-flex items-center justify-center"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {isFocused && suggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-md shadow-modal z-50 p-2 max-h-60 overflow-y-auto animate-fade">
          {suggestions}
        </div>
      )}
    </div>
  );
};
