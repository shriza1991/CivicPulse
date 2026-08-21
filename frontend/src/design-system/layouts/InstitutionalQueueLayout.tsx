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
  activeNav?: string;
  onNavigate?: (tab: string) => void;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  className?: string;
}

export const InstitutionalQueueLayout: React.FC<InstitutionalQueueLayoutProps> = ({
  departmentName,
  queueCount,
  filterBar,
  queueTable,
  activeNav = 'government',
  onNavigate,
  sidebarCollapsed = false,
  onToggleSidebar,
  className,
}) => {
  return (
    <div className={cn('min-h-screen bg-neutral-50 flex font-sans text-neutral-900', className)}>
      <Sidebar
        activeDestination={activeNav}
        onNavigate={onNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={onToggleSidebar}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AppBar
          title={`CommonGround Demand Hotspots — ${departmentName}`}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={onToggleSidebar}
        />

        <main className="flex-1 py-6">
          <Container width="page" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white border border-neutral-200 rounded-lg shadow-subtle">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">{departmentName} — Demand Intelligence</h2>
                <p className="text-xs text-neutral-700 mt-0.5">
                  Spatial hotspots, demographic context, and AI policy briefs for infrastructure investment ({queueCount} active signals)
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
