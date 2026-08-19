import React from 'react';
import { Surface } from '../../../design-system/primitives/foundation/Surface';
import { StatusChip } from '../../../design-system/composites/status/StatusChip';
import { MapPin, Clock, ShieldCheck } from 'lucide-react';
import type { Issue } from '../../../api/types';

export interface CaseCardProps {
  issue: Issue;
  onSelect: (id: string) => void;
  className?: string;
}

export const CaseCard: React.FC<CaseCardProps> = ({ issue, onSelect, className }) => {
  return (
    <Surface
      variant="card"
      elevation={1}
      interactive
      onClick={() => onSelect(issue.id)}
      className={`p-4 space-y-3 font-sans transition-all hover:border-primary-500 hover:shadow-modal ${className || ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-xs font-mono font-bold text-neutral-700">{issue.id}</span>
          <h3 className="text-base font-semibold text-neutral-900 line-clamp-1 mt-0.5">
            {issue.description || `${issue.issue_type.replace('_', ' ').toUpperCase()} Hazard`}
          </h3>
        </div>

        <StatusChip
          category={issue.status === 'approved' ? 'verified' : 'government'}
          label={issue.status.toUpperCase()}
          size="sm"
        />
      </div>

      {issue.photo_url && (
        <div className="relative rounded-md overflow-hidden bg-neutral-900 aspect-video max-h-48 border border-neutral-200">
          <img src={issue.photo_url} alt={issue.description || 'Case photo'} className="object-cover w-full h-full" />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-700 pt-1 border-t border-neutral-100">
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-neutral-700" />
          Lat: {issue.latitude.toFixed(3)}, Lng: {issue.longitude.toFixed(3)}
        </span>

        <span className="flex items-center gap-1 font-mono font-medium">
          <Clock className="w-3.5 h-3.5 text-neutral-700" />
          {new Date(issue.created_at).toLocaleDateString()}
        </span>
      </div>

      <div className="flex items-center justify-between text-[11px] font-medium text-neutral-700 pt-1">
        <span className="inline-flex items-center gap-1 text-success">
          <ShieldCheck className="w-3.5 h-3.5" />
          {(issue.credibility_score * 100).toFixed(0)}% Evidence Credibility
        </span>

        <span className="text-primary-700 font-semibold group-hover:underline">
          View Case & Timeline →
        </span>
      </div>
    </Surface>
  );
};
