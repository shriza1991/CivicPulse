import React from 'react';
import { BarChart3, Layers, MapPin, ShieldAlert, Tag, Users, Zap } from 'lucide-react';
import type { Issue, Cluster, ImpactSummary } from '@/api/types';
import { humanizeIssueType } from '@/utils/issueHelpers';
import { cn } from '@/lib/utils';
import { HelpTooltip } from '@/components/shared/HelpTooltip';

interface ImpactAnalyticsCardProps {
  issue: Issue;
  cluster?: Cluster | null;
  impactSummary?: ImpactSummary | null;
}

const getRiskConfig = (risk: string) => {
  switch (risk) {
    case 'high':
      return { label: 'High Risk', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' };
    case 'moderate':
      return { label: 'Moderate Risk', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' };
    default:
      return { label: 'Low Risk', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
  }
};

interface StatItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}

const StatItem: React.FC<StatItemProps> = ({ icon: Icon, label, value, sub, highlight }) => (
  <div className={cn(
    'flex items-start gap-3 p-4 rounded-small border',
    highlight ? 'border-primary/20 bg-teal-50/40' : 'border-slate-150 bg-slate-50/60'
  )}>
    <span className={cn(
      'flex h-8 w-8 items-center justify-center rounded-small shrink-0',
      highlight ? 'bg-primary/10 text-primary' : 'bg-white text-slate-500 border border-slate-200'
    )}>
      <Icon size={14} />
    </span>
    <div className="min-w-0 space-y-0.5">
      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{label}</span>
      <span className="text-sm font-bold text-slate-800 block leading-tight">{value}</span>
      {sub && <span className="text-[10px] text-slate-450 block">{sub}</span>}
    </div>
  </div>
);

export const ImpactAnalyticsCard: React.FC<ImpactAnalyticsCardProps> = ({
  issue,
  cluster,
  impactSummary,
}) => {
  const riskConfig = impactSummary
    ? getRiskConfig(impactSummary.risk_level)
    : getRiskConfig(issue.severity >= 4 ? 'high' : issue.severity === 3 ? 'moderate' : 'low');

  const estimatedImpact = cluster
    ? `~${cluster.report_count * 150}–${cluster.report_count * 300} residents`
    : '~150–300 residents';

  return (
    <div className="border border-slate-200 bg-white rounded-medium shadow-subtle overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 select-none">
        <div className="flex items-center gap-2">
          <BarChart3 size={15} className="text-primary shrink-0" />
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
            Impact Analytics
            <HelpTooltip text="Summarizes estimated public impact using existing risk and clustering information." />
          </h4>
        </div>
        <span className={cn(
          'text-[9px] font-bold px-2 py-1 rounded border uppercase tracking-wider',
          riskConfig.color, riskConfig.bg, riskConfig.border
        )}>
          {riskConfig.label}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <StatItem
          icon={Layers}
          label="Cluster Size"
          value={cluster ? `${cluster.report_count} Report${cluster.report_count > 1 ? 's' : ''}` : '1 Report'}
          sub={cluster ? `Area: ${cluster.area_label}` : 'No cluster yet'}
          highlight={!!cluster && cluster.report_count > 1}
        />

        <StatItem
          icon={Tag}
          label="Issue Category"
          value={humanizeIssueType(issue.issue_type, issue.description)}
          sub="AI-classified from photo evidence"
        />

        <StatItem
          icon={ShieldAlert}
          label="Severity Level"
          value={`${issue.severity} / 5`}
          sub={issue.severity >= 4 ? 'Critical — immediate action needed' : issue.severity === 3 ? 'Moderate — time-bound response' : 'Low — routine maintenance'}
        />

        <StatItem
          icon={MapPin}
          label="Nearby Reports"
          value={cluster ? `${cluster.report_count} logged` : '1 logged'}
          sub={cluster && cluster.last_reported_at && !isNaN(new Date(cluster.last_reported_at).getTime()) ? `Last: ${new Date(cluster.last_reported_at).toLocaleDateString()}` : 'First report'}
        />

        <StatItem
          icon={Users}
          label="Estimated Impact"
          value={estimatedImpact}
          sub="Spatial footprint proxy (150–300 per report)"
        />

        <StatItem
          icon={Zap}
          label="Credibility Score"
          value={`${Math.round(issue.credibility_score * 100)}%`}
          sub={issue.credibility_score >= 0.8 ? 'High confidence — verified' : 'Moderate — review required'}
          highlight={issue.credibility_score >= 0.8}
        />
      </div>

      {/* Impact Summary (if available from Agent 3) */}
      {impactSummary && (
        <div className="px-6 pb-6">
          <div className="border border-slate-150 bg-slate-50/60 rounded-small p-4 space-y-2">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
              Agent 3 — Impact Assessment Summary
            </span>
            <p className="text-xs text-slate-700 leading-relaxed">
              {impactSummary.affected_area_description}
            </p>
            {impactSummary.potential_consequences && (
              <p className="text-[10px] text-slate-500 leading-relaxed border-t border-slate-200 pt-2 mt-2">
                <span className="font-semibold">Potential consequences: </span>
                {impactSummary.potential_consequences}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImpactAnalyticsCard;
