import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../../lib/utils';

export interface SplitMenuItem {
  id: string;
  label: string;
  onSelect: () => void;
  disabled?: boolean;
}

export interface SplitButtonProps {
  primaryLabel: string;
  onPrimaryClick: () => void;
  items: SplitMenuItem[];
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const SplitButton: React.FC<SplitButtonProps> = ({
  primaryLabel,
  onPrimaryClick,
  items,
  variant = 'primary',
  loading = false,
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        setActiveIndex(0);
        e.preventDefault();
      }
      return;
    }

    if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    } else if (e.key === 'ArrowDown') {
      setActiveIndex((prev) => (prev + 1) % items.length);
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
      e.preventDefault();
    } else if (e.key === 'Enter' && activeIndex >= 0 && items[activeIndex]) {
      items[activeIndex].onSelect();
      setIsOpen(false);
      e.preventDefault();
    }
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={cn('inline-flex items-center rounded-md shadow-subtle relative', className)}
    >
      <Button
        variant={variant}
        loading={loading}
        disabled={disabled}
        onClick={onPrimaryClick}
        className="rounded-r-none border-r border-white/20"
      >
        {primaryLabel}
      </Button>

      <button
        type="button"
        disabled={disabled || loading}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="More action options"
        className={cn(
          'min-h-[48px] min-w-[44px] px-2 flex items-center justify-center rounded-r-md transition-colors border-l border-white/20 outline-none',
          variant === 'primary' && 'bg-primary-700 hover:bg-primary-500 text-white',
          variant === 'secondary' && 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900',
          variant === 'danger' && 'bg-danger-base hover:bg-red-700 text-white',
          'focus-visible:ring-2 focus-visible:ring-primary-500'
        )}
      >
        <ChevronDown className="w-5 h-5" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute top-full right-0 mt-1 w-56 rounded-md bg-white border border-neutral-200 shadow-modal z-50 py-1 animate-fade"
        >
          {items.map((item, index) => (
            <button
              key={item.id}
              role="menuitem"
              disabled={item.disabled}
              onClick={() => {
                item.onSelect();
                setIsOpen(false);
              }}
              className={cn(
                'w-full text-left px-4 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-100 min-h-[44px] flex items-center transition-colors',
                activeIndex === index && 'bg-neutral-100 text-primary-700',
                item.disabled && 'opacity-40 pointer-events-none'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
