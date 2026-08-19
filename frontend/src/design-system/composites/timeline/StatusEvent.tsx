import React from 'react';
import { TimelineEvent } from './TimelineEvent';
import { Activity } from 'lucide-react';

export interface StatusEventProps {
  statusLabel: string;
  timestamp: string;
  description?: string;
  isLatest?: boolean;
}

export const StatusEvent: React.FC<StatusEventProps> = ({
  statusLabel,
  timestamp,
  description,
  isLatest,
}) => {
  return (
    <TimelineEvent
      title={`Lifecycle Transition: ${statusLabel}`}
      timestamp={timestamp}
      icon={<Activity className="w-4 h-4 text-white" />}
      iconBgColor="bg-neutral-700"
      isLatest={isLatest}
    >
      {description && <p className="text-xs text-neutral-700">{description}</p>}
    </TimelineEvent>
  );
};
