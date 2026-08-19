import React from 'react';
import { TimelineEvent } from './TimelineEvent';
import { Users } from 'lucide-react';

export interface CommunityEventProps {
  title: string;
  contributorCount: number;
  timestamp: string;
  details?: string;
  isLatest?: boolean;
}

export const CommunityEvent: React.FC<CommunityEventProps> = ({
  title,
  contributorCount,
  timestamp,
  details,
  isLatest,
}) => {
  return (
    <TimelineEvent
      title={title}
      timestamp={timestamp}
      actorName={`${contributorCount} Local Citizens`}
      actorRole="Community Group"
      icon={<Users className="w-4 h-4 text-white" />}
      iconBgColor="bg-community"
      isLatest={isLatest}
    >
      <div className="p-3 bg-community/5 border border-community/20 rounded-md">
        <span className="text-xs font-semibold text-community block mb-0.5">
          Aggregate Community Contribution
        </span>
        {details && <p className="text-xs text-neutral-900">{details}</p>}
      </div>
    </TimelineEvent>
  );
};
