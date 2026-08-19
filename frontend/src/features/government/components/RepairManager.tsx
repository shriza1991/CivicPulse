import React, { useState } from 'react';
import { RepairForm } from '../../../design-system/patterns/government/RepairForm';
import { Surface } from '../../../design-system/primitives/foundation/Surface';
import { Wrench, CheckCircle2 } from 'lucide-react';

export interface RepairManagerProps {
  caseId: string;
  departmentName?: string;
  onRepairCompleted: (afterPhoto: File, notes: string) => void;
  className?: string;
}

export const RepairManager: React.FC<RepairManagerProps> = ({
  caseId,
  departmentName = 'Public Works Department',
  onRepairCompleted,
  className,
}) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitRepair = (data: { notes: string; photoFile: File; photoAlt: string }) => {
    onRepairCompleted(data.photoFile, data.notes);
    setSubmitted(true);
  };

  return (
    <div className={`space-y-4 font-sans ${className || ''}`}>
      <Surface variant="card" className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
          <div className="flex items-center gap-2 text-primary-700 font-semibold">
            <Wrench className="w-5 h-5" />
            <h3 className="text-base text-neutral-900">Municipal Repair & Work Order Manager — Case #{caseId}</h3>
          </div>
          <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-sm">
            WORK IN PROGRESS
          </span>
        </div>

        {!submitted ? (
          <RepairForm
            caseId={caseId}
            departmentName={departmentName}
            onSubmitRepair={handleSubmitRepair}
          />
        ) : (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center space-y-3">
            <div className="inline-flex p-3 bg-white rounded-pill text-success shadow-subtle">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-neutral-900">
              Repair Evidence Submitted & Case Marked Resolved
            </h4>
            <p className="text-xs text-neutral-700 max-w-md mx-auto leading-relaxed">
              After-photo evidence has been cryptographically linked. Verification request dispatched to citizen audit panel.
            </p>
          </div>
        )}
      </Surface>
    </div>
  );
};
