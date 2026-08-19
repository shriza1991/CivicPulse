import React from 'react';
import {
  Sparkles,
  Landmark,
  Users,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  FileText,
  Clock,
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export type StatusCategory =
  | 'ai'
  | 'government'
  | 'community'
  | 'verified'
  | 'warning'
  | 'danger'
  | 'draft'
  | 'pending';

export interface StatusChipProps {
  category?: StatusCategory;
  label: string;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

const categoryStyles: Record<StatusCategory, { bg: string; text: string; border: string; defaultIcon: React.ReactNode }> = {
  ai: {
    bg: 'bg-amber-50',
    text: 'text-amber-900',
    border: 'border-amber-200',
    defaultIcon: <Sparkles className="w-3.5 h-3.5 text-warning shrink-0" aria-hidden="true" />,
  },
  government: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-900',
    border: 'border-indigo-200',
    defaultIcon: <Landmark className="w-3.5 h-3.5 text-government shrink-0" aria-hidden="true" />,
  },
  community: {
    bg: 'bg-violet-50',
    text: 'text-violet-900',
    border: 'border-violet-200',
    defaultIcon: <Users className="w-3.5 h-3.5 text-community shrink-0" aria-hidden="true" />,
  },
  verified: {
    bg: 'bg-green-50',
    text: 'text-green-900',
    border: 'border-green-200',
    defaultIcon: <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" aria-hidden="true" />,
  },
  warning: {
    bg: 'bg-amber-50',
    text: 'text-amber-900',
    border: 'border-amber-200',
    defaultIcon: <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0" aria-hidden="true" />,
  },
  danger: {
    bg: 'bg-red-50',
    text: 'text-red-900',
    border: 'border-red-200',
    defaultIcon: <AlertCircle className="w-3.5 h-3.5 text-danger shrink-0" aria-hidden="true" />,
  },
  draft: {
    bg: 'bg-neutral-100',
    text: 'text-neutral-700',
    border: 'border-neutral-200',
    defaultIcon: <FileText className="w-3.5 h-3.5 text-neutral-700 shrink-0" aria-hidden="true" />,
  },
  pending: {
    bg: 'bg-neutral-100',
    text: 'text-neutral-900',
    border: 'border-neutral-200',
    defaultIcon: <Clock className="w-3.5 h-3.5 text-neutral-700 shrink-0" aria-hidden="true" />,
  },
};

export const StatusChip: React.FC<StatusChipProps> = ({
  category = 'pending',
  label,
  size = 'md',
  icon,
  className,
}) => {
  const config = categoryStyles[category];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill font-medium border select-none font-sans',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      {icon || config.defaultIcon}
      <span>{label}</span>
    </span>
  );
};

export const StatusBadge = StatusChip;
