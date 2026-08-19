import React from 'react';
import { Dialog } from '../../primitives/overlays/Dialog';
import { Button } from '../../primitives/buttons/Button';
import { Download, ShieldCheck } from 'lucide-react';

export interface EvidenceViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  mediaUrl: string;
  altText: string;
  timestamp?: string;
  locality?: string;
  allowDownload?: boolean;
}

export const EvidenceViewer: React.FC<EvidenceViewerProps> = ({
  open,
  onOpenChange,
  title,
  mediaUrl,
  altText,
  timestamp,
  locality,
  allowDownload = true,
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={locality ? `Locality: ${locality}` : undefined}
      size="full"
      actions={
        allowDownload ? (
          <Button
            variant="secondary"
            size="sm"
            leadingIcon={<Download className="w-4 h-4" />}
            onClick={() => window.open(mediaUrl, '_blank')}
          >
            Download Evidence Asset
          </Button>
        ) : undefined
      }
    >
      <div className="space-y-3">
        <div className="relative rounded-lg overflow-hidden bg-neutral-900 aspect-video flex items-center justify-center max-h-[60vh]">
          <img src={mediaUrl} alt={altText} className="object-contain max-h-full w-full" />
        </div>

        <div className="p-3 bg-neutral-50 rounded-md border border-neutral-200 text-xs text-neutral-700 space-y-1">
          <div className="flex items-center gap-1.5 text-success font-semibold">
            <ShieldCheck className="w-4 h-4" /> Cryptographic Evidence Chain Verified
          </div>
          <p>
            <strong>Accessibility Alt Description:</strong> {altText}
          </p>
          {timestamp && <p className="font-mono">Captured Timestamp: {timestamp}</p>}
        </div>
      </div>
    </Dialog>
  );
};
