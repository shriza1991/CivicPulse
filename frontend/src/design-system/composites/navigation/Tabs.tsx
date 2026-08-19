import React from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import { cn } from '../../../lib/utils';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  content?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  value,
  defaultValue,
  onValueChange,
  className,
}) => {
  const initialValue = defaultValue || (tabs[0] ? tabs[0].id : '');

  return (
    <RadixTabs.Root
      value={value}
      defaultValue={initialValue}
      onValueChange={onValueChange}
      className={cn('w-full font-sans', className)}
    >
      <RadixTabs.List className="flex border-b border-neutral-200 gap-2 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => (
          <RadixTabs.Trigger
            key={tab.id}
            value={tab.id}
            disabled={tab.disabled}
            className={cn(
              'px-4 py-3 min-h-[48px] text-sm font-medium text-neutral-700 hover:text-neutral-900 border-b-2 border-transparent transition-all whitespace-nowrap outline-none flex items-center gap-2',
              'data-[state=active]:border-primary-700 data-[state=active]:text-primary-700 data-[state=active]:font-semibold',
              'focus-visible:ring-2 focus-visible:ring-primary-500',
              'disabled:opacity-40 disabled:cursor-not-allowed'
            )}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-pill bg-neutral-100 text-neutral-700">
                {tab.count}
              </span>
            )}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>

      {tabs.map((tab) => (
        <RadixTabs.Content key={tab.id} value={tab.id} className="py-4 outline-none">
          {tab.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
};
