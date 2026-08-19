import React from 'react';
import { TimelineEvent } from './TimelineEvent';
import { Sparkles, AlertTriangle } from 'lucide-react';

export interface AIEventProps {
  claim: string;
  confidencePercent?: number;
  timestamp: string;
  explanation?: string;
  isLatest?: boolean;
}

export const AIEvent: React.FC<AIEventProps> = ({
  claim,
  confidencePercent,
  timestamp,
  explanation,
  isLatest,
}) => {
  return (
    <TimelineEvent
      title={`Automated Assistance: ${claim}`}
      timestamp={timestamp}
      actorName="nivaran Inference Engine"
      actorRole="Automated Classifier"
      icon={<Sparkles className="w-4 h-4 text-white" />}
      iconBgColor="bg-ai"
      isLatest={isLatest}
    >
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-md space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-900">
            <AlertTriangle className="w-3.5 h-3.5 text-warning" />
            Machine Suggestion — Not Human Confirmed
          </span>
          {confidencePercent !== undefined && (
            <span className="text-[11px] font-mono font-medium text-amber-800">
              {confidencePercent}% Confidence
            </span>
          )}
        </div>
        {explanation && <p className="text-xs text-neutral-900 leading-relaxed">{explanation}</p>}
      </div>
    </TimelineEvent>
  );
};
