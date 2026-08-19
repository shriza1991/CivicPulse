import React, { useState, useRef, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface AutocompleteItem {
  id: string;
  label: string;
  description?: string;
}

export interface AutocompleteProps {
  name: string;
  label: string;
  items: AutocompleteItem[];
  value?: string;
  onSelect: (item: AutocompleteItem) => void;
  onQueryChange?: (query: string) => void;
  loading?: boolean;
  placeholder?: string;
  error?: string;
  className?: string;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  name,
  label,
  items,
  value,
  onSelect,
  onQueryChange,
  loading = false,
  placeholder = 'Type to search...',
  error,
  className,
}) => {
  const [query, setQuery] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    onQueryChange?.(q);
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && e.key === 'ArrowDown') {
      setIsOpen(true);
      return;
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      setHighlightedIndex((prev) => (prev + 1) % items.length);
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex((prev) => (prev - 1 + items.length) % items.length);
      e.preventDefault();
    } else if (e.key === 'Enter' && highlightedIndex >= 0 && items[highlightedIndex]) {
      const selected = items[highlightedIndex];
      setQuery(selected.label);
      onSelect(selected);
      setIsOpen(false);
      e.preventDefault();
    }
  };

  return (
    <div ref={containerRef} className={cn('relative w-full font-sans space-y-1', className)}>
      <label htmlFor={`auto-${name}`} className="block text-sm font-medium text-neutral-900 select-none">
        {label}
      </label>

      <div className="relative flex items-center">
        <input
          id={`auto-${name}`}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'w-full min-h-[48px] px-3.5 pr-10 text-base text-neutral-900 bg-white border border-neutral-200 rounded-md font-sans transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            error && 'border-danger'
          )}
        />

        <div className="absolute right-3 text-neutral-700 pointer-events-none">
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-primary-700" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>
      </div>

      {isOpen && items.length > 0 && (
        <ul
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-md shadow-modal z-50 py-1 max-h-60 overflow-y-auto animate-fade"
        >
          {items.map((item, index) => (
            <li
              key={item.id}
              role="option"
              aria-selected={highlightedIndex === index}
              onClick={() => {
                setQuery(item.label);
                onSelect(item);
                setIsOpen(false);
              }}
              className={cn(
                'px-4 py-2.5 text-sm cursor-pointer min-h-[44px] flex flex-col justify-center transition-colors',
                highlightedIndex === index ? 'bg-neutral-100 text-primary-700 font-medium' : 'text-neutral-900 hover:bg-neutral-50'
              )}
            >
              <span>{item.label}</span>
              {item.description && <span className="text-xs text-neutral-700">{item.description}</span>}
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-xs font-medium text-danger">{error}</p>}
    </div>
  );
};
