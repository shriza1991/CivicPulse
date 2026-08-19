import { useState } from 'react';

export interface GovernmentQueueFilterState {
  searchQuery: string;
  department: string;
  status: string;
  highRiskOnly: boolean;
}

const INITIAL_FILTERS: GovernmentQueueFilterState = {
  searchQuery: '',
  department: 'all',
  status: 'all',
  highRiskOnly: false,
};

export function useGovernmentQueueStore() {
  const [filters, setFilters] = useState<GovernmentQueueFilterState>(INITIAL_FILTERS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const updateFilters = (updates: Partial<GovernmentQueueFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const selectAll = (ids: string[]) => {
    setSelectedIds(ids);
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  return {
    filters,
    selectedIds,
    updateFilters,
    toggleSelect,
    selectAll,
    clearSelection,
  };
}
