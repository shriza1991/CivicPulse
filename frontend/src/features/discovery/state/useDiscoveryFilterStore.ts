import { useState } from 'react';
import type { IssueType } from '../../../api/types';

export interface DiscoveryFilterState {
  searchQuery: string;
  category: 'all' | IssueType;
  status: 'all' | 'active' | 'approved';
  sort: 'newest' | 'severity' | 'credibility';
  viewMode: 'grid' | 'map';
}

const INITIAL_FILTERS: DiscoveryFilterState = {
  searchQuery: '',
  category: 'all',
  status: 'all',
  sort: 'newest',
  viewMode: 'grid',
};

export function useDiscoveryFilterState() {
  const [filters, setFilters] = useState<DiscoveryFilterState>(INITIAL_FILTERS);

  const updateFilter = (updates: Partial<DiscoveryFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  return {
    filters,
    updateFilter,
    resetFilters,
  };
}
