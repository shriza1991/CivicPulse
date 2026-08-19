import React from 'react';
import { Container } from '../primitives/foundation/Container';
import { Progress } from '../primitives/feedback/Progress';
import { cn } from '../../lib/utils';

export interface Step {
  id: number;
  label: string;
}

export interface ReportFlowLayoutProps {
  currentStep: number;
  steps: Step[];
  children: React.ReactNode;
  actions: React.ReactNode;
  className?: string;
}

export const ReportFlowLayout: React.FC<ReportFlowLayoutProps> = ({
  currentStep,
  steps,
  children,
  actions,
  className,
}) => {
  const percent = Math.round((currentStep / steps.length) * 100);

  return (
    <Container width="narrow" className={cn('py-6 font-sans space-y-6', className)}>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-neutral-900">
          <span>Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.label}</span>
          <span className="font-mono">{percent}% Complete</span>
        </div>
        <Progress value={percent} tone="primary" />
      </div>

      <div className="p-6 bg-white border border-neutral-200 rounded-lg shadow-subtle space-y-4">
        {children}
      </div>

      <div className="sticky bottom-4 z-20 p-4 bg-white/95 backdrop-blur-md border border-neutral-200 rounded-lg shadow-modal flex items-center justify-between gap-3">
        {actions}
      </div>
    </Container>
  );
};
