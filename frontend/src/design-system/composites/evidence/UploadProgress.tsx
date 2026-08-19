import React from 'react';
import { Progress } from '../../primitives/feedback/Progress';
import { Button } from '../../primitives/buttons/Button';
import { X, RefreshCcw } from 'lucide-react';

export interface UploadProgressProps {
  filename: string;
  progress: number;
  status: 'uploading' | 'validating' | 'complete' | 'error';
  errorMessage?: string;
  onCancel?: () => void;
  onRetry?: () => void;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  filename,
  progress,
  status,
  errorMessage,
  onCancel,
  onRetry,
}) => {
  const isError = status === 'error';
  const isComplete = status === 'complete';

  return (
    <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-md font-sans space-y-2">
      <div className="flex items-center justify-between text-xs font-medium">
        <span className="truncate max-w-[200px] text-neutral-900">{filename}</span>
        <span className="text-neutral-700 capitalize">{status}</span>
      </div>

      <Progress
        value={isComplete ? 100 : progress}
        tone={isError ? 'danger' : isComplete ? 'success' : 'primary'}
        showPercentage={!isError}
      />

      {isError && (
        <div className="flex items-center justify-between pt-1 text-xs text-danger">
          <span>{errorMessage || 'Media upload failed'}</span>
          {onRetry && (
            <Button variant="ghost" size="sm" onClick={onRetry} leadingIcon={<RefreshCcw className="w-3 h-3" />}>
              Retry
            </Button>
          )}
        </div>
      )}

      {status === 'uploading' && onCancel && (
        <div className="flex justify-end pt-1">
          <Button variant="ghost" size="sm" onClick={onCancel} leadingIcon={<X className="w-3 h-3" />}>
            Cancel Upload
          </Button>
        </div>
      )}
    </div>
  );
};
