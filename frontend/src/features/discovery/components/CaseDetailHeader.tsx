import React, { useState } from 'react';
import { StatusChip } from '../../../design-system/composites/status/StatusChip';
import { Button } from '../../../design-system/primitives/buttons/Button';
import { Bookmark, Bell, Share2, Check, MapPin, Calendar, ShieldCheck } from 'lucide-react';
import { useCaseActionsStore } from '../state/useCaseActionsStore';
import type { Issue } from '../../../api/types';

export interface CaseDetailHeaderProps {
  issue: Issue;
  areaLabel?: string;
  className?: string;
}

export const CaseDetailHeader: React.FC<CaseDetailHeaderProps> = ({ issue, areaLabel, className }) => {
  const { isBookmarked, isFollowed, toggleBookmark, toggleFollow } = useCaseActionsStore();
  const [copied, setCopied] = useState(false);

  const bookmarked = isBookmarked(issue.id);
  const followed = isFollowed(issue.id);

  const handleShare = () => {
    const canonicalUrl = `${window.location.origin}/issue/${issue.id}`;
    navigator.clipboard.writeText(canonicalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`p-6 bg-white border border-neutral-200 rounded-lg shadow-subtle font-sans space-y-4 ${className || ''}`}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-100 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-primary-700 bg-primary-500/10 px-2 py-0.5 rounded-sm">
              CASE #{issue.id}
            </span>
            <StatusChip
              category={issue.status === 'approved' ? 'verified' : 'government'}
              label={issue.status.toUpperCase()}
              size="sm"
            />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 leading-tight">
            {issue.description || `${issue.issue_type.replace('_', ' ').toUpperCase()} Hazard`}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-700 pt-1">
            <span className="flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-neutral-700" />
              {areaLabel || `Lat: ${issue.latitude.toFixed(3)}, Lng: ${issue.longitude.toFixed(3)}`}
            </span>

            <span className="flex items-center gap-1 font-mono">
              <Calendar className="w-3.5 h-3.5 text-neutral-700" />
              Reported: {new Date(issue.created_at).toLocaleDateString()}
            </span>

            <span className="flex items-center gap-1 text-success font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              {(issue.credibility_score * 100).toFixed(0)}% Credibility
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant={followed ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => toggleFollow(issue.id)}
            leadingIcon={<Bell className="w-4 h-4" />}
          >
            {followed ? 'Following Updates' : 'Follow Case'}
          </Button>

          <Button
            variant={bookmarked ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => toggleBookmark(issue.id)}
            leadingIcon={<Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current text-primary-700' : ''}`} />}
          >
            {bookmarked ? 'Saved' : 'Bookmark'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            leadingIcon={copied ? <Check className="w-4 h-4 text-success" /> : <Share2 className="w-4 h-4" />}
          >
            {copied ? 'Copied' : 'Share URL'}
          </Button>
        </div>
      </div>
    </div>
  );
};
