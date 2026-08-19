import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '../../../lib/utils';

export type FeedbackTone = 'success' | 'warning' | 'danger' | 'info';

export interface ToastProps {
  message: string;
  tone?: FeedbackTone;
  onDismiss?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const toneStyles: Record<FeedbackTone, { bg: string; text: string; icon: React.ReactNode }> = {
  success: {
    bg: 'bg-success text-white',
    text: 'text-white',
    icon: <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />,
  },
  warning: {
    bg: 'bg-warning text-white',
    text: 'text-white',
    icon: <AlertTriangle className="w-5 h-5 shrink-0" aria-hidden="true" />,
  },
  danger: {
    bg: 'bg-danger text-white',
    text: 'text-white',
    icon: <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />,
  },
  info: {
    bg: 'bg-neutral-900 text-white',
    text: 'text-white',
    icon: <Info className="w-5 h-5 shrink-0" aria-hidden="true" />,
  },
};

export const Toast: React.FC<ToastProps> = ({
  message,
  tone = 'info',
  onDismiss,
  actionLabel,
  onAction,
  className,
}) => {
  const config = toneStyles[tone];

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'inline-flex items-center gap-3 px-4 py-3 rounded-md shadow-premium max-w-md w-full animate-slide font-sans',
        config.bg,
        className
      )}
    >
      {config.icon}
      <span className="text-sm font-medium flex-1">{message}</span>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="text-xs font-semibold underline underline-offset-2 hover:opacity-90 min-h-[44px] px-2 flex items-center"
        >
          {actionLabel}
        </button>
      )}

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss toast message"
          className="p-1 rounded-pill hover:bg-white/20 min-w-[44px] min-h-[44px] inline-flex items-center justify-center"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export const Snackbar = Toast;
