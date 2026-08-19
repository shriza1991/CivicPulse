import React from 'react';
import { AlertTriangle, Info, Trash2 } from 'lucide-react';
import { Dialog } from './Dialog';
import { Button } from '../buttons/Button';

export interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  variant?: 'neutral' | 'warning' | 'destructive';
  loading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  variant = 'neutral',
  loading = false,
}) => {
  const iconMap = {
    neutral: <Info className="w-6 h-6 text-primary-700" aria-hidden="true" />,
    warning: <AlertTriangle className="w-6 h-6 text-warning" aria-hidden="true" />,
    destructive: <Trash2 className="w-6 h-6 text-danger" aria-hidden="true" />,
  };

  const buttonVariantMap = {
    neutral: 'primary' as const,
    warning: 'primary' as const,
    destructive: 'danger' as const,
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="sm"
      actions={
        <>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={buttonVariantMap[variant]}
            loading={loading}
            onClick={() => {
              onConfirm();
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-center gap-3 p-3 rounded-md bg-neutral-50 border border-neutral-200">
        <div className="shrink-0">{iconMap[variant]}</div>
        <p className="text-sm text-neutral-700 leading-snug">
          {variant === 'destructive'
            ? 'This action is permanent and cannot be undone.'
            : 'Please review your choice before confirming.'}
        </p>
      </div>
    </Dialog>
  );
};
