import React from 'react';
import { useOffline } from '../../../core/providers/OfflineProvider';
import { Surface } from '../../../design-system/primitives/foundation/Surface';
import { Button } from '../../../design-system/primitives/buttons/Button';
import { EmptyState } from '../../../design-system/primitives/feedback/EmptyState';
import { FileText, RefreshCw, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DraftsManager: React.FC = () => {
  const { pendingDrafts, removeDraft, syncPendingQueue, isSyncing } = useOffline();
  const navigate = useNavigate();

  if (pendingDrafts.length === 0) {
    return (
      <EmptyState
        title="No offline report drafts"
        description="When you create or edit reports while offline, local draft snapshots appear here."
      />
    );
  }

  return (
    <div className="space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-neutral-900">
          Unsent Offline Drafts ({pendingDrafts.length})
        </h3>

        <Button
          variant="secondary"
          size="sm"
          loading={isSyncing}
          onClick={syncPendingQueue}
          leadingIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Sync Queue Now
        </Button>
      </div>

      <div className="space-y-3">
        {pendingDrafts.map((draft) => (
          <Surface key={draft.id} variant="card" elevation={1} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 text-amber-900 rounded-md mt-0.5">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-900">{draft.title}</h4>
                <p className="text-xs text-neutral-700 font-mono mt-0.5">
                  Category: {draft.category} | Created: {new Date(draft.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeDraft(draft.id)}
                leadingIcon={<Trash2 className="w-3.5 h-3.5 text-danger" />}
              >
                Discard
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/report')}
                leadingIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Resume Draft
              </Button>
            </div>
          </Surface>
        ))}
      </div>
    </div>
  );
};
