import React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  showCloseButton?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-xl',
  full: 'max-w-4xl',
};

export const Dialog: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  actions,
  size = 'md',
  showCloseButton = true,
}) => {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 animate-fade" />
        <RadixDialog.Content
          className={cn(
            'fixed left-[50%] top-[50%] z-50 w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%]',
            'bg-white rounded-lg border border-neutral-200 p-6 shadow-modal duration-fast animate-slide outline-none',
            sizeClasses[size]
          )}
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <RadixDialog.Title className="text-xl font-semibold text-neutral-900 font-sans">
                {title}
              </RadixDialog.Title>
              {description && (
                <RadixDialog.Description className="text-sm text-neutral-700 mt-1 font-sans">
                  {description}
                </RadixDialog.Description>
              )}
            </div>

            {showCloseButton && (
              <RadixDialog.Close className="rounded-pill p-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors shrink-0 min-w-[44px] min-h-[44px] inline-flex items-center justify-center">
                <X className="w-5 h-5" aria-hidden="true" />
                <span className="sr-only">Close modal dialog</span>
              </RadixDialog.Close>
            )}
          </div>

          {children && <div className="mb-6">{children}</div>}

          {actions && <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-100">{actions}</div>}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};
