import React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  position?: 'left' | 'right';
  children: React.ReactNode;
  actions?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'max-w-xs',
  md: 'max-w-sm',
  lg: 'max-w-md',
};

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onOpenChange,
  title,
  position = 'right',
  children,
  actions,
  size = 'md',
}) => {
  const isLeft = position === 'left';

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-fade backdrop-blur-xs" />
        <RadixDialog.Content
          className={cn(
            'fixed top-0 bottom-0 z-50 w-full h-full bg-white shadow-modal border-neutral-200 p-6 flex flex-col outline-none animate-slide',
            isLeft ? 'left-0 border-r' : 'right-0 border-l',
            sizeClasses[size]
          )}
        >
          <div className="flex items-center justify-between gap-4 mb-4 shrink-0 pb-4 border-b border-neutral-100">
            <RadixDialog.Title className="text-xl font-semibold text-neutral-900 font-sans">
              {title}
            </RadixDialog.Title>

            <RadixDialog.Close className="rounded-pill p-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors min-w-[44px] min-h-[44px] inline-flex items-center justify-center">
              <X className="w-5 h-5" aria-hidden="true" />
              <span className="sr-only">Close drawer</span>
            </RadixDialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto mb-4">{children}</div>

          {actions && <div className="shrink-0 pt-4 border-t border-neutral-100">{actions}</div>}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};
