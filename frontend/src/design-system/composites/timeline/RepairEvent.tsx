import React from 'react';
import { TimelineEvent } from './TimelineEvent';
import { Wrench } from 'lucide-react';
import { ImageComparison } from '../evidence/ImageComparison';

export interface RepairEventProps {
  departmentName: string;
  timestamp: string;
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
  notes?: string;
  isLatest?: boolean;
}

export const RepairEvent: React.FC<RepairEventProps> = ({
  departmentName,
  timestamp,
  beforePhotoUrl,
  afterPhotoUrl,
  notes,
  isLatest,
}) => {
  return (
    <TimelineEvent
      title={`Department Work Reported: ${departmentName}`}
      timestamp={timestamp}
      actorName={departmentName}
      actorRole="Muncipal Maintenance Agency"
      icon={<Wrench className="w-4 h-4 text-white" />}
      iconBgColor="bg-primary-700"
      isLatest={isLatest}
    >
      <div className="space-y-3">
        {notes && <p className="text-xs text-neutral-900 leading-relaxed">{notes}</p>}

        {beforePhotoUrl && afterPhotoUrl && (
          <div className="pt-2">
            <h5 className="text-xs font-semibold text-neutral-900 mb-2">
              Repair Evidence Photo Pair:
            </h5>
            <ImageComparison beforeUrl={beforePhotoUrl} afterUrl={afterPhotoUrl} />
          </div>
        )}
      </div>
    </TimelineEvent>
  );
};
