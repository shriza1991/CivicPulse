import React from 'react';
import { Trash2 } from 'lucide-react';
import { Dialog } from './Dialog';
import { Button } from '../buttons/Button';

export interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  itemType?: string;
  retentionInfo?: string;
  onDelete: () => void;
  loading?: boolean;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  open,
  onOpenChange,
  itemName,
  itemType = 'draft report',
  retentionInfo = 'Local draft data will be purged. Local cache will be deleted immediately.',
  onDelete,
  loading = false,
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Delete ${itemType}?`}
      description={`Are you sure you want to delete "${itemName}"?`}
      size="sm"
      actions={
        <>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" loading={loading} onClick={onDelete} leadingIcon={<Trash2 className="w-4 h-4" />}>
            Delete Permanently
          </Button>
        </>
      }
    >
      <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-900 leading-relaxed">
        <strong className="block font-semibold mb-0.5">Retention Notice:</strong>
        {retentionInfo}
      </div>
    </Dialog>
  );
};
