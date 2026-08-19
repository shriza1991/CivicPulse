import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { FeedbackTone } from './Snackbar';

export interface AlertProps {
  tone?: FeedbackTone;
  title?: string;
  children: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  urgent?: boolean;
  className?: string;
}

const toneStyles: Record<FeedbackTone, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
  info: {
    bg: 'bg-neutral-50',
    border: 'border-neutral-200',
    text: 'text-neutral-900',
    icon: <Info className="w-5 h-5 text-neutral-700 shrink-0" aria-hidden="true" />,
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-900',
    icon: <CheckCircle2 className="w-5 h-5 text-success shrink-0" aria-hidden="true" />,
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-900',
    icon: <AlertTriangle className="w-5 h-5 text-warning shrink-0" aria-hidden="true" />,
  },
  danger: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-900',
    icon: <AlertCircle className="w-5 h-5 text-danger shrink-0" aria-hidden="true" />,
  },
};

export const Alert: React.FC<AlertProps> = ({
  tone = 'info',
  title,
  children,
  actionLabel,
  onAction,
  urgent = false,
  className,
}) => {
  const config = toneStyles[tone];

  return (
    <div
      role={urgent ? 'alert' : 'status'}
      className={cn(
        'p-4 rounded-md border flex items-start gap-3 font-sans text-sm',
        config.bg,
        config.border,
        config.text,
        className
      )}
    >
      <div className="mt-0.5">{config.icon}</div>
      <div className="flex-1 space-y-1">
        {title && <h4 className="font-semibold text-base leading-snug">{title}</h4>}
        <div className="leading-relaxed">{children}</div>

        {actionLabel && onAction && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onAction}
              className="text-xs font-semibold underline underline-offset-2 hover:opacity-80 min-h-[44px] px-1 inline-flex items-center"
            >
              {actionLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
