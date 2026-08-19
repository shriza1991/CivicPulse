import React from 'react';
import { cn } from '../../../lib/utils';

export interface TimelineEventProps {
  id?: string;
  title: string;
  timestamp: string;
  actorName?: string;
  actorRole?: string;
  icon?: React.ReactNode;
  iconBgColor?: string;
  children?: React.ReactNode;
  isLatest?: boolean;
  className?: string;
}

export const TimelineEvent: React.FC<TimelineEventProps> = ({
  title,
  timestamp,
  actorName,
  actorRole,
  icon,
  iconBgColor = 'bg-neutral-900 text-white',
  children,
  isLatest = false,
  className,
}) => {
  return (
    <li className={cn('relative pl-6 group font-sans', className)}>
      {/* Node marker pin */}
      <span
        className={cn(
          'absolute -left-[17px] top-0.5 w-8 h-8 rounded-pill flex items-center justify-center shadow-subtle border-2 border-white',
          iconBgColor,
          isLatest && 'ring-2 ring-primary-500 ring-offset-2'
        )}
      >
        {icon}
      </span>

      <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-subtle space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-base font-semibold text-neutral-900">{title}</h4>
          <span className="text-xs font-mono text-neutral-700">{timestamp}</span>
        </div>

        {(actorName || actorRole) && (
          <p className="text-xs font-medium text-neutral-700">
            Confirmed by: <strong className="text-neutral-900">{actorName || 'System'}</strong>
            {actorRole && <span className="ml-1 text-neutral-700">({actorRole})</span>}
          </p>
        )}

        {children && <div className="pt-2 border-t border-neutral-100 text-sm">{children}</div>}
      </div>
    </li>
  );
};
