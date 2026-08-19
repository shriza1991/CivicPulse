import React from 'react';
import { Search } from 'lucide-react';
import { Select } from '../../../design-system/primitives/forms/Select';
import { Switch } from '../../../design-system/primitives/forms/Switch';
import type { GovernmentQueueFilterState } from '../state/useGovernmentQueueStore';

export interface QueueFilterControlsProps {
  filters: GovernmentQueueFilterState;
  onUpdate: (updates: Partial<GovernmentQueueFilterState>) => void;
  className?: string;
}

const DEPT_OPTIONS = [
  { value: 'all', label: 'All Departments' },
  { value: 'Public Works Department', label: 'Public Works Department' },
  { value: 'Jal Board', label: 'Jal Board (Water & Sewage)' },
  { value: 'Electrical Department', label: 'Electrical Department' },
  { value: 'Sanitation Authority', label: 'Sanitation Authority' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Review Statuses' },
  { value: 'classified', label: 'Classified (New)' },
  { value: 'clustered', label: 'Clustered' },
  { value: 'pending_review', label: 'Pending Review' },
  { value: 'approved', label: 'Verified Approved' },
];

export const QueueFilterControls: React.FC<QueueFilterControlsProps> = ({
  filters,
  onUpdate,
  className,
}) => {
  return (
    <div className={`p-4 bg-white border border-neutral-200 rounded-lg shadow-subtle font-sans space-y-3 ${className || ''}`}>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search queue by case ID, title, or department..."
            value={filters.searchQuery}
            onChange={(e) => onUpdate({ searchQuery: e.target.value })}
            className="w-full min-h-[44px] pl-10 pr-4 text-sm border border-neutral-200 rounded-md font-sans focus:ring-2 focus:ring-primary-500 outline-none"
          />
          <Search className="w-4 h-4 text-neutral-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <div className="shrink-0 self-start sm:self-auto">
          <Switch
            label="High Risk Only"
            checked={filters.highRiskOnly}
            onChange={(checked) => onUpdate({ highRiskOnly: checked })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-100">
        <Select
          name="deptFilter"
          label="Department Filter"
          value={filters.department}
          onChange={(e) => onUpdate({ department: e.target.value })}
          options={DEPT_OPTIONS}
        />

        <Select
          name="statusFilter"
          label="Status Filter"
          value={filters.status}
          onChange={(e) => onUpdate({ status: e.target.value })}
          options={STATUS_OPTIONS}
        />
      </div>
    </div>
  );
};
