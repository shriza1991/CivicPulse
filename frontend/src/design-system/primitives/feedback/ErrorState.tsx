import React from 'react';
import { Illustration } from '../foundation/Illustration';
import { Button } from '../buttons/Button';
import { RotateCcw } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to load civic data',
  description = 'A network or server error occurred. Your local work is preserved.',
  onRetry,
  retryLabel = 'Try Again',
  className,
}) => {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 rounded-lg bg-red-50/50 border border-red-200 font-sans my-4',
        className
      )}
    >
      <Illustration variant="error" size="md" className="mb-4" />
      <h3 className="text-xl font-semibold text-neutral-900 mb-1">{title}</h3>
      <p className="text-sm text-neutral-700 max-w-md leading-relaxed mb-6">{description}</p>

      {onRetry && (
        <Button variant="secondary" onClick={onRetry} leadingIcon={<RotateCcw className="w-4 h-4" />}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
};
