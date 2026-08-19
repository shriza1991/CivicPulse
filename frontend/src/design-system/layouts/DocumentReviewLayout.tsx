import React from 'react';
import { Container } from '../primitives/foundation/Container';
import { Breadcrumb } from '../composites/navigation/Breadcrumb';
import { ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface DocumentReviewLayoutProps {
  documentTitle: string;
  documentRef: string;
  documentContent: React.ReactNode;
  evidenceContext: React.ReactNode;
  actionGate: React.ReactNode;
  className?: string;
}

export const DocumentReviewLayout: React.FC<DocumentReviewLayoutProps> = ({
  documentTitle,
  documentRef,
  documentContent,
  evidenceContext,
  actionGate,
  className,
}) => {
  return (
    <Container width="wide" className={cn('py-6 font-sans space-y-6', className)}>
      <Breadcrumb
        items={[
          { label: 'Official Portal' },
          { label: 'Document Review' },
          { label: documentRef },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Official Document Paper */}
        <div className="lg:col-span-2 official-document-paper p-8 rounded-md space-y-6">
          <div className="official-seal-watermark">OFFICIAL DISPATCH</div>

          <div className="official-document-header pb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">{documentTitle}</h1>
              <p className="text-xs font-mono text-neutral-700 mt-1">REF: {documentRef}</p>
            </div>
            <ShieldCheck className="w-8 h-8 text-government" />
          </div>

          <div className="text-sm text-neutral-900 leading-relaxed space-y-4 font-sans">
            {documentContent}
          </div>
        </div>

        {/* Evidence & Action Sidebar */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-neutral-900">Verified Evidence Attachments</h3>
            {evidenceContext}
          </div>

          <div className="p-4 bg-white border border-neutral-200 rounded-lg shadow-subtle space-y-3">
            <h3 className="text-sm font-semibold text-neutral-900">Executive Approval Gate</h3>
            {actionGate}
          </div>
        </div>
      </div>
    </Container>
  );
};
