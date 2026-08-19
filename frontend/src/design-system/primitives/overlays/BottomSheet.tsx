import React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  snapPoints?: 'auto' | 'half' | 'full';
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  open,
  onOpenChange,
  title,
  children,
  actions,
  snapPoints = 'auto',
}) => {
  const heightClasses = {
    auto: 'max-h-[85vh]',
    half: 'h-[50vh]',
    full: 'h-[90vh]',
  };

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-fade backdrop-blur-xs" />
        <RadixDialog.Content
          className={cn(
            'fixed bottom-0 left-0 right-0 z-50 w-full bg-white rounded-t-xl shadow-modal border-t border-neutral-200 p-4 pb-8 overflow-y-auto outline-none animate-slide',
            heightClasses[snapPoints]
          )}
        >
          {/* Drag Handle Bar */}
          <div className="w-12 h-1.5 bg-neutral-300 rounded-pill mx-auto mb-3" aria-hidden="true" />

          <div className="flex items-center justify-between gap-4 mb-3">
            {title ? (
              <RadixDialog.Title className="text-lg font-semibold text-neutral-900 font-sans">
                {title}
              </RadixDialog.Title>
            ) : (
              <div />
            )}

            <RadixDialog.Close className="rounded-pill p-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors shrink-0 min-w-[44px] min-h-[44px] inline-flex items-center justify-center">
              <X className="w-5 h-5" aria-hidden="true" />
              <span className="sr-only">Close bottom sheet</span>
            </RadixDialog.Close>
          </div>

          <div className="mb-4">{children}</div>

          {actions && <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2">{actions}</div>}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};
