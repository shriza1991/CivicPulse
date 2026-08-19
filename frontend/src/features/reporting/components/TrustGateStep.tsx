import React from 'react';
import { ShieldCheck } from 'lucide-react';

export interface TrustGateStepProps {
  status?: 'pending' | 'passed' | 'failed';
}

export const TrustGateStep: React.FC<TrustGateStepProps> = ({ status = 'pending' }) => {
  const copy = status === 'passed'
    ? 'The server accepted this evidence for review.'
    : status === 'failed'
      ? 'This evidence needs attention before it can be submitted.'
      : 'Evidence checks will run when you submit. They assist review and do not prove the issue on their own.';

  return (
    <div className="space-y-4 font-sans">
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-700 mt-0.5" aria-hidden="true" />
        <div>
          <h4 className="text-sm font-semibold text-neutral-900">Evidence review status</h4>
          <p className="text-sm text-neutral-700 mt-1">{copy}</p>
        </div>
      </div>
    </div>
  );
};
