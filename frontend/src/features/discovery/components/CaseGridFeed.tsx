import React from 'react';
import { CaseCard } from './CaseCard';
import { EmptyState } from '../../../design-system/primitives/feedback/EmptyState';
import type { Issue } from '../../../api/types';

export interface CaseGridFeedProps {
  issues: Issue[];
  onSelectCase: (id: string) => void;
  className?: string;
}

export const CaseGridFeed: React.FC<CaseGridFeedProps> = ({ issues, onSelectCase, className }) => {
  if (issues.length === 0) {
    return (
      <EmptyState
        title="No matching civic cases found"
        description="Try adjusting your search keywords, category, or status filters."
      />
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className || ''}`}>
      {issues.map((issue) => (
        <CaseCard key={issue.id} issue={issue} onSelect={onSelectCase} />
      ))}
    </div>
  );
};
