import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Surface } from '../../primitives/foundation/Surface';
import { Button } from '../../primitives/buttons/Button';
import { cn } from '../../../lib/utils';

export interface VerificationCardProps {
  status: 'reported' | 'partial' | 'verified' | 'contested';
  verifierCount: number;
  thresholdCount?: number;
  onVerify?: () => void;
  onContest?: () => void;
  className?: string;
}

export const VerificationCard: React.FC<VerificationCardProps> = ({
  status,
  verifierCount,
  thresholdCount = 3,
  onVerify,
  onContest,
  className,
}) => {
  const isVerified = status === 'verified';

  return (
    <Surface
      variant="card"
      elevation={1}
      className={cn(
        'p-4 font-sans space-y-3 border-l-4',
        isVerified ? 'border-l-success bg-green-50/30' : 'border-l-warning bg-amber-50/30',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isVerified ? (
            <ShieldCheck className="w-5 h-5 text-success" />
          ) : (
            <AlertCircle className="w-5 h-5 text-warning" />
          )}
          <h4 className="text-sm font-semibold text-neutral-900">
            {isVerified ? 'Community Verification Achieved' : 'Pending Citizen Audit Verification'}
          </h4>
        </div>

        <span className="text-xs font-mono font-medium text-neutral-700 bg-white px-2 py-0.5 rounded-sm border border-neutral-200">
          {verifierCount}/{thresholdCount} Verifications
        </span>
      </div>

      <p className="text-xs text-neutral-700 leading-relaxed">
        {isVerified
          ? 'Independent local citizens have inspected the repair location and confirmed resolution.'
          : 'Please inspect the location and confirm whether the reported repair is completed satisfactorily.'}
      </p>

      {!isVerified && (onVerify || onContest) && (
        <div className="pt-2 border-t border-neutral-200/60 flex items-center justify-end gap-2">
          {onContest && (
            <Button variant="danger" size="sm" onClick={onContest}>
              Contest Repair
            </Button>
          )}
          {onVerify && (
            <Button variant="primary" size="sm" onClick={onVerify} leadingIcon={<CheckCircle2 className="w-4 h-4" />}>
              Confirm Repair Verified
            </Button>
          )}
        </div>
      )}
    </Surface>
  );
};
