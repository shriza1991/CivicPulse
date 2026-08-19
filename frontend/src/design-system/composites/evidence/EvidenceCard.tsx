import React from 'react';
import { Camera, FileText, Mic, MapPin, Eye, Lock } from 'lucide-react';
import { Surface } from '../../primitives/foundation/Surface';
import { cn } from '../../../lib/utils';

export type EvidenceType = 'photo' | 'voice' | 'document';

export interface EvidenceCardProps {
  id: string;
  type?: EvidenceType;
  title: string;
  timestamp: string;
  locality?: string;
  mediaUrl?: string;
  restricted?: boolean;
  onInspect?: () => void;
  className?: string;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  id: _id,
  type = 'photo',
  title,
  timestamp,
  locality,
  mediaUrl,
  restricted = false,
  onInspect,
  className,
}) => {
  const iconMap = {
    photo: <Camera className="w-4 h-4 text-evidence shrink-0" aria-hidden="true" />,
    voice: <Mic className="w-4 h-4 text-evidence shrink-0" aria-hidden="true" />,
    document: <FileText className="w-4 h-4 text-evidence shrink-0" aria-hidden="true" />,
  };

  return (
    <Surface
      variant="card"
      elevation={1}
      interactive={Boolean(onInspect)}
      onClick={onInspect}
      className={cn('p-3 font-sans space-y-2 border-l-4 border-l-evidence', className)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {iconMap[type]}
          <h4 className="text-sm font-semibold text-neutral-900 truncate">{title}</h4>
        </div>

        {restricted ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-100 px-2 py-0.5 rounded-pill">
            <Lock className="w-3 h-3" /> Privacy Masked
          </span>
        ) : (
          <span className="text-xs font-mono text-neutral-700">{timestamp}</span>
        )}
      </div>

      {mediaUrl && !restricted && (
        <div className="relative rounded-md overflow-hidden aspect-video bg-neutral-900 flex items-center justify-center">
          <img src={mediaUrl} alt={`Evidence media for ${title}`} className="object-cover w-full h-full" />
          {onInspect && (
            <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1">
              <Eye className="w-4 h-4" /> Inspect Evidence
            </div>
          )}
        </div>
      )}

      {locality && (
        <div className="flex items-center gap-1 text-xs text-neutral-700 pt-1 border-t border-neutral-100">
          <MapPin className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
          <span className="truncate">{restricted ? 'Locality masked for privacy' : locality}</span>
        </div>
      )}
    </Surface>
  );
};
