import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, ExternalLink, Save } from 'lucide-react';
import { Button } from '../../../design-system/primitives/buttons/Button';
import { Surface } from '../../../design-system/primitives/foundation/Surface';

export interface SubmissionSuccessStepProps {
  caseId?: string | null;
  mode: 'dispatched' | 'queued';
  onTrackCase: () => void;
}

export const SubmissionSuccessStep: React.FC<SubmissionSuccessStepProps> = ({ caseId, mode, onTrackCase }) => {
  const [copied, setCopied] = useState(false);
  const dispatched = mode === 'dispatched' && Boolean(caseId);

  const handleCopy = async () => {
    if (!caseId) return;
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/issue/${caseId}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-6 font-sans text-center py-4">
      <div className="flex flex-col items-center space-y-3">
        <div className="p-4 bg-neutral-100 rounded-pill text-primary-700">
          {dispatched ? <CheckCircle2 className="w-12 h-12" aria-hidden="true" /> : <Save className="w-12 h-12" aria-hidden="true" />}
        </div>
        <h2 className="text-2xl font-bold text-neutral-900">{dispatched ? 'Report submitted' : 'Report saved on this device'}</h2>
        <p className="text-sm text-neutral-700 max-w-md leading-relaxed">
          {dispatched
            ? 'Your report was sent for review. The case timeline will show the next verified update.'
            : 'This report is stored locally. Automatic offline submission is not available yet; keep it here until you can review and submit it online.'}
        </p>
      </div>

      <Surface variant="card" elevation={1} className="p-6 max-w-md mx-auto space-y-3 bg-neutral-50">
        {dispatched && caseId ? (
          <>
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700">Case ID</span>
            <div className="text-3xl font-mono font-bold text-primary-700">{caseId}</div>
            <div className="pt-3 flex items-center justify-center gap-2">
              <Button variant="secondary" size="sm" onClick={handleCopy} leadingIcon={copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}>
                {copied ? 'Link Copied' : 'Copy Case Link'}
              </Button>
              <Button variant="primary" size="sm" onClick={onTrackCase} leadingIcon={<ExternalLink className="w-4 h-4" />}>View Case</Button>
            </div>
          </>
        ) : (
          <Button variant="primary" size="sm" onClick={onTrackCase}>Return to reports</Button>
        )}
      </Surface>
    </div>
  );
};
