import React from 'react';
import { cn } from '../../../lib/utils';

export interface TimelineProps {
  children: React.ReactNode;
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ children, className }) => {
  return (
    <ol
      aria-label="Case event timeline narrative"
      className={cn('relative border-l-2 border-neutral-200 ml-4 space-y-6 my-4 font-sans', className)}
    >
      {children}
    </ol>
  );
};
