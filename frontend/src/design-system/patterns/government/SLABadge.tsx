import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface SLABadgeProps {
  hoursRemaining: number;
  label?: string;
  className?: string;
}

export const SLABadge: React.FC<SLABadgeProps> = ({ hoursRemaining, label, className }) => {
  const isOverdue = hoursRemaining <= 0;
  const isUrgent = hoursRemaining > 0 && hoursRemaining <= 24;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill font-mono text-xs font-semibold select-none',
        isOverdue
          ? 'bg-red-100 text-danger border border-red-200'
          : isUrgent
          ? 'bg-amber-100 text-amber-900 border border-amber-200'
          : 'bg-neutral-100 text-neutral-700 border border-neutral-200',
        className
      )}
    >
      {isOverdue ? <AlertTriangle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
      <span>
        {label || (isOverdue ? `SLA Breach (${Math.abs(hoursRemaining)}h overdue)` : `SLA: ${hoursRemaining}h remaining`)}
      </span>
    </span>
  );
};

export interface DepartmentBadgeProps {
  name: string;
  jurisdiction?: string;
  className?: string;
}

export const DepartmentBadge: React.FC<DepartmentBadgeProps> = ({ name, jurisdiction, className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-medium font-sans select-none',
        className
      )}
    >
      <span className="font-semibold">{name}</span>
      {jurisdiction && <span className="text-indigo-700 font-mono">({jurisdiction})</span>}
    </span>
  );
};
