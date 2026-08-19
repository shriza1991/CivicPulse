import React, { useState } from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { Dialog } from './Dialog';
import { Button } from '../buttons/Button';
import { Checkbox } from '../forms/Checkbox';

export interface ApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  recipientDepartment: string;
  evidenceCount: number;
  draftSummary: string;
  onApprove: (officialNote: string) => void;
  onReject: (reason: string) => void;
  loading?: boolean;
}

export const ApprovalDialog: React.FC<ApprovalDialogProps> = ({
  open,
  onOpenChange,
  title,
  recipientDepartment,
  evidenceCount,
  draftSummary,
  onApprove,
  onReject,
  loading = false,
}) => {
  const [officialNote, setOfficialNote] = useState(draftSummary);
  const [acknowledgedLegal, setAcknowledgedLegal] = useState(false);
  const [mode, setMode] = useState<'review' | 'reject'>('review');
  const [rejectReason, setRejectReason] = useState('');

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={`Official institutional dispatch to ${recipientDepartment}`}
      size="lg"
      actions={
        mode === 'review' ? (
          <>
            <Button
              variant="danger"
              disabled={loading}
              onClick={() => setMode('reject')}
            >
              Reject Case
            </Button>
            <Button
              variant="primary"
              loading={loading}
              disabled={!acknowledgedLegal}
              onClick={() => onApprove(officialNote)}
              leadingIcon={<ShieldCheck className="w-5 h-5" />}
            >
              Approve & Dispatch
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={() => setMode('review')}>
              Back to Review
            </Button>
            <Button
              variant="danger"
              loading={loading}
              disabled={!rejectReason.trim()}
              onClick={() => onReject(rejectReason)}
            >
              Confirm Rejection
            </Button>
          </>
        )
      }
    >
      {mode === 'review' ? (
        <div className="space-y-4">
          <div className="p-4 bg-government/5 border border-government/20 rounded-md">
            <div className="flex items-center gap-2 text-government font-medium mb-1">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
              <span>Official Authorization Gate</span>
            </div>
            <p className="text-xs text-neutral-700">
              Target Department: <strong className="text-neutral-900">{recipientDepartment}</strong> | Verified Evidence Attachments: <strong className="text-neutral-900">{evidenceCount} items</strong>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-1">
              Official Directing Note / Summary
            </label>
            <textarea
              value={officialNote}
              onChange={(e) => setOfficialNote(e.target.value)}
              rows={3}
              className="w-full p-3 border border-neutral-200 rounded-md text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter official directives for executive desk..."
            />
          </div>

          <div className="p-3 bg-neutral-50 rounded-md border border-neutral-200">
            <Checkbox
              id="legal-ack"
              checked={acknowledgedLegal}
              onChange={(e) => setAcknowledgedLegal(e.target.checked)}
              label="I certify that I have reviewed the evidence and authorize this legal dispatch."
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-3 bg-danger/10 border border-danger/30 rounded-md flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-neutral-900">
              Provide an official reason for rejecting this case. This note will be recorded in the public timeline.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-1">
              Rejection Reason (Required)
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              required
              className="w-full p-3 border border-neutral-200 rounded-md text-sm font-sans focus:outline-none focus:ring-2 focus:ring-danger"
              placeholder="Detail reasons for rejection..."
            />
          </div>
        </div>
      )}
    </Dialog>
  );
};
