import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { StatusChip } from '../../composites/status/StatusChip';
import { Button } from '../../primitives/buttons/Button';
import { cn } from '../../../lib/utils';

export interface QueueRowProps {
  caseId: string;
  title: string;
  department: string;
  ageDays: number;
  slaDueHours: number;
  statusLabel: string;
  isHighRisk?: boolean;
  onReview?: () => void;
  className?: string;
}

export const QueueRow: React.FC<QueueRowProps> = ({
  caseId,
  title,
  department,
  ageDays: _ageDays,
  slaDueHours,
  statusLabel,
  isHighRisk = false,
  onReview,
  className,
}) => {
  const isOverdue = slaDueHours <= 0;

  return (
    <tr className={cn('border-b border-neutral-200 hover:bg-neutral-50/80 transition-colors font-sans text-sm', className)}>
      <td className="px-4 py-3 font-mono text-xs font-semibold text-neutral-900">{caseId}</td>
      <td className="px-4 py-3 font-medium text-neutral-900">
        <div className="flex items-center gap-2">
          <span>{title}</span>
          {isHighRisk && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-danger bg-red-100 px-1.5 py-0.5 rounded-sm">
              <AlertTriangle className="w-3 h-3" /> High Risk
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-neutral-700">{department}</td>
      <td className="px-4 py-3">
        <StatusChip category="government" label={statusLabel} size="sm" />
      </td>
      <td className="px-4 py-3">
        <span
          className={cn(
            'inline-flex items-center gap-1 text-xs font-mono font-medium px-2 py-0.5 rounded-sm',
            isOverdue ? 'bg-red-100 text-danger font-bold' : 'bg-amber-100 text-amber-900'
          )}
        >
          <Clock className="w-3 h-3" />
          {isOverdue ? `Overdue by ${Math.abs(slaDueHours)}h` : `${slaDueHours}h remaining`}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        {onReview && (
          <Button variant="primary" size="sm" onClick={onReview}>
            Review Case
          </Button>
        )}
      </td>
    </tr>
  );
};
