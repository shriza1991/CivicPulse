import React from 'react';
import { Container } from '../primitives/foundation/Container';
import { Breadcrumb } from '../composites/navigation/Breadcrumb';
import { StatusChip } from '../composites/status/StatusChip';
import { MapPin } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface CaseTimelineLayoutProps {
  caseId: string;
  title: string;
  locality: string;
  statusLabel: string;
  statusCategory?: 'ai' | 'government' | 'community' | 'verified' | 'danger';
  timelineContent: React.ReactNode;
  actionFooter?: React.ReactNode;
  className?: string;
}

export const CaseTimelineLayout: React.FC<CaseTimelineLayoutProps> = ({
  caseId,
  title,
  locality,
  statusLabel,
  statusCategory = 'government',
  timelineContent,
  actionFooter,
  className,
}) => {
  return (
    <Container width="reading" className={cn('py-4 font-sans space-y-4', className)}>
      <Breadcrumb
        items={[
          { label: 'nivaran' },
          { label: 'Public Reports' },
          { label: `Case #${caseId}` },
        ]}
      />

      {/* Sticky Header */}
      <div className="p-4 bg-white border border-neutral-200 rounded-lg shadow-subtle space-y-2 sticky top-16 z-20">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-xs font-mono font-semibold text-neutral-700">CASE ID: {caseId}</span>
            <h2 className="text-xl font-bold text-neutral-900 leading-snug">{title}</h2>
          </div>
          <StatusChip category={statusCategory} label={statusLabel} />
        </div>

        <div className="flex items-center gap-1.5 text-xs text-neutral-700">
          <MapPin className="w-3.5 h-3.5 text-neutral-700" />
          <span>{locality}</span>
        </div>
      </div>

      {/* Timeline Narrative Content */}
      <div className="py-2">{timelineContent}</div>

      {/* Sticky Action Footer */}
      {actionFooter && (
        <div className="sticky bottom-4 z-20 p-3 bg-white/95 backdrop-blur-md border border-neutral-200 rounded-lg shadow-modal flex items-center justify-between gap-3">
          {actionFooter}
        </div>
      )}
    </Container>
  );
};
