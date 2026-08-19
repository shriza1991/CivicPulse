import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  return (
    <nav aria-label="Breadcrumb hierarchy navigation" className={cn('font-sans text-xs my-2', className)}>
      <ol className="flex items-center flex-wrap gap-1 text-neutral-700">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="inline-flex items-center gap-1">
              {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-neutral-300" aria-hidden="true" />}
              {isLast ? (
                <span className="font-semibold text-neutral-900" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="hover:text-primary-700 underline underline-offset-2 min-h-[36px] inline-flex items-center"
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
