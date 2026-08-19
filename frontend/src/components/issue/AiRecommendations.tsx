import React from 'react';
import { Sparkles, Building2, ShieldAlert, Layers, Clock, ArrowRight } from 'lucide-react';
import type { Issue, Cluster } from '@/api/types';

import { HelpTooltip } from '@/components/shared/HelpTooltip';

interface AiRecommendationsProps {
  issue: Issue;
  cluster?: Cluster | null;
}

const getDepartmentDetails = (type: string) => {
  switch (type) {
    case 'road_damage':
      return { dept: 'Public Works Department (PWD)', wing: 'Road Infrastructure Maintenance Division' };
    case 'street_lighting':
      return { dept: 'Municipal Power & Lighting Utilities', wing: 'Electrical Services Wing' };
    case 'garbage':
      return { dept: 'Solid Waste Management Dept', wing: 'Sanitation & Cleanliness Cell' };
    case 'water':
      return { dept: 'Hydraulic Engineering & Water Supply', wing: 'Leakage Control Division' };
    case 'footpath':
      return { dept: 'Public Works / Municipal Roads Wing', wing: 'Pedestrian Safety Board' };
    case 'dumping':
      return { dept: 'Environmental Pollution Control Board', wing: 'Waste & Illegal Dumping Cell' };
    default:
      return { dept: 'Municipal Corporation General Secretariat', wing: 'Public Works & Utilities Division' };
  }
};

export const AiRecommendations: React.FC<AiRecommendationsProps> = ({
  issue,
  cluster,
}) => {
  const deptInfo = getDepartmentDetails(issue.issue_type);

  // Suggested priority based on severity
  let suggestedPriority = 'Routine Maintenance';
  let priorityColor = 'text-slate-700 bg-slate-50 border-slate-200';
  let escalationWindow = '15 Days standard window';
  
  if (issue.severity >= 5) {
    suggestedPriority = 'Emergency / Immediate Dispatch';
    priorityColor = 'text-rose-700 bg-rose-50 border-rose-200 animate-pulse';
    escalationWindow = '24-48 Hours (RTI Act Section 7(1) Emergency Clause)';
  } else if (issue.severity === 4) {
    suggestedPriority = 'High / Time-bound Action';
    priorityColor = 'text-amber-700 bg-amber-50 border-amber-200';
    escalationWindow = '72 Hours (Standard Grievance rules)';
  } else if (issue.severity === 3) {
    suggestedPriority = 'Moderate / Standard Action';
    priorityColor = 'text-yellow-805 bg-yellow-50 border-yellow-200';
    escalationWindow = '7 Days standard DARPG rules';
  }

  // Next recommended action based on status
  let nextAction = 'Review and authorize complaint draft';
  let nextActionDesc = 'Verify details and click "Authorize" to sign off on generated briefs.';
  
  if (issue.status === 'classified') {
    nextAction = 'Manually generate case briefs';
    nextActionDesc = 'Trigger AI impact assessment and draft preparation via Action generator.';
  } else if (issue.status === 'clustered') {
    nextAction = 'Trigger draft generation';
    nextActionDesc = 'Review verified spatial cluster details and click "Generate Drafts".';
  } else if (issue.status === 'approved') {
    nextAction = 'Dispatch official brief via Email';
    nextActionDesc = 'Provide official recipient email address and execute send action.';
  } else if (issue.status === 'escalated') {
    nextAction = 'Track statutory 30-day RTI window';
    nextActionDesc = 'Await official response from department or prepare for escalation appeal.';
  }

  return (
    <div className="border border-slate-200 bg-white rounded-medium p-6 shadow-subtle space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 select-none">
        <Sparkles size={16} className="text-primary shrink-0" />
        <div className="leading-tight">
          <h4 className="text-xs font-bold text-slate-750 uppercase tracking-wider flex items-center">
            AI Operations & Recommendation Panel
            <HelpTooltip text="Suggests next actions using outputs from the five-agent reasoning pipeline." />
          </h4>
          <p className="text-[9px] text-slate-450 mt-0.5">
            Suggested escalation routing, priority, and next administrative steps derived from evidence.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: Department & Priority Metrics */}
        <div className="space-y-4">
          {/* Department Recommendation */}
          <div className="flex gap-3">
            <Building2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Target Authority Department
              </span>
              <span className="text-xs font-bold text-slate-800 block">
                {deptInfo.dept}
              </span>
              <span className="text-[10px] text-slate-500 block">
                {deptInfo.wing}
              </span>
            </div>
          </div>

          {/* Priority suggestion */}
          <div className="flex gap-3">
            <ShieldAlert size={16} className="text-slate-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Suggested Priority & Urgency
              </span>
              <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded border ${priorityColor}`}>
                {suggestedPriority}
              </span>
              <span className="text-[10px] text-slate-500 block">
                Based on visual severity assessment level {issue.severity}/5
              </span>
            </div>
          </div>

          {/* Escalation Window */}
          <div className="flex gap-3">
            <Clock size={16} className="text-slate-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Recommended Action Window
              </span>
              <span className="text-xs font-semibold text-slate-700 block">
                {escalationWindow}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Spatial Cluster & Recommended Next Step */}
        <div className="space-y-4">
          {/* Spatial deduplication duplicates check */}
          <div className="flex gap-3">
            <Layers size={16} className="text-slate-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Spatial Clustering (Agent 2)
              </span>
              <span className="text-xs font-bold text-slate-800 block">
                {cluster && cluster.report_count > 1 
                  ? `${cluster.report_count} Reports Compiled` 
                  : 'Solitary Incident Report'}
              </span>
              <p className="text-[10px] text-slate-500 leading-normal max-w-sm">
                {cluster && cluster.report_count > 1 
                  ? `Spatial deduplication verified: ${cluster.report_count - 1} duplicate citizen uploads merged into this case file.`
                  : 'No duplicate uploads detected nearby. Monitoring coordinates for new reports.'}
              </p>
            </div>
          </div>

          {/* Recommended next step block */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-small p-4.5 space-y-1.5">
            <div className="flex items-center gap-1">
              <ArrowRight size={13} className="text-primary" />
              <span className="text-[9px] font-bold text-slate-550 uppercase tracking-wider">
                Recommended Next Step
              </span>
            </div>
            <span className="text-xs font-bold text-slate-800 block leading-tight">
              {nextAction}
            </span>
            <p className="text-[10px] text-slate-500 leading-normal">
              {nextActionDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
