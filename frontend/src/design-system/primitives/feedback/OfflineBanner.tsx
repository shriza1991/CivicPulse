import React from 'react';
import { WifiOff, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';

export type OfflineState = 'offline' | 'reconnecting' | 'sync-pending' | 'sync-failed';

export interface OfflineBannerProps {
  state?: OfflineState;
  pendingCount?: number;
  lastSyncedAt?: string;
  onRetrySync?: () => void;
  className?: string;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  state = 'offline',
  pendingCount = 0,
  lastSyncedAt,
  onRetrySync,
  className,
}) => {
  const isReconnecting = state === 'reconnecting';
  const isFailed = state === 'sync-failed';

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'w-full bg-neutral-900 text-white px-4 py-2.5 font-sans text-xs flex items-center justify-between gap-3 shadow-subtle',
        isFailed && 'bg-danger-base',
        className
      )}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {isReconnecting ? (
          <RefreshCw className="w-4 h-4 animate-spin text-warning shrink-0" aria-hidden="true" />
        ) : isFailed ? (
          <AlertCircle className="w-4 h-4 text-white shrink-0" aria-hidden="true" />
        ) : (
          <WifiOff className="w-4 h-4 text-warning shrink-0" aria-hidden="true" />
        )}

        <div className="truncate">
          <span className="font-semibold mr-2">
            {isReconnecting
              ? 'Reconnecting to nivaran network...'
              : isFailed
              ? 'Sync failed.'
              : 'You are working offline.'}
          </span>
          {pendingCount > 0 && (
            <span className="text-neutral-300">({pendingCount} report draft{pendingCount > 1 ? 's' : ''} queued locally)</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 text-neutral-300">
        {lastSyncedAt && <span className="hidden sm:inline">Last sync: {lastSyncedAt}</span>}

        {onRetrySync && (
          <button
            type="button"
            onClick={onRetrySync}
            className="font-semibold text-white underline underline-offset-2 hover:opacity-80 min-h-[44px] px-2 flex items-center"
          >
            Retry Sync
          </button>
        )}
      </div>
    </div>
  );
};
