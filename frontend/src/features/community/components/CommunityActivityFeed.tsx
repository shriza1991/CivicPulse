import React, { useState } from 'react';
import { useCommunityStore } from '../state/useCommunityStore';
import { Surface } from '../../../design-system/primitives/foundation/Surface';
import { StatusChip } from '../../../design-system/composites/status/StatusChip';
import { Button } from '../../../design-system/primitives/buttons/Button';
import { EmptyState } from '../../../design-system/primitives/feedback/EmptyState';
import { Activity, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CommunityActivityFeed: React.FC = () => {
  const { activities } = useCommunityStore();
  const [filter, setFilter] = useState<'all' | 'verification' | 'evidence' | 'volunteer'>('all');
  const navigate = useNavigate();

  const filtered = activities.filter((a) => (filter === 'all' ? true : a.type === filter));

  return (
    <div className="space-y-4 font-sans py-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-neutral-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary-500/10 text-primary-700 rounded-pill">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Community Verification Activity Feed</h2>
            <p className="text-xs text-neutral-700">Realtime audit contributions, verification votes, and citizen evidence</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant={filter === 'all' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('all')}>
          All Activity ({activities.length})
        </Button>
        <Button variant={filter === 'verification' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('verification')}>
          Verifications
        </Button>
        <Button variant={filter === 'evidence' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('evidence')}>
          Evidence Uploads
        </Button>
        <Button variant={filter === 'volunteer' ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter('volunteer')}>
          Volunteers
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No activity recorded" description="There are no community audit activities matching this filter." />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <Surface key={item.id} variant="card" elevation={1} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <StatusChip
                    category={item.type === 'verification' ? 'verified' : item.type === 'evidence' ? 'community' : 'government'}
                    label={item.type.toUpperCase()}
                    size="sm"
                  />
                  <span className="text-xs font-semibold text-neutral-900">{item.authorName}</span>
                  {item.badgeLabel && (
                    <span className="text-[10px] font-mono text-primary-700 bg-primary-500/10 px-1.5 py-0.5 rounded-sm">
                      {item.badgeLabel}
                    </span>
                  )}
                  <span className="text-xs font-mono text-neutral-700">• {item.timestamp}</span>
                </div>

                <h4 className="text-sm font-semibold text-neutral-900">{item.caseTitle}</h4>
                <p className="text-xs text-neutral-700 leading-relaxed">{item.content}</p>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(`/issue/${item.caseId}`)}
                leadingIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Inspect Case
              </Button>
            </Surface>
          ))}
        </div>
      )}
    </div>
  );
};
