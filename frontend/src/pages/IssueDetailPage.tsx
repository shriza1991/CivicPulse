import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, AlertTriangle, Play } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { EvidenceCard } from '@/components/issue/EvidenceCard';
import { ClusterCard } from '@/components/issue/ClusterCard';
import { ImpactCard } from '@/components/issue/ImpactCard';
import { DraftViewer } from '@/components/drafts/DraftViewer';
import { EscalationCard } from '@/components/escalation/EscalationCard';
import { AgentTimeline } from '@/components/timeline/AgentTimeline';
import { ComplaintLifecycle } from '@/components/timeline/ComplaintLifecycle';
import { LatestUpdateCard } from '@/components/issue/LatestUpdateCard';
import { TrustScoreCard } from '@/components/issue/TrustScoreCard';
import { AiRecommendations } from '@/components/issue/AiRecommendations';
import { CommunityVerification } from '@/components/issue/CommunityVerification';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { ApprovalModal } from '@/components/dialogs/ApprovalModal';
import { EscalationDialog } from '@/components/dialogs/EscalationDialog';
import { cn } from '@/lib/utils';
import { useTour } from '@/context/TourContext';
import {
  useIssueDetail,
  useApproveDraft,
  useEscalateDraft,
  useTriggerImpact,
  useTriggerDrafts,
} from '@/api/queries';

