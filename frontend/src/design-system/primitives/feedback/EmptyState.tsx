import React from 'react';
import { Illustration, type IllustrationVariant } from '../foundation/Illustration';
import { Button } from '../buttons/Button';
import { cn } from '../../../lib/utils';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  illustrationVariant?: IllustrationVariant;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No reports found',
  description = 'There are currently no civic reports matching this view.',
  illustrationVariant = 'empty',
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 rounded-lg bg-neutral-50 border border-neutral-200 font-sans my-4',
        className
      )}
    >
      <Illustration variant={illustrationVariant} size="md" className="mb-4" />
      <h3 className="text-xl font-semibold text-neutral-900 mb-1">{title}</h3>
      <p className="text-sm text-neutral-700 max-w-sm leading-relaxed mb-6">{description}</p>

      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
