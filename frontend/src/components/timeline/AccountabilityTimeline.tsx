import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import type { Issue, ActionDraft } from '@/api/types';
import { cn } from '@/lib/utils';

interface AccountabilityTimelineProps {
  issue: Issue;
  actionDrafts: ActionDraft[];
}

export const AccountabilityTimeline: React.FC<AccountabilityTimelineProps> = ({
  issue,
  actionDrafts,
}) => {
  const status = issue.status;

  const isReportCreated = true;
  const isAiVerified = issue.credibility_score >= 0.8;
  const isComplaintGenerated = status === 'drafted' || status === 'escalated' || actionDrafts.length > 0;
  const isSentToAuthority = status === 'escalated';

  const timelineSteps = [
    {
      label: 'Report Created',
      description: 'Logged on spatial ledger with visual photo proof.',
      isCompleted: isReportCreated,
      isActive: false,
    },
    {
      label: 'AI Verified',
      description: 'Gemini confirmed credibility score & integrity.',
      isCompleted: isAiVerified,
      isActive: !isAiVerified && isReportCreated,
    },
    {
      label: 'Complaint Generated',
      description: 'Official RTI & grievance dispatches drafted.',
      isCompleted: isComplaintGenerated,
      isActive: !isComplaintGenerated && isAiVerified,
    },
    {
      label: 'Sent to Authority',
      description: 'Brief sent via email or exported as PDF package.',
      isCompleted: isSentToAuthority,
      isActive: !isSentToAuthority && isComplaintGenerated,
    },
    {
      label: 'Awaiting Response',
      description: 'Expected 30-day statutory response window.',
      isCompleted: false,
      isActive: isSentToAuthority,
      isExpected: true,
    },
    {
      label: 'Assigned',
      description: 'Expected delegation to local ward engineer.',
      isCompleted: false,
      isActive: false,
      isExpected: true,
    },
    {
      label: 'Inspection',
      description: 'Expected on-site verification survey.',
      isCompleted: false,
      isActive: false,
      isExpected: true,
    },
    {
      label: 'Repair Phase',
      description: 'Scheduled municipal works restoration.',
      isCompleted: false,
      isActive: false,
      isExpected: true,
    },
    {
      label: 'Citizen Audit',
      description: 'Resident verification of work closure.',
      isCompleted: false,
      isActive: false,
      isExpected: true,
    },
    {
      label: 'Case Closed',
      description: 'Archived on public spatial ledger.',
      isCompleted: false,
      isActive: false,
      isExpected: true,
    },
  ];

  return (
    <div className="border border-slate-200 bg-white rounded-medium p-6 shadow-subtle space-y-6">
      <div className="space-y-1 select-none border-b border-slate-100 pb-3">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Citizen Accountability Pathway
        </h4>
        <p className="text-[10px] text-slate-450">
          Tracking completed operational milestones and upcoming expected municipal resolution stages.
        </p>
      </div>

      <div className="relative pl-6 md:pl-0">
        {/* Connecting Line */}
        <div className="absolute left-[13px] md:left-0 top-3 bottom-3 w-[2px] md:w-full md:h-[2px] bg-slate-100 -z-10 md:top-[12px] md:translate-y-[-50%]" />

        <div className="flex flex-col md:flex-row gap-6 md:gap-4 justify-between">
          {timelineSteps.map((step, idx) => (
            <div key={idx} className="flex md:flex-col items-start md:items-center gap-3 md:gap-2 md:text-center flex-1">
              {/* Icon Circle */}
              <div className="relative z-10 shrink-0">
                {step.isCompleted ? (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 border border-emerald-500 text-emerald-600 shadow-sm">
                    <CheckCircle2 size={12} className="stroke-[2.5]" />
                  </span>
                ) : step.isActive ? (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-50 border border-amber-500 text-amber-600 shadow-sm animate-pulse">
                    <Clock size={12} className="stroke-[2.5]" />
                  </span>
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-350 shadow-sm">
                    <Circle size={6} className="fill-slate-200 stroke-none" />
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="space-y-0.5 leading-tight">
                <span className={cn(
                  "text-[10px] font-bold block font-sans",
                  step.isCompleted ? "text-emerald-700" : step.isActive ? "text-amber-700 animate-pulse" : "text-slate-500"
                )}>
                  {step.label}
                </span>

                {step.isCompleted && (
                  <span className="inline-block text-[8px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-250 rounded px-1.5 py-0.5 leading-none mt-0.5 select-none font-sans uppercase">
                    Verified
                  </span>
                )}
                {step.isActive && (
                  <span className="inline-block text-[8px] font-bold text-amber-800 bg-amber-50 border border-amber-250 rounded px-1.5 py-0.5 leading-none mt-0.5 select-none font-sans uppercase">
                    Active
                  </span>
                )}
                {step.isExpected && !step.isActive && !step.isCompleted && (
                  <span className="inline-block text-[8px] font-bold text-slate-400 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 leading-none mt-0.5 select-none font-sans uppercase">
                    Expected
                  </span>
                )}

                <p className="text-[9px] text-slate-450 leading-relaxed font-sans mt-1.5 max-w-[110px] hidden md:block select-none">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