export const IssueDetailPage: React.FC = () => {
  const { registerTourTarget } = useTour();
  const { id } = useParams<{ id: string }>();
  const issueId = id || '';

  // API queries
  const { data, isLoading, error, refetch, isRefetching } = useIssueDetail(issueId);
  const approveDraftMutation = useApproveDraft(issueId);
  const escalateDraftMutation = useEscalateDraft(issueId);
  const triggerImpactMutation = useTriggerImpact(issueId, data?.cluster?.id || '');
  const triggerDraftsMutation = useTriggerDrafts(issueId, data?.cluster?.id || '');

  // Local UI States for dialogs/modals
  const [approvalDraftId, setApprovalDraftId] = useState<string | null>(null);
  const [escalateDraftId, setEscalateDraftId] = useState<string | null>(null);
  const [escalateMethod, setEscalateMethod] = useState<'email' | 'pdf_export'>('email');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'error' } | null>(null);

  if (error || (!isLoading && !data)) {
    return (
      <div className="py-8">
        <ErrorState
          title="Failed to Load Issue Details"
          explanation={error instanceof Error ? error.message : 'The requested report could not be fetched.'}
          onRetry={refetch}
          retryText="Retry Fetching"
        />
      </div>
    );
  }

  const { issue, cluster, impact_summary, action_drafts } = data || {
    issue: undefined,
    cluster: undefined,
    impact_summary: undefined,
    action_drafts: []
  };

  // Find if any draft has been successfully escalated
  const activeEscalation = action_drafts ? (action_drafts.find((d) => d.escalation)?.escalation || null) : null;

  // Handlers
  const handleApproveClick = (draftId: string) => {
    setApprovalDraftId(draftId);
  };

  const showToast = (message: string, type: 'success' | 'warning' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleRejectClick = async (draftId: string) => {
    if (window.confirm('Are you sure you want to reject this draft brief?')) {
      try {
        await approveDraftMutation.mutateAsync({
          draftId,
          status: 'rejected',
        });
      } catch (e) {
        // Handled via mutation
      }
    }
  };

  const handleEscalateClick = (draftId: string, method: 'email' | 'pdf_export') => {
    setEscalateDraftId(draftId);
    setEscalateMethod(method);
  };

  const handleEscalateConfirm = async (recipient?: string) => {
    if (!escalateDraftId) return;
    try {
      const response = await escalateDraftMutation.mutateAsync({
        draftId: escalateDraftId,
        method: escalateMethod,
        recipient,
      });
      setEscalateDraftId(null);
      if (response.method === 'pdf_export' && escalateMethod === 'email') {
        showToast('Email dispatch failed. Generated fallback PDF download.', 'warning');
      } else {
        showToast(
          escalateMethod === 'pdf_export'
            ? 'PDF package generated successfully!'
            : 'Escalation email dispatched successfully!',
          'success'
        );
      }
      refetch();
    } catch (e) {
      throw e;
    }
  };

  const handleTriggerImpact = async () => {
    try {
      await triggerImpactMutation.mutateAsync();
    } catch (e) {
      // Handled
    }
  };

  const handleTriggerDrafts = async () => {
    try {
      await triggerDraftsMutation.mutateAsync();
    } catch (e) {
      // Handled
    }
  };

  return (
    <div className="flex-1 flex flex-col pb-12 font-sans">
      {/* Back button */}
      <div className="pt-6 select-none">
        <Link
          to="/tracker"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Operations Center</span>
        </Link>
      </div>

      {/* Page Header */}
      <PageHeader
        title="Case Operation File"
        subtitle={`Audit evidence trail, review impact assessments, and authorize briefs.`}
        action={
          <button
            onClick={() => refetch()}
            disabled={isRefetching}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-small text-xs font-bold text-slate-650 bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors cursor-pointer shadow-sm select-none"
          >
            <RefreshCw size={12} className={cn(isRefetching && 'animate-spin')} />
            <span>{isRefetching ? 'Refreshing...' : 'Sync Case File'}</span>
          </button>
        }
      />

      {issue && (
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Sticky Sidebar on Desktop */}
          <div className="lg:col-span-4 lg:sticky lg:top-6 space-y-6">
            {/* AI Agent Processing Pipeline */}
            <div className="border border-slate-200 bg-white rounded-medium p-5 shadow-subtle space-y-4">
              <div className="space-y-1 border-b border-slate-100 pb-3 select-none">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  AI Agent Pipeline
                </h4>
                <p className="text-[10px] text-slate-400">
                  Active agent verification and routing stages.
                </p>
              </div>
              <AgentTimeline
                issue={issue}
                cluster={cluster}
                impactSummary={impact_summary}
                actionDrafts={action_drafts}
                layout="vertical"
              />
            </div>

            {/* Evidence Trust Profile Card */}
            <TrustScoreCard
              issue={issue}
              imageIntegrityStatus={data?.image_integrity_status}
              imageIntegritySimilarity={data?.image_integrity_similarity}
              verificationSimilarity={data?.verification_similarity}
              verificationThreshold={data?.verification_threshold}
              verificationDecision={data?.verification_decision}
            />
          </div>

          {/* Right Column: Dynamic case info, recommendations, and actions */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Live Lifecycle State Bar */}
            <div className="border border-slate-200 bg-white rounded-medium p-5 shadow-subtle space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider select-none">
                Incident Lifecycle Track
              </h4>
              <ComplaintLifecycle
                issue={issue}
                actionDrafts={action_drafts}
                cluster={cluster}
                impactSummary={impact_summary}
                onApprove={handleApproveClick}
                onEscalate={handleEscalateClick}
              />
            </div>

            {/* AI Recommendations Banner */}
            <div id="ai-recommendations-container" ref={(el) => registerTourTarget('ai-recommendations', el)}>
              <AiRecommendations issue={issue} cluster={cluster} />
            </div>

            {/* Latest Update Action Header */}
            <LatestUpdateCard
              issue={issue}
              actionDrafts={action_drafts}
              cluster={cluster}
              onApprove={handleApproveClick}
              onEscalate={handleEscalateClick}
            />

            {/* SECTION 1: Visual Evidence Details */}
            <div className="space-y-2.5">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 select-none">
                01. Visual Evidence Details
              </h3>
              <EvidenceCard
                issue={issue}
                imageIntegrityStatus={data?.image_integrity_status}
                imageIntegritySimilarity={data?.image_integrity_similarity}
              />
            </div>

            {/* SECTION 2: Community Accountability Layer */}
            <div className="space-y-2.5">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 select-none">
                02. Community Accountability Layer
              </h3>
              <div id="community-verification-container" ref={(el) => registerTourTarget('community-verification', el)}>
                <CommunityVerification issueId={issueId} />
              </div>
            </div>

            {/* SECTION 3: Spatial Clustering & Deduplication */}
            <div className="space-y-2.5">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 select-none">
                03. Spatial Clustering & Deduplication
              </h3>
              {cluster ? (
                <div className="space-y-4">
                  <div className="p-4 bg-teal-50/50 border border-teal-200/60 rounded-medium text-xs text-slate-700 select-none">
                    <span className="font-bold text-teal-800">Collective Accountability:</span> Multiple citizens are affected by infrastructure failures in this immediate area. This cluster consolidates individual reports to escalate a single high-impact case.
                  </div>
                  <ClusterCard cluster={{
                    ...cluster,
                    center_lat: issue.latitude,
                    center_lng: issue.longitude,
                    first_reported_at: issue.created_at,
                    last_reported_at: issue.created_at,
                  }} />
                </div>
              ) : (
                <div className="border border-slate-200 bg-white rounded-medium p-6 text-center select-none shadow-subtle text-slate-500 text-xs">
                  Searching nearby coordinates... Case file is currently registered as a solitary report.
                </div>
              )}
            </div>

            {/* SECTION 4: Neighborhood Impact Intelligence */}
            <div className="space-y-2.5">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 select-none">
                04. Neighborhood Impact Intelligence
              </h3>
              {impact_summary ? (
                <ImpactCard impact={{
                  ...impact_summary,
                  id: issue.id,
                  cluster_id: cluster?.id || '',
                  potential_consequences: impact_summary.potential_consequences || 'No consequences documented.',
                  generated_at: issue.created_at
                }} />
              ) : (
                <EmptyState
                  title="Impact Assessment Pending"
                  description="Neighborhood Impact analysis will activate automatically once more matching reports are submitted for this area. You can trigger the assessment manually for testing."
                  icon={AlertTriangle}
                  action={
                    cluster && (
                      <button
                        onClick={handleTriggerImpact}
                        disabled={triggerImpactMutation.isPending}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-250 bg-white text-xs font-bold text-slate-700 rounded-small hover:bg-slate-50 disabled:opacity-50 transition-all cursor-pointer shadow-sm"
                      >
                        <Play size={12} className={cn(triggerImpactMutation.isPending && 'animate-spin')} />
                        <span>{triggerImpactMutation.isPending ? 'Generating...' : 'Trigger Neighborhood Impact'}</span>
                      </button>
                    )
                  }
                />
              )}
            </div>

            {/* SECTION 5: Accountability Action Drafts */}
            <div className="space-y-2.5">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 select-none">
                05. Accountability Action Drafts
              </h3>
              {action_drafts && action_drafts.length > 0 ? (
                <div id="complaint-draft-workspace" ref={(el) => registerTourTarget('complaint-draft', el)}>
                  <DraftViewer
                    drafts={action_drafts.map(d => ({
                      ...d,
                      cluster_id: cluster?.id || '',
                      created_at: issue.created_at
                    }))}
                    onApprove={handleApproveClick}
                    onReject={handleRejectClick}
                    onEscalate={handleEscalateClick}
                    isSubmitting={approveDraftMutation.isPending || escalateDraftMutation.isPending}
                    issue={issue}
                    issueId={issueId}
                  />
                </div>
              ) : (
                <EmptyState
                  title="Action Briefs Pending"
                  description="Official complaint briefs will be compiled automatically once matching reports are clustered and the impact assessment is processed."
                  icon={AlertTriangle}
                  action={
                    impact_summary && (
                      <button
                        onClick={handleTriggerDrafts}
                        disabled={triggerDraftsMutation.isPending}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-250 bg-white text-xs font-bold text-slate-700 rounded-small hover:bg-slate-50 disabled:opacity-50 transition-all cursor-pointer shadow-sm"
                      >
                        <Play size={12} className={cn(triggerDraftsMutation.isPending && 'animate-spin')} />
                        <span>{triggerDraftsMutation.isPending ? 'Generating...' : 'Trigger Complaint Drafts'}</span>
                      </button>
                    )
                  }
                />
              )}
            </div>

            {/* SECTION 6: Escalation Dispatch & Action Logs */}
            <div className="space-y-2.5">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 select-none">
                06. Escalation Dispatch & Action Logs
              </h3>
              <div id="pdf-email-actions">
                {activeEscalation ? (
                  <div className="space-y-2 select-none">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                      SendGrid HTTP API logs
                    </h4>
                    <EscalationCard escalation={activeEscalation} />
                  </div>
                ) : (
                  <EmptyState
                    title="No Escalation Dispatched"
                    description="Official brief packets have not been dispatched to target authorities yet. Review the compiled briefs in the drafts section and click 'Authorize' to prepare dispatch."
                    icon={AlertTriangle}
                  />
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Confirmation & Dispatch Modals */}
      {approvalDraftId && (
        <ApprovalModal
          isOpen={!!approvalDraftId}
          onClose={() => setApprovalDraftId(null)}
          draftId={approvalDraftId}
          issueId={issueId}
          reportCount={cluster?.report_count || 1}
          areaLabel={cluster?.area_label || 'Designated Area'}
          recipientEmail="ward.office@example.gov" // Default recipient email matching spec
          draftType={action_drafts.find(d => d.id === approvalDraftId)?.draft_type || 'complaint'}
          onSuccess={showToast}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={cn(
          "fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 text-white rounded-medium shadow-premium text-xs font-bold animate-fade font-sans select-none border",
          toast.type === 'success' && "bg-slate-900 border-slate-800",
          toast.type === 'warning' && "bg-amber-600 border-amber-500",
          toast.type === 'error' && "bg-rose-600 border-rose-500"
        )}>
          <span>{toast.message}</span>
        </div>
      )}

      {escalateDraftId && (
        <EscalationDialog
          isOpen={!!escalateDraftId}
          onClose={() => setEscalateDraftId(null)}
          onSend={handleEscalateConfirm}
          method={escalateMethod}
          isSubmitting={escalateDraftMutation.isPending}
        />
      )}
    </div>
  );
};

export default IssueDetailPage;
