import React from 'react';
import { Surface } from '../../../design-system/primitives/foundation/Surface';
import { StatusChip } from '../../../design-system/composites/status/StatusChip';
import { AIEvent } from '../../../design-system/composites/timeline/AIEvent';
import { VerificationVote } from '../../../design-system/patterns/community/VerificationVote';
import { ShieldCheck, MapPin, Clock, AlertTriangle } from 'lucide-react';
import type { Issue } from '../../../api/types';

export interface OfficerCaseWorkspaceProps {
  issue: Issue;
  className?: string;
}

export const OfficerCaseWorkspace: React.FC<OfficerCaseWorkspaceProps> = ({ issue, className }) => {
  return (
    <div className={`space-y-6 font-sans ${className || ''}`}>
      {/* Officer Case Context Bar */}
      <Surface variant="card" className="p-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-primary-700 bg-primary-500/10 px-2 py-0.5 rounded-sm">
              CASE #{issue.id}
            </span>
            <StatusChip
              category={issue.status === 'approved' ? 'verified' : 'government'}
              label={issue.status.toUpperCase()}
              size="sm"
            />
            {issue.severity >= 4 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-danger bg-red-100 px-2 py-0.5 rounded-sm">
                <AlertTriangle className="w-3 h-3" /> High Risk Priority
              </span>
            )}
          </div>

          <span className="text-xs font-mono font-medium text-amber-900 bg-amber-100 px-2.5 py-1 rounded-sm flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> SLA Remaining: 18h 30m
          </span>
        </div>

        <h2 className="text-xl font-bold text-neutral-900">
          {issue.description || `${issue.issue_type.replace('_', ' ').toUpperCase()} Incident`}
        </h2>

        <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-700">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-neutral-700" />
            Lat: {issue.latitude.toFixed(3)}, Lng: {issue.longitude.toFixed(3)}
          </span>

          <span className="flex items-center gap-1 text-success font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            {(issue.credibility_score * 100).toFixed(0)}% Cryptographic Credibility
          </span>
        </div>
      </Surface>

      {/* AI Assistance Panel */}
      <Surface variant="card" className="p-6 space-y-3">
        <h3 className="text-base font-semibold text-neutral-900 border-b border-neutral-100 pb-2">
          Automated AI Perception & Triage Assistance
        </h3>
        <AIEvent
          claim={`Classified as ${issue.issue_type.replace('_', ' ').toUpperCase()}`}
          confidencePercent={94}
          timestamp="Pre-processed"
          explanation="Visual neural model detected hazardous road surface geometry. Automated SLA dispatch recommended to Public Works Directorate."
        />
      </Surface>

      {/* Community Audit Verification Panel */}
      <VerificationVote
        caseId={issue.id}
        onVoteSubmit={(vote) => console.log('Officer verification vote recorded:', vote)}
      />
    </div>
  );
};
