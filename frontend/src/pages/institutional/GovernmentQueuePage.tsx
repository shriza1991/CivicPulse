import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../../core/hooks/usePageTitle';
import { useIssues } from '../../api/queries';
import { useGovernmentQueueStore } from '../../features/government/state/useGovernmentQueueStore';
import { DemandHotspotWorkspace } from '../../features/government/components/DemandHotspotWorkspace';
import { QueueFilterControls } from '../../features/government/components/QueueFilterControls';
import { WorkQueueTable } from '../../features/government/components/WorkQueueTable';
import { WorkQueueKanban } from '../../features/government/components/WorkQueueKanban';
import { SLAAnalyticsDashboard } from '../../features/government/components/SLAAnalyticsDashboard';
import { LoadingIndicator } from '../../design-system/primitives/feedback/LoadingIndicator';
import { ErrorState } from '../../design-system/primitives/feedback/ErrorState';
import { Button } from '../../design-system/primitives/buttons/Button';
import { Flame, LayoutGrid, Table, Layers } from 'lucide-react';

export const GovernmentQueuePage: React.FC = () => {
  usePageTitle('Community Demand Hotspots — CommonGround');
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useIssues();
  const { filters, selectedIds, updateFilters, toggleSelect, selectAll, clearSelection } = useGovernmentQueueStore();
  
  // Tab state: 'hotspots' (default for planners) vs 'queue' (officer case operations)
  const [activeTab, setActiveTab] = useState<'hotspots' | 'queue'>('hotspots');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban');

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <LoadingIndicator label="Loading demand intelligence workspace..." size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load demand intelligence workspace"
        description="Could not connect to CommonGround backend services."
        onRetry={() => refetch()}
      />
    );
  }

  const allIssues = data?.issues || [];

  // Filter issues
  const filteredIssues = allIssues.filter((issue) => {
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchId = issue.id.toLowerCase().includes(q);
      const matchDesc = (issue.description || '').toLowerCase().includes(q);
      if (!matchId && !matchDesc) return false;
    }

    if (filters.highRiskOnly && issue.severity < 4) return false;
    if (filters.status !== 'all' && issue.status !== filters.status) return false;

    return true;
  });

  return (
    <div className="space-y-6 font-sans py-2">
      {/* SLA & Aggregate Metrics */}
      <SLAAnalyticsDashboard />

      {/* Main Workspace Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('hotspots')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'hotspots'
                ? 'bg-primary-700 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            <Flame className="w-4 h-4" />
            Demand Hotspots & Policy Advisor
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'queue'
                ? 'bg-primary-700 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            Officer Case Queue ({filteredIssues.length})
          </button>
        </div>

        {activeTab === 'queue' && (
          <div className="flex items-center gap-1.5">
            <Button
              variant={viewMode === 'kanban' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('kanban')}
              leadingIcon={<LayoutGrid className="w-3.5 h-3.5" />}
            >
              Kanban Board
            </Button>
            <Button
              variant={viewMode === 'table' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              leadingIcon={<Table className="w-3.5 h-3.5" />}
            >
              Queue Table
            </Button>
          </div>
        )}
      </div>

      {/* Primary Workspace View */}
      {activeTab === 'hotspots' ? (
        <DemandHotspotWorkspace />
      ) : (
        <div className="space-y-4">
          <QueueFilterControls filters={filters} onUpdate={updateFilters} />

          {viewMode === 'kanban' ? (
            <WorkQueueKanban
              issues={filteredIssues}
              onReviewCase={(issueId) => navigate(`/internal/document-review/${issueId}`)}
            />
          ) : (
            <WorkQueueTable
              issues={filteredIssues}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onSelectAll={selectAll}
              onClearSelection={clearSelection}
              onReviewCase={(issueId) => navigate(`/internal/document-review/${issueId}`)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default GovernmentQueuePage;
