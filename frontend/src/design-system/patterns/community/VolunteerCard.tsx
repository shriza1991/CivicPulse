import React from 'react';
import { ShieldCheck, MapPin } from 'lucide-react';
import { Surface } from '../../primitives/foundation/Surface';
import { Button } from '../../primitives/buttons/Button';
import { cn } from '../../../lib/utils';

export interface VolunteerCardProps {
  volunteerName: string;
  assignedWard: string;
  verifiedCasesCount: number;
  onAssignCase?: () => void;
  className?: string;
}

export const VolunteerCard: React.FC<VolunteerCardProps> = ({
  volunteerName,
  assignedWard,
  verifiedCasesCount,
  onAssignCase,
  className,
}) => {
  return (
    <Surface variant="card" elevation={1} className={cn('p-4 font-sans space-y-2', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-community">
          <ShieldCheck className="w-5 h-5 text-success" />
          <h4 className="text-sm font-semibold text-neutral-900">{volunteerName}</h4>
        </div>
        <span className="text-xs font-mono text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-sm">
          {verifiedCasesCount} Audits
        </span>
      </div>

      <p className="text-xs text-neutral-700 flex items-center gap-1">
        <MapPin className="w-3.5 h-3.5 text-neutral-700" /> Assigned Jurisdiction: {assignedWard}
      </p>

      {onAssignCase && (
        <div className="pt-2 flex justify-end">
          <Button variant="secondary" size="sm" onClick={onAssignCase}>
            Assign Location Audit
          </Button>
        </div>
      )}
    </Surface>
  );
};
