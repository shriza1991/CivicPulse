import React from 'react';
import { Landmark, FileText, ShieldCheck } from 'lucide-react';
import { Surface } from '../../primitives/foundation/Surface';
import { cn } from '../../../lib/utils';

export interface OfficialResponseCardProps {
  institutionName: string;
  officerTitle: string;
  timestamp: string;
  officialText: string;
  dispatchReference?: string;
  className?: string;
}

export const OfficialResponseCard: React.FC<OfficialResponseCardProps> = ({
  institutionName,
  officerTitle,
  timestamp,
  officialText,
  dispatchReference,
  className,
}) => {
  return (
    <Surface
      variant="card"
      elevation={1}
      className={cn('p-4 border-l-4 border-l-government bg-indigo-50/30 font-sans space-y-3', className)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-government text-white rounded-md">
            <Landmark className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-government">{institutionName}</h4>
            <p className="text-xs text-neutral-700 font-medium">{officerTitle}</p>
          </div>
        </div>

        <span className="text-xs font-mono text-neutral-700">{timestamp}</span>
      </div>

      <p className="text-sm text-neutral-900 leading-relaxed bg-white p-3 rounded-md border border-neutral-200">
        {officialText}
      </p>

      {dispatchReference && (
        <div className="flex items-center justify-between text-xs text-neutral-700 pt-2 border-t border-neutral-200/60 font-mono">
          <span className="flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-government" /> Dispatch Ref: {dispatchReference}
          </span>
          <span className="flex items-center gap-1 text-success font-sans font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> Official Seal Signed
          </span>
        </div>
      )}
    </Surface>
  );
};
