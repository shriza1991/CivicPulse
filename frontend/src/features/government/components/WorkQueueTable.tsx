import React from 'react';
import { QueueRow } from '../../../design-system/patterns/government/QueueRow';
import { Button } from '../../../design-system/primitives/buttons/Button';
import { UserCheck, CheckCircle2 } from 'lucide-react';
import type { Issue } from '../../../api/types';

export interface WorkQueueTableProps {
  issues: Issue[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onClearSelection: () => void;
  onReviewCase: (id: string) => void;
  className?: string;
}

export const WorkQueueTable: React.FC<WorkQueueTableProps> = ({
  issues,
  selectedIds,
  onToggleSelect: _onToggleSelect,
  onSelectAll,
  onClearSelection,
  onReviewCase,
  className,
}) => {
  const allSelected = issues.length > 0 && selectedIds.length === issues.length;

  const handleMasterCheckbox = () => {
    if (allSelected) onClearSelection();
    else onSelectAll(issues.map((i) => i.id));
  };

  return (
    <div className={`space-y-3 font-sans ${className || ''}`}>
      {/* Bulk Action Toolbar */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-primary-500/10 border border-primary-500/30 rounded-lg flex flex-wrap items-center justify-between gap-2 animate-fade">
          <span className="text-xs font-semibold text-primary-900">
            {selectedIds.length} Cases Selected for Executive Triage
          </span>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" leadingIcon={<CheckCircle2 className="w-3.5 h-3.5" />}>
              Bulk Acknowledge ({selectedIds.length})
            </Button>
            <Button variant="primary" size="sm" leadingIcon={<UserCheck className="w-3.5 h-3.5" />}>
              Bulk Assign Officer
            </Button>
            <Button variant="ghost" size="sm" onClick={onClearSelection}>
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Queue Table */}
      <div className="bg-white border border-neutral-200 rounded-lg shadow-subtle overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold text-neutral-700">
              <th className="p-3 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleMasterCheckbox}
                  aria-label="Select all cases in queue"
                  className="rounded border-neutral-300 text-primary-700 focus:ring-primary-500"
                />
              </th>
              <th className="px-4 py-3">Case ID</th>
              <th className="px-4 py-3">Title / Hazard</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">SLA Clock</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <QueueRow
                key={issue.id}
                caseId={issue.id}
                title={issue.description || `${issue.issue_type.replace('_', ' ').toUpperCase()} Incident`}
                department="Public Works Dept"
                ageDays={1}
                slaDueHours={18}
                statusLabel={issue.status.toUpperCase()}
                isHighRisk={issue.severity >= 4}
                onReview={() => onReviewCase(issue.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
