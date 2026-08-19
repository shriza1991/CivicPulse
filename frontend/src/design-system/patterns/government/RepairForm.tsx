import React, { useState } from 'react';
import { Button } from '../../primitives/buttons/Button';
import { Textarea } from '../../primitives/forms/Textarea';
import { ImageUpload } from '../../primitives/forms/ImageUpload';
import { Wrench } from 'lucide-react';

export interface RepairFormProps {
  caseId: string;
  departmentName: string;
  onSubmitRepair: (repairData: { notes: string; photoFile: File; photoAlt: string }) => void;
  loading?: boolean;
}

export const RepairForm: React.FC<RepairFormProps> = ({
  caseId,
  departmentName,
  onSubmitRepair,
  loading = false,
}) => {
  const [notes, setNotes] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoAlt, setPhotoAlt] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoFile) {
      setError('After-repair evidence photo is required by municipal policy.');
      return;
    }
    setError('');
    onSubmitRepair({ notes, photoFile, photoAlt });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white border border-neutral-200 rounded-lg shadow-subtle font-sans space-y-4">
      <div className="flex items-center gap-2 text-primary-700 font-semibold border-b border-neutral-100 pb-3">
        <Wrench className="w-5 h-5" />
        <h4 className="text-base text-neutral-900">Submit Official Work Repair Report</h4>
      </div>

      <p className="text-xs text-neutral-700">
        Submitting for Case ID: <strong className="font-mono text-neutral-900">{caseId}</strong> | Department: <strong className="text-neutral-900">{departmentName}</strong>
      </p>

      <Textarea
        name="repairNotes"
        label="Work Performed & Maintenance Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Detail specific repairs completed by the dispatch team..."
        required
      />

      <ImageUpload
        label="Upload After-Repair Evidence Photo (Required)"
        onImageCaptured={(file, alt) => {
          setPhotoFile(file);
          setPhotoAlt(alt);
          setError('');
        }}
      />

      {error && <p role="alert" className="text-xs font-medium text-danger">{error}</p>}

      <div className="pt-2 flex justify-end">
        <Button type="submit" variant="primary" loading={loading} leadingIcon={<Wrench className="w-4 h-4" />}>
          Submit Repair Report for Verification
        </Button>
      </div>
    </form>
  );
};
