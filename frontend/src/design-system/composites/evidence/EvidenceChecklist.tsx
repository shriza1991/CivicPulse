import React from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface ChecklistItem {
  id: string;
  label: string;
  status: 'passed' | 'failed' | 'pending';
  detail?: string;
}

export interface EvidenceChecklistProps {
  title?: string;
  items: ChecklistItem[];
  className?: string;
}

export const EvidenceChecklist: React.FC<EvidenceChecklistProps> = ({
  title = 'Automated Evidence Integrity Checks',
  items,
  className,
}) => {
  const iconMap = {
    passed: <CheckCircle2 className="w-4 h-4 text-success shrink-0" aria-hidden="true" />,
    failed: <XCircle className="w-4 h-4 text-danger shrink-0" aria-hidden="true" />,
    pending: <Clock className="w-4 h-4 text-warning shrink-0" aria-hidden="true" />,
  };

  return (
    <div className={cn('p-4 bg-white border border-neutral-200 rounded-lg shadow-subtle font-sans space-y-3', className)}>
      <h4 className="text-sm font-semibold text-neutral-900">{title}</h4>

      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-2.5 text-xs text-neutral-900">
            <div className="mt-0.5">{iconMap[item.status]}</div>
            <div className="flex-1">
              <span className="font-medium">{item.label}</span>
              {item.detail && <p className="text-neutral-700 mt-0.5">{item.detail}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
