import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../../core/hooks/usePageTitle';
import { useIssues } from '../../api/queries';
import { useDiscoveryFilterState } from '../../features/discovery/state/useDiscoveryFilterStore';
import { SearchFilterBar } from '../../features/discovery/components/SearchFilterBar';
import { SavedFilterChips } from '../../features/discovery/components/SavedFilterChips';
import { CaseGridFeed } from '../../features/discovery/components/CaseGridFeed';
import { InteractiveMapExperience } from '../../features/discovery/components/InteractiveMapExperience';
import { LoadingIndicator } from '../../design-system/primitives/feedback/LoadingIndicator';
import { ErrorState } from '../../design-system/primitives/feedback/ErrorState';

export const DiscoveryPage: React.FC = () => {
  usePageTitle('Discover Public Cases & Hazards — nivaran');
  const navigate = useNavigate();
  const { filters, updateFilter, resetFilters } = useDiscoveryFilterState();
  const { data, isLoading, isError, refetch } = useIssues();

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <LoadingIndicator label="Loading public case discovery index..." size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load discovery feed"
        description="Could not connect to nivaran backend services."
        onRetry={() => refetch()}
      />
    );
  }

  const allIssues = data?.issues || [];

  // Filter issues according to active search bar & chips state
  const filteredIssues = allIssues.filter((issue) => {
    // 1. Text Search Filter
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchId = issue.id.toLowerCase().includes(q);
      const matchDesc = (issue.description || '').toLowerCase().includes(q);
      const matchType = issue.issue_type.toLowerCase().includes(q);
      if (!matchId && !matchDesc && !matchType) return false;
    }

    // 2. Category Filter
    if (filters.category !== 'all' && issue.issue_type !== filters.category) {
      return false;
    }

    // 3. Status Filter
    if (filters.status === 'approved' && issue.status !== 'approved') return false;
    if (filters.status === 'active' && issue.status === 'approved') return false;

    return true;
  });

  // Sort issues
  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (filters.sort === 'severity') return b.severity - a.severity;
    if (filters.sort === 'credibility') return b.credibility_score - a.credibility_score;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="space-y-6 font-sans py-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-neutral-200 pb-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Discover Public Cases & Hazards</h1>
          <p className="text-xs text-neutral-700 mt-0.5">
            Search, filter, and audit verified civic issues across your municipal jurisdiction.
          </p>
        </div>

        <span className="text-xs font-mono font-semibold text-primary-700 bg-primary-500/10 px-2.5 py-1 rounded-pill">
          {sortedIssues.length} Matches Found
        </span>
      </div>

      <SearchFilterBar filters={filters} onUpdate={updateFilter} onReset={resetFilters} />
      <SavedFilterChips onApplyPreset={updateFilter} />

      {filters.viewMode === 'grid' ? (
        <CaseGridFeed issues={sortedIssues} onSelectCase={(id) => navigate(`/issue/${id}`)} />
      ) : (
        <InteractiveMapExperience issues={sortedIssues} onSelectCase={(id) => navigate(`/issue/${id}`)} />
      )}
    </div>
  );
};

export default DiscoveryPage;
