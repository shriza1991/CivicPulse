import React from 'react';
import { TimelineEvent } from './TimelineEvent';
import { CheckCircle2 } from 'lucide-react';

export interface VerificationEventProps {
  verifierName: string;
  verifierRole?: string;
  timestamp: string;
  criteriaChecked: string[];
  isLatest?: boolean;
}

export const VerificationEvent: React.FC<VerificationEventProps> = ({
  verifierName,
  verifierRole = 'Independent Community Verifier',
  timestamp,
  criteriaChecked,
  isLatest,
}) => {
  return (
    <TimelineEvent
      title="Verified Resolution Achieved"
      timestamp={timestamp}
      actorName={verifierName}
      actorRole={verifierRole}
      icon={<CheckCircle2 className="w-4 h-4 text-white" />}
      iconBgColor="bg-success"
      isLatest={isLatest}
    >
      <div className="p-3 bg-green-50 border border-green-200 rounded-md space-y-2">
        <span className="text-xs font-semibold text-success block">
          Official Community Audit Passed
        </span>
        <ul className="text-xs text-neutral-900 space-y-1">
          {criteriaChecked.map((criterion, idx) => (
            <li key={idx} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-pill bg-success shrink-0" />
              <span>{criterion}</span>
            </li>
          ))}
        </ul>
      </div>
    </TimelineEvent>
  );
};
