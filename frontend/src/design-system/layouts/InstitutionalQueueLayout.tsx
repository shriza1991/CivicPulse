import React from 'react';
import { Sidebar } from '../composites/navigation/Sidebar';
import { AppBar } from '../composites/navigation/AppBar';
import { Container } from '../primitives/foundation/Container';
import { cn } from '../../lib/utils';

export interface InstitutionalQueueLayoutProps {
  departmentName: string;
  queueCount: number;
  filterBar?: React.ReactNode;
  queueTable: React.ReactNode;
  className?: string;
}

export const InstitutionalQueueLayout: React.FC<InstitutionalQueueLayoutProps> = ({
  departmentName,
  queueCount,
  filterBar,
  queueTable,
  className,
}) => {
  return (
    <div className={cn('min-h-screen bg-neutral-50 flex font-sans text-neutral-900', className)}>
      <Sidebar activeDestination="government" />

      <div className="flex-1 flex flex-col min-w-0">
        <AppBar title={`Executive Queue — ${departmentName}`} />

        <main className="flex-1 py-6">
          <Container width="page" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white border border-neutral-200 rounded-lg shadow-subtle">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">{departmentName} Dashboard Queue</h2>
                <p className="text-xs text-neutral-700 mt-0.5">
                  Assigned cases requiring legal review, dispatch, or verification sign-off ({queueCount} active)
                </p>
              </div>

              {filterBar}
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg shadow-subtle overflow-x-auto">
              {queueTable}
            </div>
          </Container>
        </main>
      </div>
    </div>
  );
};
