import React, { useState } from 'react';
import { RadioGroup } from '../../primitives/forms/RadioGroup';
import { Button } from '../../primitives/buttons/Button';
import { CheckCircle2 } from 'lucide-react';

export interface VerificationVoteProps {
  caseId: string;
  onVoteSubmit: (vote: 'confirm' | 'not-repaired' | 'uncertain') => void;
  loading?: boolean;
}

export const VerificationVote: React.FC<VerificationVoteProps> = ({
  caseId,
  onVoteSubmit,
  loading = false,
}) => {
  const [selectedVote, setSelectedVote] = useState<'confirm' | 'not-repaired' | 'uncertain'>('confirm');

  return (
    <div className="p-4 bg-white border border-neutral-200 rounded-lg shadow-subtle font-sans space-y-4">
      <div className="flex items-center gap-2 text-success font-semibold border-b border-neutral-100 pb-2">
        <CheckCircle2 className="w-5 h-5" />
        <h4 className="text-base text-neutral-900">Record Factual Community Verification</h4>
      </div>

      <p className="text-xs text-neutral-700">
        Your vote contributes to the public audit score for Case ID: <strong className="font-mono text-neutral-900">{caseId}</strong>.
      </p>

      <RadioGroup
        name="verificationVote"
        label="Select your physical verification observation:"
        value={selectedVote}
        onChange={(val) => setSelectedVote(val as any)}
        options={[
          {
            value: 'confirm',
            label: 'Repair Confirmed Completed',
            description: 'Work has been carried out satisfactorily on site.',
          },
          {
            value: 'not-repaired',
            label: 'Not Repaired / Hazard Remains',
            description: 'The reported issue is still present or work is incomplete.',
          },
          {
            value: 'uncertain',
            label: 'Uncertain / Cannot Inspect',
            description: 'Unable to physically verify site conditions at this time.',
          },
        ]}
      />

      <div className="pt-2 flex justify-end">
        <Button variant="primary" loading={loading} onClick={() => onVoteSubmit(selectedVote)}>
          Submit Verification Vote
        </Button>
      </div>
    </div>
  );
};

export interface CommunityBannerProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const CommunityBanner: React.FC<CommunityBannerProps> = ({
  message,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="p-4 bg-violet-50 border border-violet-200 rounded-lg font-sans flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 my-2">
      <p className="text-xs text-violet-950 font-medium leading-relaxed">{message}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
