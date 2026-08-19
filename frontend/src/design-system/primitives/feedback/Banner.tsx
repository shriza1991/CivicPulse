import React from 'react';
import { AlertTriangle, ShieldCheck, WifiOff, FileText, X } from 'lucide-react';
import { cn } from '../../../lib/utils';

export type BannerVariant = 'offline' | 'privacy' | 'system' | 'draft' | 'warning';

export interface BannerProps {
  variant?: BannerVariant;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  className?: string;
}

const variantStyles: Record<BannerVariant, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
  offline: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-900',
    icon: <WifiOff className="w-5 h-5 text-warning shrink-0" aria-hidden="true" />,
  },
  privacy: {
    bg: 'bg-primary-500/10',
    border: 'border-primary-500/20',
    text: 'text-primary-900',
    icon: <ShieldCheck className="w-5 h-5 text-primary-700 shrink-0" aria-hidden="true" />,
  },
  system: {
    bg: 'bg-neutral-100',
    border: 'border-neutral-200',
    text: 'text-neutral-900',
    icon: <AlertTriangle className="w-5 h-5 text-neutral-700 shrink-0" aria-hidden="true" />,
  },
  draft: {
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    text: 'text-violet-900',
    icon: <FileText className="w-5 h-5 text-community shrink-0" aria-hidden="true" />,
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-900',
    icon: <AlertTriangle className="w-5 h-5 text-warning shrink-0" aria-hidden="true" />,
  },
};

export const Banner: React.FC<BannerProps> = ({
  variant = 'system',
  message,
  actionLabel,
  onAction,
  onDismiss,
  className,
}) => {
  const config = variantStyles[variant];

  return (
    <div
      role="region"
      aria-label="Notification banner"
      className={cn(
        'w-full border-b px-4 py-3 font-sans text-sm flex items-center justify-between gap-3',
        config.bg,
        config.border,
        config.text,
        className
      )}
    >
      <div className="flex items-center gap-3 flex-1">
        {config.icon}
        <span className="font-medium leading-snug">{message}</span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="text-xs font-semibold underline underline-offset-2 hover:opacity-80 min-h-[44px] px-2 flex items-center"
          >
            {actionLabel}
          </button>
        )}

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss banner"
            className="p-1 rounded-pill hover:bg-black/10 min-w-[44px] min-h-[44px] inline-flex items-center justify-center"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
};
