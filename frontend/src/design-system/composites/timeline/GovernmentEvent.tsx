import React from 'react';
import { TimelineEvent } from './TimelineEvent';
import { Landmark } from 'lucide-react';

export interface GovernmentEventProps {
  title: string;
  department: string;
  officerName: string;
  timestamp: string;
  officialDirective?: string;
  isLatest?: boolean;
}

export const GovernmentEvent: React.FC<GovernmentEventProps> = ({
  title,
  department,
  officerName,
  timestamp,
  officialDirective,
  isLatest,
}) => {
  return (
    <TimelineEvent
      title={title}
      timestamp={timestamp}
      actorName={officerName}
      actorRole={`Official — ${department}`}
      icon={<Landmark className="w-4 h-4 text-white" />}
      iconBgColor="bg-government"
      isLatest={isLatest}
    >
      <div className="p-3 bg-government/5 border border-government/20 rounded-md space-y-1">
        <span className="text-xs font-semibold text-government block uppercase tracking-wider">
          Official Institutional Action
        </span>
        {officialDirective && <p className="text-xs text-neutral-900 leading-relaxed font-sans">{officialDirective}</p>}
      </div>
    </TimelineEvent>
  );
};
