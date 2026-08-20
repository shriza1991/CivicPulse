import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Issue, Cluster, ImpactSummary, ActionDraft } from '@/api/types';

export type StepState = 'pending' | 'running' | 'completed' | 'failed';

export interface TimelineStepData {
  number: number;
  name: string;
  agentLabel: string;
  description: string;
  status: StepState;
}

interface AgentTimelineProps {
  // Post-upload issue data
  issue?: Issue;
  cluster?: Cluster | null;
  impactSummary?: ImpactSummary | null;
  actionDrafts?: ActionDraft[];

  // Upload/Submission state
  isSubmitting?: boolean;
  elapsedSeconds?: number;
  submitError?: string | null;

  // Custom steps override
  steps?: TimelineStepData[];
  className?: string;
  
  // Layout mode
  layout?: 'horizontal' | 'vertical' | 'responsive';
}

export const AgentTimelineComponent: React.FC<AgentTimelineProps> = ({
  issue,
  cluster,
  impactSummary,
  actionDrafts,
  isSubmitting,
  elapsedSeconds,
  submitError,
  steps,
  className,
  layout = 'responsive',
}) => {
  // Memoize derived states of the 5 stages to optimize rendering performance
  const computedSteps = useMemo(() => {
    if (steps) return steps;

    // Check if we are in upload/submitting state
    if (isSubmitting || submitError) {
      const elapsed = elapsedSeconds ?? 0;
      // Dynamic step progress indicator based on elapsed seconds during processing
      const step0: StepState = submitError ? 'failed' : 'completed';
      const step1: StepState = submitError ? 'failed' : (elapsed > 2 ? 'completed' : 'running');
      const step2: StepState = submitError ? 'failed' : (elapsed > 5 ? (elapsed > 8 ? 'completed' : 'running') : 'pending');
      const step3: StepState = submitError ? 'failed' : (elapsed > 8 ? 'running' : 'pending');
      const step4: StepState = 'pending';
      const step5: StepState = 'pending';

      return [
        {
          number: 1,
          name: 'Demand Intake & Media Intake',
          agentLabel: 'Stage 1: Intake Gateway',
          description: 'Secures citizen voice/photo evidence and parses geographic metadata.',
          status: step0,
        },
        {
          number: 2,
          name: 'Evidence Trust Verification',
          agentLabel: 'Stage 2: Evidence Gate',
          description: 'Validates resolution, media integrity, blur, and runs AI visual check.',
          status: step1,
        },
        {
          number: 3,
          name: 'Demand Understanding & Structuring',
          agentLabel: 'Stage 3: Demand Parser',
          description: 'Extracts infrastructure need, category, and severity from multimodal signals.',
          status: step2,
        },
        {
          number: 4,
          name: 'Community Demand Hotspot Correlation',
          agentLabel: 'Stage 4: Spatial Engine',
          description: 'Triggers Haversine spatial correlation and aggregates into Demand Clusters.',
          status: step3,
        },
        {
          number: 5,
          name: 'Demographic & Infrastructure Data Fusion',
          agentLabel: 'Stage 5: Data Fusion',
          description: 'Overlays census demographics, vulnerability indices, and public investment data.',
          status: step4,
        },
        {
          number: 6,
          name: 'Priority Engine & Policy Recommendation',
          agentLabel: 'Stage 6: Policy Advisor',
          description: 'Computes deterministic priority score and generates explainable brief.',
          status: step5,
        },
      ];
    }

    const status = issue?.status;

    // 1. Intake Verification: Completed if issue exists
    const stage0Status: StepState = issue ? 'completed' : 'pending';

    // 2. Evidence Trust: Completed if issue exists
    const stage1Status: StepState = issue ? 'completed' : 'pending';

    // 3. Demand Correlation: Completed if clustered
    let stage2Status: StepState = 'pending';
    if (issue?.cluster_id) {
      stage2Status = 'completed';
    } else if (status === 'classified') {
      stage2Status = 'running';
    }

    // 4. Data Fusion: Completed if impact summary exists
    let stage3Status: StepState = 'pending';
    if (impactSummary) {
      stage3Status = 'completed';
    } else if (stage2Status === 'completed') {
      stage3Status = 'running';
    }

    // 5. Policy Formulation: Completed if action drafts / brief exist
    let stage4Status: StepState = 'pending';
    if (actionDrafts && actionDrafts.length > 0) {
      stage4Status = 'completed';
    } else if (stage3Status === 'completed') {
      stage4Status = 'running';
    }

    // 6. Policymaker Review & Action
    let stage5Status: StepState = 'pending';
    if (status === 'approved' || status === 'escalated') {
      stage5Status = 'completed';
    } else if (stage4Status === 'completed') {
      stage5Status = 'pending';
    }

    return [
      {
        number: 1,
        name: 'Demand Intake & Media Intake',
        agentLabel: 'Stage 1: Intake Gateway',
        description: 'Secures citizen voice/photo evidence and parses geographic metadata.',
        status: stage0Status,
      },
      {
        number: 2,
        name: 'Evidence Trust Verification',
        agentLabel: 'Stage 2: Evidence Gate',
        description: 'Validates resolution, media integrity, blur, and runs AI visual check.',
        status: stage1Status,
      },
      {
        number: 3,
        name: 'Demand Understanding & Structuring',
        agentLabel: 'Stage 3: Demand Parser',
        description: 'Extracts infrastructure need, category, and severity from multimodal signals.',
        status: stage2Status,
      },
      {
        number: 4,
        name: 'Community Demand Hotspot Correlation',
        agentLabel: 'Stage 4: Spatial Engine',
        description: 'Triggers Haversine spatial correlation and aggregates into Demand Clusters.',
        status: stage3Status,
      },
      {
        number: 5,
        name: 'Demographic & Infrastructure Data Fusion',
        agentLabel: 'Stage 5: Data Fusion',
        description: 'Overlays census demographics, vulnerability indices, and public investment data.',
        status: stage4Status,
      },
      {
        number: 6,
        name: 'Priority Engine & Policy Recommendation',
        agentLabel: 'Stage 6: Policy Advisor',
        description: 'Computes deterministic priority score and generates explainable brief.',
        status: stage5Status,
      },
    ];
  }, [
    steps,
    issue,
    cluster,
    impactSummary,
    actionDrafts,
    isSubmitting,
    elapsedSeconds,
    submitError,
  ]);

  const isVertical = layout === 'vertical';
  const isHorizontal = layout === 'horizontal';
  const isResponsive = !isVertical && !isHorizontal;

  return (
    <div className={cn('w-full py-2', className)}>
      <ul
        role="list"
        className={cn(
          'flex select-none',
          isVertical ? 'flex-col gap-6' : isHorizontal ? 'flex-row gap-4' : 'flex-col md:flex-row md:gap-0 gap-8 w-full justify-between'
        )}
      >
        {computedSteps.map((step, stepIdx) => {
          const isLast = stepIdx === computedSteps.length - 1;

          return (
            <li
              key={step.number}
              tabIndex={0}
              aria-label={`Stage ${step.number}: ${step.name}. Status: ${step.status}`}
              className="relative flex-1 focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:outline-none rounded-medium p-1 transition-all"
            >
              {/* Connecting line - Mobile (Vertical) or Forced Vertical */}
              {!isLast && (isVertical || isResponsive) && (
                <span
                  className={cn(
                    'absolute left-[19px] top-[21px] w-[2px] h-[calc(100%+1.5rem)] -z-10 transition-colors duration-300',
                    isResponsive && 'md:hidden',
                    step.status === 'completed' ? 'bg-emerald-600' : 'bg-slate-200'
                  )}
                  aria-hidden="true"
                />
              )}

              {/* Connecting line - Desktop (Horizontal) or Forced Horizontal */}
              {!isLast && (isHorizontal || isResponsive) && (
                <span
                  className={cn(
                    'absolute top-[21px] left-[50%] w-full h-[2px] -z-10 transition-colors duration-300',
                    isResponsive && 'hidden md:block',
                    step.status === 'completed' ? 'bg-emerald-600' : 'bg-slate-200'
                  )}
                  aria-hidden="true"
                />
              )}

              <div className={cn(
                'flex items-start gap-4 relative',
                isVertical ? 'flex-row text-left' : isHorizontal ? 'flex-col items-center text-center' : 'flex-row md:flex-col items-start md:items-center gap-4 md:gap-3 text-left md:text-center'
              )}>
                {/* Stage Indicator Circle */}
                <div className="shrink-0">
                  <span
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 bg-white shadow-sm',
                      step.status === 'completed' && 'bg-emerald-50 border-emerald-600 text-emerald-700',
                      step.status === 'running' && 'bg-teal-50 border-primary text-primary',
                      step.status === 'failed' && 'bg-rose-50 border-rose-500 text-rose-700',
                      step.status === 'pending' && 'bg-slate-50 border-slate-200 text-slate-400'
                    )}
                  >
                    {step.status === 'completed' && <CheckCircle2 size={18} className="shrink-0" />}
                    {step.status === 'failed' && <AlertCircle size={18} className="shrink-0" />}
                    {step.status === 'running' && (
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                        className="w-3 h-3 rounded-full bg-primary shrink-0"
                      />
                    )}
                    {step.status === 'pending' && (
                      <span className="text-xs font-semibold">{step.number}</span>
                    )}
                  </span>
                </div>

                {/* Stage Descriptions */}
                <div className="space-y-0.5 pt-1 md:pt-0">
                  <h4 className={cn(
                    "text-xs font-bold font-sans tracking-tight leading-none",
                    step.status === 'pending' ? 'text-slate-400' : 'text-secondary-foreground'
                  )}>
                    {step.name}
                  </h4>
                  <span className={cn(
                    "inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded leading-none mt-1 select-none font-sans border",
                    step.status === 'completed' && 'bg-emerald-50 border-emerald-200 text-emerald-800',
                    step.status === 'running' && 'bg-teal-50 border-teal-200 text-teal-800',
                    step.status === 'failed' && 'bg-rose-50 border-rose-200 text-rose-800',
                    step.status === 'pending' && 'bg-slate-50 border-slate-200 text-slate-450'
                  )}>
                    {step.agentLabel}
                  </span>
                  <p className={cn(
                    "text-[10px] text-slate-500 leading-normal font-sans font-normal pt-1.5",
                    isResponsive ? 'hidden md:block' : 'block'
                  )}>
                    {step.description}
                  </p>
                  {isResponsive && (
                    <p className="block md:hidden text-[11px] text-slate-500 leading-normal font-sans font-normal pt-1">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const AgentTimeline = React.memo(AgentTimelineComponent);
export default AgentTimeline;
