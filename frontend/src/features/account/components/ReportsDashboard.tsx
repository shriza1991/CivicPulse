import React from 'react';
import { useIssues } from '../../../api/queries';
import { useOffline } from '../../../core/providers/OfflineProvider';
import { useCaseActionsStore } from '../../discovery/state/useCaseActionsStore';
import { Tabs } from '../../../design-system/composites/navigation/Tabs';
import { EvidenceCard } from '../../../design-system/composites/evidence/EvidenceCard';
import { DraftsManager } from './DraftsManager';
import { LoadingIndicator } from '../../../design-system/primitives/feedback/LoadingIndicator';
import { ErrorState } from '../../../design-system/primitives/feedback/ErrorState';
import { EmptyState } from '../../../design-system/primitives/feedback/EmptyState';
import { useNavigate } from 'react-router-dom';

export const ReportsDashboard: React.FC = () => {
  const { data, isLoading, isError, refetch } = useIssues();
  const { pendingDrafts } = useOffline();
  const { bookmarks, followedCases } = useCaseActionsStore();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <LoadingIndicator label="Loading citizen reports dashboard..." size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load dashboard"
        description="Could not connect to nivaran backend services."
        onRetry={() => refetch()}
      />
    );
  }

  const allIssues = data?.issues || [];
  const activeIssues = allIssues.filter((i) => i.status !== 'approved');
  const followedIssuesList = allIssues.filter((i) => followedCases.includes(i.id));
  const bookmarkedIssuesList = allIssues.filter((i) => bookmarks.includes(i.id));

  return (
    <div className="space-y-4 font-sans py-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-neutral-200 pb-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">My Citizen Reports & Dashboard</h1>
          <p className="text-xs text-neutral-700 mt-0.5">
            Track submitted reports, manage offline drafts, and follow community case updates.
          </p>
        </div>
      </div>

      <Tabs
        tabs={[
          {
            id: 'submitted',
            label: 'Submitted Reports',
            count: activeIssues.length,
            content:
              activeIssues.length === 0 ? (
                <EmptyState title="No active reports" description="Reports you submit will appear here with live tracking updates." />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {activeIssues.map((issue) => (
                    <EvidenceCard
                      key={issue.id}
                      id={issue.id}
                      title={issue.description || `${issue.issue_type.replace('_', ' ').toUpperCase()} Hazard`}
                      timestamp={new Date(issue.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      locality={`Lat: ${issue.latitude.toFixed(3)}, Lng: ${issue.longitude.toFixed(3)}`}
                      mediaUrl={issue.photo_url}
                      onInspect={() => navigate(`/issue/${issue.id}`)}
                    />
                  ))}
                </div>
              ),
          },
          {
            id: 'drafts',
            label: 'Offline Drafts',
            count: pendingDrafts.length,
            content: <DraftsManager />,
          },
          {
            id: 'followed',
            label: 'Followed Cases',
            count: followedIssuesList.length,
            content:
              followedIssuesList.length === 0 ? (
                <EmptyState title="No followed cases" description="Click 'Follow Case' on any public report to track its progress here." />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {followedIssuesList.map((issue) => (
                    <EvidenceCard
                      key={issue.id}
                      id={issue.id}
                      title={issue.description || issue.issue_type}
                      timestamp={new Date(issue.created_at).toLocaleDateString()}
                      locality={`Lat: ${issue.latitude.toFixed(3)}, Lng: ${issue.longitude.toFixed(3)}`}
                      mediaUrl={issue.photo_url}
                      onInspect={() => navigate(`/issue/${issue.id}`)}
                    />
                  ))}
                </div>
              ),
          },
          {
            id: 'bookmarks',
            label: 'Saved Bookmarks',
            count: bookmarkedIssuesList.length,
            content:
              bookmarkedIssuesList.length === 0 ? (
                <EmptyState title="No bookmarked cases" description="Click 'Bookmark' on any case to save it for quick reference." />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {bookmarkedIssuesList.map((issue) => (
                    <EvidenceCard
                      key={issue.id}
                      id={issue.id}
                      title={issue.description || issue.issue_type}
                      timestamp={new Date(issue.created_at).toLocaleDateString()}
                      locality={`Lat: ${issue.latitude.toFixed(3)}, Lng: ${issue.longitude.toFixed(3)}`}
                      mediaUrl={issue.photo_url}
                      onInspect={() => navigate(`/issue/${issue.id}`)}
                    />
                  ))}
                </div>
              ),
          },
        ]}
      />
    </div>
  );
};
